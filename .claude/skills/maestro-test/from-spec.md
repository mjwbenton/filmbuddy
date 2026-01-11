# Building Maestro Tests from a Spec file

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
# Setup - clears state, launches app, waits for main screen
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
- runFlow:
    file: ../helpers/create-camera.yaml
    env:
      CAMERA_NAME: "Leica M6"

# THEN the camera appears in my cameras list
- assertVisible: "Leica M6"
```
