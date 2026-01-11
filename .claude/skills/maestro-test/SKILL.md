---
name: maestro-test
description: Write and debug Maestro E2E tests from Given/When/Then scenarios. Use when creating E2E tests, debugging test failures, or converting scenarios to Maestro YAML.
---

# Maestro Test Expert

You are writing or debugging Maestro E2E tests for FilmBuddy, a React Native/Expo iOS app for film photographers.

## Project Context

- App ID: `tech.mattb.filmbuddy`
- Test location: `apps/mobile/e2e/flows/`
- Config: `apps/mobile/e2e/maestro.config.yaml`

Always read `docs/testing.md` for the full testing strategy.

---

## Reading Feature Specs

When given a feature spec path, work autonomously:

### 1. Read the Spec Document

Read the spec file (e.g., `docs/specs/gear-v1.md`) and extract:

- Feature name (for file naming prefix)
- All scenarios with GIVEN/WHEN/THEN steps
- Wireframe links (read wireframes to understand UI structure)

### 2. Analyze Scenario Relationships

Group scenarios that can be tested together efficiently.

**Combine scenarios when:**

- B's GIVEN is A's THEN (e.g., "Add roll" → "Edit roll" - the added roll IS the precondition)
- Same form with validation error + happy path (e.g., "Empty form error" → "Complete and save")
- Empty state → Add first item → Item appears (natural flow)
- State transitions that chain naturally (e.g., Active → Finished → Active again)

**Keep scenarios separate when:**

- Completely independent features
- Would create flow > 50 steps (too fragile)
- Destructive actions (delete) that would break subsequent tests
- Conflicting preconditions (e.g., "has data" vs "empty state")

### 3. Scenario Combination Guide

| Pattern                               | Decision |
| ------------------------------------- | -------- |
| Empty state → Add item → Item visible | COMBINE  |
| Add → Edit same entity                | COMBINE  |
| Validation error → Successful submit  | COMBINE  |
| Add → Delete                          | SEPARATE |
| Multiple independent CRUD             | SEPARATE |
| State transition chain                | COMBINE  |

### 4. Design Flow Structure

For each flow file:

- Name: `{feature-slug}-{flow-description}.yaml`
- Include comment headers marking each scenario being tested
- Use helper files for reusable setup

Example combined flow structure:

```yaml
appId: tech.mattb.filmbuddy
---
# Setup
- runFlow:
    file: ../helpers/launch.yaml

# =============================================================================
# Scenario: Empty gear library
# =============================================================================
# GIVEN I have no gear added
# WHEN I view the Gear screen
- tapOn: "Gear"

# THEN I see an empty state
- assertVisible: "No cameras yet"

# =============================================================================
# Scenario: Add a camera
# =============================================================================
# GIVEN I'm on the Gear screen (continuing from above)
# WHEN I tap to add a camera, enter a name, and save
- tapOn:
    id: "add-camera-button"
- tapOn:
    id: "camera-name-input"
- inputText: "Leica M6"
- hideKeyboard
- tapOn:
    id: "save-button"

# THEN the camera appears in my cameras list
- assertVisible: "Leica M6"
```

---

## Writing Tests from Scenarios

When given scenarios in Given/When/Then format, convert them to Maestro YAML.

### Maestro Flow Structure

```yaml
appId: tech.mattb.filmbuddy
---
- launchApp
# Test steps here
```

### Mapping Given/When/Then to Maestro

| Scenario Part             | Maestro Equivalent                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **GIVEN** (preconditions) | Setup steps: `launchApp`, `runFlow` for shared setup, assertions for starting state |
| **WHEN** (actions)        | Interactions: `tapOn`, `inputText`, `swipe`, `scroll`                               |
| **THEN** (outcomes)       | Assertions: `assertVisible`, `assertNotVisible`                                     |

### Core Commands Reference

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
- tapOn: "Placeholder text" # Focus the field first
- inputText: "Value to enter"
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
- runFlow: shared/login.yaml
- runFlow:
    file: shared/setup.yaml
    env:
      ROLL_NAME: "Portra 400"
```

### Selectors Priority

Use selectors in this order of preference:

1. **Text content** - Most readable: `tapOn: "Add Roll"`
2. **testID/accessibilityLabel** - Most reliable: `tapOn: { id: "add-roll-button" }`
3. **Regex patterns** - For dynamic content: `tapOn: ".*Portra.*"`

### Example Conversion

**Scenario:**

```
GIVEN I have no active rolls
WHEN I tap "Add Roll"
AND I select camera "Leica M6"
AND I select film "Portra 400"
AND I tap "Load Roll"
THEN I see "Portra 400 in Leica M6" in my active rolls
```

**Maestro Flow:**

```yaml
appId: tech.mattb.filmbuddy
---
- launchApp
- assertVisible: "No active rolls"

- tapOn: "Add Roll"
- tapOn: "Camera"
- tapOn: "Leica M6"
- tapOn: "Film Stock"
- tapOn: "Portra 400"
- tapOn: "Load Roll"

- assertVisible: "Active Rolls"
- assertVisible: "Portra 400 in Leica M6"
```

### File Naming Convention

- Use kebab-case: `load-roll.yaml`, `log-frame.yaml`
- Name after the primary user action or feature
- Group related flows with prefixes: `roll-load.yaml`, `roll-advance.yaml`

### Shared Flows

Create reusable flows in `e2e/flows/shared/` for common setup:

```yaml
# e2e/flows/shared/load-test-roll.yaml
appId: tech.mattb.filmbuddy
env:
  CAMERA: ${CAMERA || "Leica M6"}
  FILM: ${FILM || "Portra 400"}
---
- launchApp
- tapOn: "Add Roll"
- tapOn: "Camera"
- tapOn: ${CAMERA}
- tapOn: "Film Stock"
- tapOn: ${FILM}
- tapOn: "Load Roll"
```

---

## Debugging Failing Tests

When a user reports a failing test, follow this process:

### 1. Gather Information

Ask for or locate:

- The exact error message
- Which flow file is failing
- At which step it fails
- Whether it fails consistently or intermittently

### 2. Read the Failing Flow

```
Read apps/mobile/e2e/flows/{flow-name}.yaml
```

### 3. Common Failure Patterns

**Element not found:**

- Text doesn't match exactly (check case, whitespace, special characters)
- Element hasn't appeared yet (add wait or use `extendedWaitUntil`)
- Element is off-screen (add `scrollUntilVisible`)
- Wrong selector (try `id` instead of `text` or vice versa)

**Timing issues:**

- Animation not complete: Add `- waitForAnimationToEnd`
- Async data loading: Use `extendedWaitUntil` with timeout
- State not ready: Add assertion before action to ensure state

**State issues:**

- Test depends on previous state: Add proper setup in GIVEN section
- Database has stale data: Consider clearing app data with `- clearState`
- Previous test polluted state: Each flow should be independent

### 4. Debugging Commands

**Run single flow with verbose output:**

```bash
maestro test apps/mobile/e2e/flows/{flow-name}.yaml
```

**Use Maestro Studio for interactive debugging:**

```bash
maestro studio
```

**Check element hierarchy:**
Use Maestro Studio to inspect the view hierarchy and find correct selectors.

### 5. Fix Strategies

**Add waiting for elements:**

```yaml
# Before
- tapOn: "Submit"

# After - wait for button to be enabled
- extendedWaitUntil:
    visible:
      text: "Submit"
      enabled: true
    timeout: 5000
- tapOn: "Submit"
```

**Handle loading states:**

```yaml
- tapOn: "Load Data"
- extendedWaitUntil:
    notVisible: "Loading..."
    timeout: 10000
- assertVisible: "Data loaded"
```

**Scroll to element:**

```yaml
- scrollUntilVisible:
    element: "Target Button"
    direction: DOWN
    timeout: 10000
- tapOn: "Target Button"
```

**Use more specific selectors:**

```yaml
# Ambiguous - might match multiple elements
- tapOn: "Edit"

# Specific - uses testID
- tapOn:
    id: "edit-roll-button"

# Specific - uses context
- tapOn:
    text: "Edit"
    below:
      text: "Roll Details"
```

---

## Output Contract

After creating all flow files, output a structured report:

### Flow Files Created

List each file with the scenarios it covers:

```
## Flow Files Created

| File | Scenarios Covered |
|------|-------------------|
| `e2e/flows/gear-cameras.yaml` | Empty state, Add camera, Edit camera |
| `e2e/flows/gear-lenses.yaml` | Add lens, Edit lens |
| `e2e/flows/gear-delete.yaml` | Delete gear item |
```

### Required testIDs

List every testID used in the flows, grouped by component/screen:

```
## Required testIDs

The implementation MUST add these testIDs to components:

### Gear Screen (`app/(tabs)/gear.tsx`)
- `add-camera-button` - FAB for adding camera
- `empty-cameras-state` - Empty state view when no cameras

### Camera Sheet (`app/gear/camera-sheet.tsx`)
- `camera-name-input` - TextInput for camera name
- `save-button` - Save button in sheet header
- `delete-button` - Delete button (edit mode only)
```

This format ensures the spec-plan skill knows exactly what testIDs to include during implementation.

---

## Tips for Reliable Tests

1. **Be explicit about state**: Don't assume app state; verify with assertions
2. **Wait for stability**: Use `waitForAnimationToEnd` after navigation
3. **Prefer text over coordinates**: Text selectors are more maintainable
4. **Combine related scenarios**: Use the combination guide to reduce test count and setup overhead
5. **Add testIDs for critical paths**: Suggest testID additions when text is unreliable
6. **Handle both platforms**: Note if behavior differs between iOS and Android
7. **Test empty states first**: When a feature has an empty state scenario, test it BEFORE adding data
8. **Chain logically**: Order combined scenarios so each builds on the previous state
9. **Comment scenario boundaries**: Use clear `# ====` headers to mark where each scenario begins
