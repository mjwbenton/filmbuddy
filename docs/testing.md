# FilmBuddy Testing Strategy

Automated testing focused on two levels: acceptance tests for user-facing features, and unit tests for pure functions.

## Testing Stack

| Layer      | Tool    | Purpose                          |
| ---------- | ------- | -------------------------------- |
| Acceptance | Maestro | User flow testing via YAML specs |
| Unit       | Vitest  | Pure function logic              |

## Acceptance Testing with Maestro

Maestro tests describe user flows in readable YAML, serving as executable acceptance criteria. Write these when building features.

### Why Maestro

- Simple YAML syntax readable as acceptance criteria
- Runs on real simulators/emulators
- Less flaky than Detox
- Maestro Studio for debugging
- Free CI option via Maestro Cloud

### Test Location

```
e2e/
├── flows/
│   ├── load-roll.yaml
│   ├── log-frame.yaml
│   ├── light-meter.yaml
│   └── gear-library.yaml
└── maestro.config.yaml
```

### Example Test

```yaml
# e2e/flows/load-roll.yaml
appId: tech.mattb.filmbuddy
---
- launchApp
- tapOn: "Add Roll"
- tapOn: "Camera"
- tapOn: "Leica M6"
- tapOn: "Film Stock"
- tapOn: "Portra 400"
- tapOn: "Load Roll"
- assertVisible: "Active Rolls"
- assertVisible: "Portra 400 in Leica M6"
```

### Running Locally

```bash
# Install Maestro (one-time setup)
brew tap mobile-dev-inc/tap
brew install maestro

# Run all flows
yarn test:e2e

# Run with debug output (saves screenshots/logs to e2e/output/)
yarn test:e2e:debug

# Run single flow
maestro test e2e/flows/load-roll.yaml

# Debug with Maestro Studio
maestro studio
```

## Unit Testing with Vitest

Unit tests for pure functions that contain meaningful logic. Co-locate tests with source files.

### What to Test

- Exposure calculations (EV math, stop conversions)
- Frame counting logic
- Data transformations
- Validation functions

### What NOT to Test

- Components (covered by acceptance tests)
- Hooks that wire things together
- Navigation/routing glue
- Simple getters/setters

### Test Location

Co-locate with source:

```
src/
├── exposure.ts
├── exposure.test.ts
├── frames.ts
└── frames.test.ts
```

### Example Test

```ts
// src/exposure.test.ts
import { describe, it, expect } from "vitest";
import { calculateShutterSpeed } from "./exposure";

describe("calculateShutterSpeed", () => {
  it("calculates 1/125 at f/8, ISO 400, EV 14", () => {
    expect(calculateShutterSpeed({ aperture: 8, iso: 400, ev: 14 })).toBe(
      "1/125",
    );
  });

  it("handles half-stop apertures", () => {
    expect(calculateShutterSpeed({ aperture: 1.7, iso: 400, ev: 12 })).toBe(
      "1/500",
    );
  });
});
```

### Running Locally

```bash
# Run all unit tests
yarn test:unit

# Watch mode during development
yarn test:unit:watch

# Run specific file
yarn test:unit src/lib/exposure.test.ts
```

## Store Integration Testing

Integration tests for Zustand stores that interact with SQLite. Tests use `vi.mock` to replace Expo dependencies with a test database (`better-sqlite3`).

### Architecture

Stores remain simple with no special test infrastructure:

```typescript
// rollStore.ts
import { create } from "zustand";
import { db } from "@/db";
import { randomUUID } from "expo-crypto";

export const useRollStore = create<RollStore>((set, get) => ({
  // ... methods use db and randomUUID directly
}));
```

Tests mock `expo-crypto` and `@/db` using Vitest's `vi.mock`:

```typescript
vi.mock("expo-crypto", () => ({
  randomUUID: () => `test-id-${++idCounter}`,
}));

vi.mock("@/db", () => ({
  get db() {
    return testDb.db;
  },
}));
```

### Test Database Setup

Tests use an in-memory SQLite database via `better-sqlite3`:

```typescript
import { createTestDb, type TestDbContext } from "@/test/db";

let testDb: TestDbContext;
let idCounter = 0;

beforeEach(async () => {
  testDb = createTestDb(); // Fresh database with migrations applied
  idCounter = 0;
  vi.resetModules(); // Get fresh store instance
});

afterEach(() => {
  testDb.close();
});
```

### Example Test

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestDb, type TestDbContext } from "@/test/db";

let testDb: TestDbContext;
let idCounter = 0;

vi.mock("expo-crypto", () => ({
  randomUUID: () => `test-id-${++idCounter}`,
}));

vi.mock("@/db", () => ({
  get db() {
    return testDb.db;
  },
}));

describe("rollStore", () => {
  beforeEach(async () => {
    testDb = createTestDb();
    idCounter = 0;
    vi.resetModules();
  });

  afterEach(() => {
    testDb.close();
  });

  it("adds a roll to the database", async () => {
    const { useRollStore } = await import("./rollStore");

    await useRollStore.getState().addRoll({
      filmStock: "Portra 400",
      iso: 400,
      camera: "Leica M6",
    });

    expect(useRollStore.getState().activeRolls).toHaveLength(1);
  });
});
```

### Key Points

- Use `vi.resetModules()` in `beforeEach` to get a fresh store for each test
- Use dynamic `import()` after `resetModules` to load the store with mocks applied
- The `get db()` getter in the mock ensures each test uses its own database instance

### What to Integration Test

- Store CRUD operations against real database
- Query filtering (active vs finished rolls)
- State transitions (markFinished, markActive)
- Error handling for database failures

### What NOT to Integration Test

- UI rendering (use Maestro E2E tests)
- Component hooks consuming stores
- Database schema/migrations (covered by app usage)

## GitHub Actions

Tests run on every push and pull request.

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run test:unit

  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci

      - name: Build iOS app
        run: npx expo prebuild --platform ios && cd ios && xcodebuild -workspace FilmBuddy.xcworkspace -scheme FilmBuddy -configuration Debug -sdk iphonesimulator -derivedDataPath build

      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash

      - name: Boot iOS Simulator
        run: |
          xcrun simctl boot "iPhone 15"
          xcrun simctl install booted ios/build/Build/Products/Debug-iphonesimulator/FilmBuddy.app

      - name: Run E2E tests
        run: ~/.maestro/bin/maestro test e2e/flows/
```

## Workflow

When building a feature:

1. Write acceptance test first (Maestro YAML describing the user flow)
2. Build the feature until the test passes
3. If you write pure functions with logic, add unit tests
4. Push — tests run automatically

## Configuration Files

- [apps/mobile/vitest.config.mts](../apps/mobile/vitest.config.mts)
- [apps/mobile/e2e/maestro.config.yaml](../apps/mobile/e2e/maestro.config.yaml)
- [apps/mobile/package.json](../apps/mobile/package.json) - test scripts
