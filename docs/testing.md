# FilmBuddy Testing Strategy

## Testing Stack

| Layer       | Tool    | Purpose                          |
| ----------- | ------- | -------------------------------- |
| Acceptance  | Maestro | User flow testing via YAML specs |
| Unit        | Vitest  | Pure function logic              |
| Integration | Vitest  | Integration tests for stores     |


## Acceptance Testing with Maestro

Maestro tests describe user flows in readable YAML, serving as executable acceptance criteria. Write these when building features.

### Test Location

Tests live inside apps/mobile/e2e/flows/.

Follow the convention of naming the test ${feature-name}-${scenario}.yaml.

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

### Running Locally

```bash
# Run all unit tests
yarn test:unit

# Watch mode during development
yarn test:unit:watch

# Run specific file
yarn test:unit src/lib/exposure.test.ts
```

## Integration Testing

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

Tests run on every push to main and pull request. See [../.github/workflows/ci.yml](../.github/workflows/ci.yml) for the workflow configuration.

## Workflow

When building a feature:

1. Identify any pure functions you can separate out for testing. Write those alongside their tests first.
2. Identify any stores you will need. Write those alongside their integration tests next.
3. Write acceptance test first (Maestro YAML describing the user flow).
4. Build the feature until all test pass.

## Configuration Files

- [apps/mobile/vitest.config.mts](../apps/mobile/vitest.config.mts)
- [apps/mobile/e2e/maestro.config.yaml](../apps/mobile/e2e/maestro.config.yaml)
- [apps/mobile/package.json](../apps/mobile/package.json) - test scripts
