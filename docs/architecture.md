# Architecture

Technical architecture for the FilmBuddy iOS application.

## Stack Overview

| Layer | Technology |
|-------|------------|
| Package Manager | Yarn 4 (Berry) with workspaces |
| Framework | Expo SDK 54 (managed workflow) |
| Language | TypeScript |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Navigation | Expo Router (file-based routing) |
| State Management | Zustand |
| Data Persistence | Drizzle ORM + expo-sqlite |
| CI/CD | GitHub Actions + Fastlane |
| OTA Updates | hot-updater (S3 + CloudFront) |
| Platform | iOS only |

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

### .yarnrc.yml

```yaml
nodeLinker: node-modules
nmHoistingLimits: workspaces
enableGlobalCache: true
```

**Why `node-modules` linker:** Yarn Berry's Plug'n'Play is incompatible with React Native. The `node-modules` linker provides traditional resolution that Metro bundler expects.

**Why `nmHoistingLimits: workspaces`:** Prevents hoisting issues that can cause duplicate React instances (which crash React Native apps).

### Root package.json

```json
{
  "name": "filmbuddy",
  "private": true,
  "packageManager": "yarn@4.9.4",
  "workspaces": ["apps/*"],
  "scripts": {
    "mobile": "yarn workspace @filmbuddy/mobile",
    "start": "yarn workspace @filmbuddy/mobile start",
    "ios": "yarn workspace @filmbuddy/mobile ios",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",
    "typescript": "^5.4.0"
  }
}
```

## Expo Configuration

### apps/mobile/app.json

```json
{
  "expo": {
    "name": "FilmBuddy",
    "slug": "filmbuddy",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "filmbuddy",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "tech.mattb.filmbuddy",
      "infoPlist": {
        "NSCameraUsageDescription": "Used for the light meter feature",
        "NSLocationWhenInUseUsageDescription": "Used to tag notes with location"
      }
    },
    "plugins": [
      "expo-router",
      "expo-camera",
      "expo-location",
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "15.1",
            "newArchEnabled": true
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### OTA Updates (hot-updater)

[hot-updater](https://hot-updater.dev/) provides self-hosted OTA updates without EAS.

#### Dependencies

```bash
yarn add hot-updater @hot-updater/react-native
yarn add -D @hot-updater/expo @hot-updater/aws
```

#### apps/mobile/hot-updater.config.ts

```typescript
import { defineConfig } from "hot-updater";
import { expo } from "@hot-updater/expo";
import { s3Database, s3Storage } from "@hot-updater/aws";

export default defineConfig({
  build: expo({
    sourcemap: false,
  }),
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
    "plugins": [
      ["@hot-updater/react-native", { "channel": "production" }]
    ]
  }
}
```

## NativeWind Setup

NativeWind v4 brings Tailwind CSS to React Native with near-complete feature parity.

### apps/mobile/babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### apps/mobile/metro.config.js

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = withNativeWind(config, {
  input: "./global.css",
  projectRoot,
});
```

### apps/mobile/tailwind.config.js

Maps design system tokens to Tailwind utilities:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        amber: "#ecc24c",
        "slate-blue": "#487cab",
        paper: "#faf9f7",
        ink: "#1a1a1a",
        stone: "#6b6b6b",
        fog: "#e5e5e3",
        cloud: "#f2f1ef",
        error: "#c94a4a",
        success: "#4a9c6b",
        warning: "#d4915c",
      },
      fontFamily: {
        heading: ["Jost"],
        body: ["System"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 2px 8px rgba(0,0,0,0.08)",
        lg: "0 4px 16px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
```

### apps/mobile/global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### apps/mobile/nativewind-env.d.ts

```typescript
/// <reference types="nativewind/types" />
```

## Navigation

Expo Router provides file-based routing built on React Navigation.

### File Structure

```
app/
├── _layout.tsx           # Root layout (providers, global config)
├── (tabs)/
│   ├── _layout.tsx       # Tab bar configuration
│   ├── index.tsx         # First tab
│   ├── second.tsx        # Second tab
│   └── third.tsx         # Third tab
├── detail/
│   └── [id].tsx          # Dynamic route for detail screens
└── modal.tsx             # Modal screen
```

### Root Layout Pattern

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
```

### Tab Layout Pattern

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#487cab",
        tabBarInactiveTintColor: "#6b6b6b",
        tabBarStyle: {
          backgroundColor: "#f2f1ef",
          borderTopColor: "#e5e5e3",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      {/* Additional tabs */}
    </Tabs>
  );
}
```

## State Management

Zustand provides lightweight, TypeScript-first state management.

### Store Pattern

```typescript
// stores/exampleStore.ts
import { create } from "zustand";

interface Item {
  id: string;
  name: string;
}

interface ExampleStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
}

export const useExampleStore = create<ExampleStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
}));
```

### Persistence with Drizzle

For simple cases, use Drizzle's `useLiveQuery` directly in components (see Data Layer section). For complex state that combines multiple data sources or derived state, Zustand stores can wrap Drizzle queries:

```typescript
// stores/persistedStore.ts
import { create } from "zustand";
import * as queries from "../db/queries";
import type { Item, NewItem } from "../db/schema";

interface PersistedStore {
  items: Item[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addItem: (item: NewItem) => Promise<void>;
}

export const usePersistedStore = create<PersistedStore>((set) => ({
  items: [],
  isHydrated: false,

  hydrate: async () => {
    const items = await queries.getAllItems();
    set({ items, isHydrated: true });
  },

  addItem: async (itemData) => {
    const item = await queries.insertItem(itemData);
    set((state) => ({ items: [...state.items, item] }));
  },
}));
```

**When to use each approach:**
- `useLiveQuery`: Simple list/detail views that display database data directly
- Zustand + Drizzle: Complex UI state, optimistic updates, combining multiple queries

## Data Layer

Drizzle ORM provides type-safe database access over expo-sqlite.

### Dependencies

```bash
yarn add drizzle-orm expo-sqlite
yarn add -D drizzle-kit babel-plugin-inline-import
```

### Schema Definition

Drizzle schemas provide full TypeScript inference for queries:

```typescript
// db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// TypeScript types are inferred from schema
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
```

### Database Initialization

```typescript
// db/index.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const expo = openDatabaseSync("app.db", { enableChangeListener: true });

export const db = drizzle(expo, { schema });
```

### Type-Safe Queries

```typescript
// db/queries.ts
import { eq, desc } from "drizzle-orm";
import { db } from "./index";
import { items, type Item, type NewItem } from "./schema";

export async function getAllItems(): Promise<Item[]> {
  return db.select().from(items).orderBy(desc(items.createdAt));
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const result = await db.select().from(items).where(eq(items.id, id));
  return result[0];
}

export async function insertItem(item: NewItem): Promise<Item> {
  const result = await db.insert(items).values(item).returning();
  return result[0];
}

export async function updateItem(id: string, updates: Partial<NewItem>): Promise<Item> {
  const result = await db
    .update(items)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(items.id, id))
    .returning();
  return result[0];
}

export async function deleteItem(id: string): Promise<void> {
  await db.delete(items).where(eq(items.id, id));
}
```

### Live Queries

Drizzle's `useLiveQuery` hook automatically re-renders components when data changes:

```tsx
// components/ItemList.tsx
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../db";
import { items } from "../db/schema";

export function ItemList() {
  const { data, error } = useLiveQuery(
    db.select().from(items).orderBy(desc(items.createdAt))
  );

  if (error) return <Text>Error: {error.message}</Text>;
  if (!data) return <Text>Loading...</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ItemRow item={item} />}
    />
  );
}
```

### Migrations

Drizzle Kit generates migrations from schema changes.

#### drizzle.config.ts

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
} satisfies Config;
```

#### Generate migrations

```bash
npx drizzle-kit generate
```

#### Apply migrations in app

```tsx
// app/_layout.tsx
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "../db";
import migrations from "../drizzle/migrations";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <Text>Migration error: {error.message}</Text>;
  }

  if (!success) {
    return <Text>Running migrations...</Text>;
  }

  return <Stack />;
}
```

#### Babel configuration for migrations

Add to `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["inline-import", { extensions: [".sql"] }],
    ],
  };
};
```

#### Metro configuration for SQL files

Add to `metro.config.js`:

```javascript
config.resolver.sourceExts.push("sql");
```

## Development Workflow

### Initial Setup

```bash
# Enable Corepack for Yarn 4
corepack enable

# Install dependencies
yarn install
```

### Daily Development

```bash
# Start Expo development server
yarn start

# Press 'i' to open iOS Simulator
# Or scan QR code with Expo Go app
```

### Running on Simulator

```bash
# Direct launch to iOS Simulator
yarn ios
```

### Building for Device

```bash
# Generate native iOS project
cd apps/mobile && npx expo prebuild --platform ios

# Open in Xcode
open apps/mobile/ios/FilmBuddy.xcworkspace

# Build and run from Xcode
```

### CI/CD (GitHub Actions + Fastlane)

Builds run on GitHub Actions using Fastlane for iOS automation.

#### .github/workflows/ios.yml

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
        options:
          - beta
          - release

jobs:
  build:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Generate native project
        run: cd apps/mobile && npx expo prebuild --platform ios

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.2"
          bundler-cache: true
          working-directory: apps/mobile/ios

      - name: Install Fastlane
        run: cd apps/mobile/ios && bundle install

      - name: Run Fastlane
        env:
          APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}
          APP_STORE_CONNECT_API_ISSUER_ID: ${{ secrets.APP_STORE_CONNECT_API_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_URL: ${{ secrets.MATCH_GIT_URL }}
        run: cd apps/mobile/ios && bundle exec fastlane ${{ inputs.lane || 'beta' }}
```

#### apps/mobile/ios/fastlane/Fastfile

```ruby
default_platform(:ios)

platform :ios do
  before_all do
    setup_ci if ENV['CI']
  end

  desc "Sync certificates and profiles"
  lane :sync_certs do
    match(type: "appstore", readonly: true)
  end

  desc "Build and upload to TestFlight"
  lane :beta do
    sync_certs
    increment_build_number(xcodeproj: "FilmBuddy.xcodeproj")
    build_app(
      workspace: "FilmBuddy.xcworkspace",
      scheme: "FilmBuddy",
      export_method: "app-store"
    )
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end

  desc "Build and submit to App Store"
  lane :release do
    sync_certs
    increment_build_number(xcodeproj: "FilmBuddy.xcodeproj")
    build_app(
      workspace: "FilmBuddy.xcworkspace",
      scheme: "FilmBuddy",
      export_method: "app-store"
    )
    upload_to_app_store(
      submit_for_review: true,
      automatic_release: true
    )
  end
end
```

#### apps/mobile/ios/Gemfile

```ruby
source "https://rubygems.org"

gem "fastlane"
gem "cocoapods"
```

#### Code Signing with Match

Fastlane Match stores certificates in a private Git repo:

```bash
# Initial setup (run once)
cd apps/mobile/ios
bundle exec fastlane match init
bundle exec fastlane match appstore
```

### OTA Updates

Deploy JavaScript bundle updates without App Store review:

```bash
# Build and deploy update
npx hot-updater deploy --channel production

# Rollback if needed
npx hot-updater rollback --channel production
```

### Type Checking

```bash
yarn typecheck
```

### Linting

```bash
yarn lint
```

