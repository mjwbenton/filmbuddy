---
name: maestro-test
description: Writes, debugs and plans Maestro E2E tests from GIVEN/WHEN/THEN scenarios.
---

# Maestro Tests

## Project Context

- App ID: `tech.mattb.filmbuddy`
- Test location: `apps/mobile/e2e/flows/`
- Config: `apps/mobile/e2e/maestro.config.yaml`

## Tips for maestro

1. **Be explicit about state**: Don't assume app state; verify with assertions
2. **Wait for stability**: Use `waitForAnimationToEnd` after navigation
3. **Prefer text over coordinates**: Text selectors are more maintainable
4. **Prefer testIds over text**: Use testIDs to reference interactive elements
5. **Combine related scenarios**: Use the combination guide to reduce test count and setup overhead
6. **Test empty states first**: When a feature has an empty state scenario, test it BEFORE adding data
7. **Chain logically**: Order combined scenarios so each builds on the previous state
8. **Comment scenario boundaries**: Use clear `# ====` headers to mark where each scenario begins

## Reusable Helpers

Create reusable helpers to make our flows DRY.

To ensure consistency always use relevant helpers when available, e.g. always use the hide-keyboard helper rather than the inbuilt hideKeyboard command

## Core Commands Reference

**Tapping elements:**

```yaml
- tapOn: "Button Text"
- tapOn:
    id: "button_id"
- tapOn:
    text: ".*partial match.*"
```

**Text input:**

```yaml
# Use the input-text helper (taps, enters text, hides keyboard)
- runFlow:
    file: ../helpers/input-text.yaml
    env:
      INPUT_ID: "field-id"
      TEXT: "Value to enter"

# Or to replace existing text (clears first)
- runFlow:
    file: ../helpers/edit-text.yaml
    env:
      INPUT_ID: "field-id"
      TEXT: "New value"
```

**Assertions:**

```yaml
- assertVisible: "Expected text"
- assertVisible:
    id: "element_id"
- assertNotVisible: "Should not appear"
```

**Scrolling:**

```yaml
- scrollUntilVisible:
    element: "Target Element"
    direction: DOWN
```

**Swipe gestures:**

```yaml
- swipe:
    direction: LEFT
- swipe:
    start: 90%, 50%
    end: 10%, 50%
```

**Waiting:**

```yaml
- extendedWaitUntil:
    visible: "Loading complete"
    timeout: 10000
```

**Reusable flows:**

```yaml
# Launch helper (clears state, launches app, waits for ready)
- runFlow:
    file: ../helpers/launch.yaml

# Create entities with configurable parameters
- runFlow:
    file: ../helpers/create-camera.yaml
    env:
      CAMERA_NAME: "Leica M6"

- runFlow:
    file: ../helpers/create-roll.yaml
    env:
      FILM_STOCK: "Portra 400"
      ISO: "400"
      CAMERA: "Leica M6"
```
