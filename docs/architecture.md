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
│       │   └── ui/             # Generic UI primitives (Button, Card, etc.)
│       ├── hooks/              # Custom React hooks
│       ├── stores/             # Zustand state stores
│       ├── db/                 # Drizzle schema, migrations, and Zod schemas
│       ├── utils/              # Utility functions
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

## UI Components

Generic UI primitives live in `src/components/ui/` and provide consistent styling across the app.

### Available Components

| Component            | Purpose                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------- |
| `Button`             | Interactive button with `primary`, `secondary`, `destructive` variants                  |
| `Card`               | Container with optional `active` state and pressable behavior                           |
| `Text`               | Typography with `display`, `heading`, `subheading`, `body`, `caption`, `small` variants |
| `TextInput`          | React-hook-form aware input with integrated label and error display                     |
| `Label`              | Form field label for custom inputs                                                      |
| `ErrorMessage`       | Form validation error display                                                           |
| `SectionHeader`      | Uppercase section title for list groupings                                              |
| `ScreenHeader`       | Form screen header with left/title/right slots                                          |
| `HeaderCancelButton` | Cancel button for screen headers                                                        |
| `HeaderCloseButton`  | Close button for screen headers                                                         |
| `HeaderSaveButton`   | Save button with disabled state for screen headers                                      |

### Usage

```tsx
import {
  Button,
  Card,
  Text,
  TextInput,
  ScreenHeader,
  HeaderCancelButton,
  HeaderSaveButton,
} from "@/components/ui";

// Button variants
<Button onPress={handleSave}>Save</Button>
<Button variant="secondary" onPress={handleCancel}>Cancel</Button>
<Button variant="destructive" onPress={handleDelete}>Delete</Button>

// Card with active state
<Card active={isActive} onPress={handlePress}>
  <Text variant="subheading">Title</Text>
  <Text variant="caption" color="stone">Subtitle</Text>
</Card>

// Form input (react-hook-form aware)
<TextInput
  label="Name"
  name="name"
  control={form.control}
  placeholder="Enter name"
/>

// Screen header with Cancel/Save buttons
<ScreenHeader
  title="Add Item"
  left={<HeaderCancelButton onPress={() => router.back()} />}
  right={<HeaderSaveButton onPress={handleSubmit} disabled={!canSubmit} />}
/>
```

### Design Principles

- **No app logic**: Components are purely presentational
- **Design system aligned**: Styling matches `docs/design.md` tokens
- **Accessible**: Proper touch targets (44pt minimum), accessibility roles
- **Composable**: Simple props, combine to build complex UI

## Form Handling

Forms use [react-hook-form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.

### Why These Libraries

- **react-hook-form**: Minimal re-renders (ref-based), excellent React Native support via `Controller`
- **Zod**: TypeScript-first validation with type inference, reusable for API validation
- **@hookform/resolvers**: Connects react-hook-form to Zod

### Pattern Overview

1. **Schema** (`src/db/[domain].ts`): Define Drizzle table + Zod schemas using drizzle-zod
2. **Hook** (`src/hooks/`): Create `useXxxForm` hook wrapping `useForm` with `zodResolver`
3. **Component** (`src/components/`): Presentational form using `TextInput` from `@/components/ui`
4. **Screen** (`app/`): Uses the hook, passes `form` to component

The `TextInput` component handles `Controller` integration internally, simplifying form components.

### Example: Form Hook

**`src/hooks/useRollForm.ts`:**

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rollFormSchema, RollForm } from "@/db/schema";

export function useRollForm({ defaultValues, onSubmit }) {
  const form = useForm<RollForm>({
    resolver: zodResolver(rollFormSchema),
    defaultValues: { filmStock: "", iso: 100, camera: "", ...defaultValues },
    mode: "onSubmit",
  });

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    canSubmit: form.formState.isValid || !form.formState.isSubmitted,
  };
}
```

### Adding a New Form

1. Create domain file `src/db/[name].ts` with Drizzle table + Zod schemas
2. Export from `src/db/schema.ts`
3. Create hook in `src/hooks/use[Name]Form.ts`
4. Create component in `src/components/[Name]Form.tsx`
5. Use hook in screen, pass `form` to component

## State Management

Zustand provides lightweight, TypeScript-first state management. Store definitions live in [stores/](../apps/mobile/stores/).

### Store Pattern

```typescript
// stores/exampleStore.ts
import { create } from "zustand";
import { db } from "@/db";
import { randomUUID } from "expo-crypto";

interface ExampleStore {
  items: Item[];
  addItem: (item: Omit<Item, "id">) => Promise<void>;
}

export const useExampleStore = create<ExampleStore>((set) => ({
  items: [],
  addItem: async (item) => {
    const newItem = { id: randomUUID(), ...item };
    await db.insert(items).values(newItem);
    // reload from db...
  },
}));
```

Integration tests use `vi.mock` to replace Expo dependencies with test implementations. See [testing.md](testing.md#store-integration-testing) for details.

## Data Layer

Drizzle ORM provides type-safe database access over expo-sqlite.

### File Structure

Each domain has its own file containing both Drizzle table and Zod schemas:

```
db/
├── index.ts      # DB instance (expo-sqlite)
├── schema.ts     # Re-exports all tables and Zod schemas
├── roll.ts       # rolls table + Zod schemas
├── camera.ts     # cameras table + Zod schemas
├── lens.ts       # lenses table + Zod schemas
└── filmStock.ts  # filmStocks table + Zod schemas
```

Import patterns:

- `import { db } from "@/db"` - database instance
- `import { rolls, Roll, rollFormSchema } from "@/db/schema"` - tables, types, schemas

See also: [drizzle.config.ts](../apps/mobile/drizzle.config.ts) for Drizzle Kit configuration.

### Domain File Pattern

Each domain file contains a Drizzle table, types inferred from it, and Zod schemas for form validation:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table
export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Types (inferred from Drizzle)
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

// Zod schemas (for form validation only)
export const itemInsertSchema = createInsertSchema(items, {
  name: z.string().trim().min(1, "Name is required"),
});

export const itemFormSchema = itemInsertSchema.pick({ name: true });

export type ItemForm = z.infer<typeof itemFormSchema>;
```

**Why no select schema?** Data from our own database already matches the schema we used to write it. Zod validation is only needed at input boundaries (forms, APIs), not for trusted internal data.

### Migrations

Generate migrations after schema changes:

```bash
npx drizzle-kit generate
```

## Logging & Error Handling

A lightweight logger provides development-time visibility without production overhead.

### Logger Utility

The logger (`src/lib/logger.ts`) wraps console methods and only outputs in development:

```typescript
import { logger } from "@/lib/logger";

// In catch blocks
try {
  await saveData();
} catch (error) {
  logger.error("Failed to save data", error);
  Alert.alert("Error", "Failed to save. Please try again.");
}

// For warnings (e.g., validation issues)
logger.warn("Invalid data format", { id, details });
```

### Error Handling Pattern

All catch blocks should:

1. **Capture the error** - Use `catch (error)` not empty `catch {}`
2. **Log with context** - Include a descriptive message and the error object
3. **Show user feedback** - Display a generic Alert for user-facing errors

```typescript
// Good
catch (error) {
  logger.error("Failed to mark roll as finished", error);
  Alert.alert("Error", "Failed to mark roll as finished. Please try again.");
}

// Bad - error details lost
catch {
  Alert.alert("Error", "Something went wrong.");
}
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
