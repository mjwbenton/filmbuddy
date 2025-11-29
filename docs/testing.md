# FilmBuddy Testing Strategy

Automated testing focused on two levels: acceptance tests for user-facing features, and unit tests for pure functions.

## Testing Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Acceptance | Maestro | User flow testing via YAML specs |
| Unit | Vitest | Pure function logic |

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
# Install Maestro
brew install maestro

# Run all flows
maestro test e2e/flows/

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
├── lib/
│   ├── exposure.ts
│   ├── exposure.test.ts
│   ├── frames.ts
│   └── frames.test.ts
```

### Example Test

```ts
// src/lib/exposure.test.ts
import { describe, it, expect } from 'vitest'
import { calculateShutterSpeed } from './exposure'

describe('calculateShutterSpeed', () => {
  it('calculates 1/125 at f/8, ISO 400, EV 14', () => {
    expect(calculateShutterSpeed({ aperture: 8, iso: 400, ev: 14 }))
      .toBe('1/125')
  })

  it('handles half-stop apertures', () => {
    expect(calculateShutterSpeed({ aperture: 1.7, iso: 400, ev: 12 }))
      .toBe('1/500')
  })
})
```

### Running Locally

```bash
# Run all unit tests
npm run test:unit

# Watch mode during development
npm run test:unit -- --watch

# Run specific file
npm run test:unit src/lib/exposure.test.ts
```

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
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit

  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
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

### vitest.config.ts

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

### e2e/maestro.config.yaml

```yaml
appId: tech.mattb.filmbuddy
```

### package.json scripts

```json
{
  "scripts": {
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "maestro test e2e/flows/",
    "test": "npm run test:unit && npm run test:e2e"
  }
}
```
