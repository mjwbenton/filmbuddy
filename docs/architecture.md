# Architecture

Technical architecture for the FilmBuddy iOS application.

## Stack Overview

| Layer            | Technology                                    |
| ---------------- | --------------------------------------------- |
| Package Manager  | Yarn 4 (Berry) with workspaces                |
| Framework        | Expo SDK 54 (managed workflow)                |
| Language         | TypeScript                                    |
| Styling          | NativeWind v4 (Tailwind CSS for React Native) |
| Navigation       | Expo Router (file-based routing)              |
| State Management | Zustand                                       |
| Data Persistence | Drizzle ORM + expo-sqlite                     |
| CI/CD            | GitHub Actions + Fastlane                     |
| OTA Updates      | hot-updater (S3 + CloudFront)                 |
| Platform         | iOS only                                      |

## Project Structure

```
filmbuddy/
├── apps/
│   └── mobile/                 # Expo application
│       ├── app/                # Expo Router screens
│       │   ├── (tabs)/         # Tab navigation group
│       │   │   ├── _layout.tsx # Tab bar configuration
│       │   │   ├── index.tsx   # First tab (home)
│       │   │   ├── [tab].tsx   # Additional tabs
│       │   └── _layout.tsx     # Root layout
│       ├── components/         # Reusable UI components
│       ├── hooks/              # Custom React hooks
│       ├── stores/             # Zustand state stores
│       ├── db/                 # SQLite schema and queries
│       ├── utils/              # Utility functions
│       ├── types/              # TypeScript type definitions
│       ├── assets/             # App-specific assets
│       ├── app.json            # Expo configuration
│       ├── babel.config.js     # Babel configuration
│       ├── metro.config.js     # Metro bundler configuration
│       ├── tailwind.config.js  # Tailwind/NativeWind configuration
│       ├── global.css          # Base Tailwind styles
│       ├── tsconfig.json       # TypeScript configuration
│       └── package.json        # App dependencies
├── assets/                     # Shared assets (icons, images)
├── docs/                       # Documentation
├── .yarnrc.yml                 # Yarn configuration
├── package.json                # Root workspace configuration
└── tsconfig.base.json          # Shared TypeScript configuration
```

## Yarn Workspaces

Yarn 4 workspaces provide a foundation for future package extraction while keeping a simple structure today.

**Why `node-modules` linker:** Yarn Berry's Plug'n'Play is incompatible with React Native. The `node-modules` linker provides traditional resolution that Metro bundler expects.

**Why `nmHoistingLimits: workspaces`:** Prevents hoisting issues that can cause duplicate React instances (which crash React Native apps).

See [.yarnrc.yml](../.yarnrc.yml) and root [package.json](../package.json) for configuration.

## Expo Configuration

See [apps/mobile/app.json](../apps/mobile/app.json) for Expo configuration including plugins and iOS settings.

### OTA Updates (hot-updater)

[hot-updater](https://hot-updater.dev/) provides self-hosted OTA updates without EAS.

```bash
yarn add hot-updater @hot-updater/react-native
yarn add -D @hot-updater/expo @hot-updater/aws
```

Create `apps/mobile/hot-updater.config.ts`:

```typescript
import { defineConfig } from "hot-updater";
import { expo } from "@hot-updater/expo";
import { s3Database, s3Storage } from "@hot-updater/aws";

export default defineConfig({
  build: expo({ sourcemap: false }),
  storage: s3Storage({
    bucketName: "filmbuddy-updates",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  }),
  database: s3Database({
    bucketName: "filmbuddy-updates",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    cloudfrontDistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  }),
});
```

Add the runtime plugin to `app.json`:

```json
{
  "expo": {
    "plugins": [["@hot-updater/react-native", { "channel": "production" }]]
  }
}
```

## NativeWind Setup

NativeWind v4 brings Tailwind CSS to React Native with near-complete feature parity.

See configuration files:

- [babel.config.js](../apps/mobile/babel.config.js)
- [metro.config.js](../apps/mobile/metro.config.js)
- [tailwind.config.js](../apps/mobile/tailwind.config.js) - Maps design system tokens to Tailwind utilities
- [global.css](../apps/mobile/global.css)

## Navigation

Expo Router provides file-based routing built on React Navigation.

See layout files:

- [app/\_layout.tsx](../apps/mobile/app/_layout.tsx) - Root layout with font loading
- [app/(tabs)/\_layout.tsx](<../apps/mobile/app/(tabs)/_layout.tsx>) - Tab bar configuration

## State Management

Zustand provides lightweight, TypeScript-first state management. Store definitions live in [stores/](../apps/mobile/stores/).

### Store Pattern

```typescript
// stores/exampleStore.ts
import { create } from "zustand";

interface ExampleStore {
  items: Item[];
  addItem: (item: Item) => void;
}

export const useExampleStore = create<ExampleStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
```

### Persistence with Drizzle

For simple cases, use Drizzle's `useLiveQuery` directly in components. For complex state that combines multiple data sources or derived state, Zustand stores can wrap Drizzle queries.

**When to use each approach:**

- `useLiveQuery`: Simple list/detail views that display database data directly
- Zustand + Drizzle: Complex UI state, optimistic updates, combining multiple queries

## Data Layer

Drizzle ORM provides type-safe database access over expo-sqlite.

See configuration files:

- [db/index.ts](../apps/mobile/db/index.ts) - Database initialization
- [db/schema.ts](../apps/mobile/db/schema.ts) - Schema definitions
- [drizzle.config.ts](../apps/mobile/drizzle.config.ts) - Drizzle Kit configuration

### Schema Pattern

Define tables using Drizzle's schema builder, then infer types:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
```

### Live Queries

Use `useLiveQuery` for reactive data that updates when the database changes:

```tsx
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../db";
import { items } from "../db/schema";

export function ItemList() {
  const { data, error } = useLiveQuery(
    db.select().from(items).orderBy(desc(items.createdAt)),
  );
  // ...
}
```

### Migrations

Generate migrations after schema changes:

```bash
npx drizzle-kit generate
```

## Development Workflow

### Initial Setup

```bash
corepack enable
yarn install
```

### Daily Development

```bash
yarn start     # Start Expo dev server, press 'i' for iOS Simulator
yarn ios       # Direct launch to iOS Simulator
```

### Building for Device

```bash
cd apps/mobile && npx expo prebuild --platform ios
open apps/mobile/ios/FilmBuddy.xcworkspace
```

### Type Checking & Linting

```bash
yarn typecheck
yarn lint
```

## CI/CD (GitHub Actions + Fastlane)

Builds run on GitHub Actions using Fastlane for iOS automation.

### .github/workflows/ios.yml

```yaml
name: iOS Build

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      lane:
        description: "Fastlane lane to run"
        required: true
        default: "beta"
        type: choice
        options: [beta, release]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "yarn"
      - run: yarn install --frozen-lockfile
      - run: cd apps/mobile && npx expo prebuild --platform ios
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.2"
          bundler-cache: true
          working-directory: apps/mobile/ios
      - run: cd apps/mobile/ios && bundle install
      - run: cd apps/mobile/ios && bundle exec fastlane ${{ inputs.lane || 'beta' }}
        env:
          APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}
          APP_STORE_CONNECT_API_ISSUER_ID: ${{ secrets.APP_STORE_CONNECT_API_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_URL: ${{ secrets.MATCH_GIT_URL }}
```

### Fastlane Setup

Create `apps/mobile/ios/Gemfile`:

```ruby
source "https://rubygems.org"
gem "fastlane"
gem "cocoapods"
```

Create `apps/mobile/ios/fastlane/Fastfile` with `beta` and `release` lanes using Match for code signing.

### OTA Updates

```bash
npx hot-updater deploy --channel production
npx hot-updater rollback --channel production
```
