---
name: implement-feature
description: Use this skill when implementing a feature from a feature plan. Reads the plan file, implements code changes, creates Maestro E2E tests for scenarios, and adds unit tests for pure functions.
---

# Feature Implementation Mode

You are implementing a feature for FilmBuddy based on a feature plan document.

## Required Reading

Before starting, read these documents:

1. `docs/architecture.md` - Project structure, patterns, and conventions
2. `docs/testing.md` - Testing strategy (Maestro for E2E, Vitest for unit tests)
3. `docs/design.md` - Design system for UI work

## Implementation Process

### 1. Load the Feature Plan

1. If the user specified a plan name, read `docs/plans/{plan-name}.md`
2. If not specified, list available plans from `docs/plans/` and ask which to implement
3. Read linked wireframes from `docs/wireframes/`
4. Check if an implementation plan already exists at the bottom of the plan file

### 2. Create Implementation Plan

If no implementation plan exists, analyze the codebase and create one:

1. Search for related components, screens, hooks, and types
2. Check for existing Maestro flows in `apps/mobile/e2e/flows/`
3. Identify what needs to be built

Write an implementation plan to the bottom of the plan file using this format:

```markdown
## Implementation Plan

### Status: In Progress

### Tasks

1. [ ] **Data layer**
   - [ ] Add `Roll` type to `src/types/roll.ts`
   - [ ] Add `rolls` table to `src/db/schema.ts`
   - [ ] Create `useRollStore` in `src/stores/rollStore.ts`

2. [ ] **Unit tests** (write before implementation)
   - [ ] `src/lib/roll-validation.test.ts` - validation logic
   - [ ] `src/lib/roll-sorting.test.ts` - sorting helpers

3. [ ] **Components**
   - [ ] `src/components/RollCard.tsx`
   - [ ] `src/components/RollForm.tsx`

4. [ ] **Screens**
   - [ ] `app/(tabs)/rolls.tsx`
   - [ ] `app/roll/[id].tsx`

5. [ ] **Maestro E2E tests**
   - [ ] `e2e/flows/rolls-add-new-roll.yaml` - Scenario: Add a new roll
   - [ ] `e2e/flows/rolls-edit-roll.yaml` - Scenario: Edit an active roll
```

**Wait for user confirmation before proceeding.**

### 3. Resume or Start

If an implementation plan already exists:

1. Read the checkboxes to see what's done
2. Resume from the first unchecked item
3. Update checkboxes as you complete tasks

### 4. Write Unit Tests First

Before implementing pure functions, write failing unit tests:

1. Identify functions that will contain logic (validation, calculations, transformations)
2. Write tests for expected behavior per `docs/testing.md`
3. Tests will fail until implementation is complete

### 5. Implement Code

Work through tasks in order. Follow patterns from `docs/architecture.md`.

**For testability:** Add `testID` props to all interactive elements:

- `testID="add-roll-button"`
- `testID="film-stock-input"`

Update checkboxes in the plan file as you complete each task.

### 6. Create Maestro E2E Tests

For each scenario, use the **tester-maestro agent**:

```
Write a Maestro test for:

Scenario: {scenario name}
- GIVEN {precondition}
- WHEN {action}
- THEN {outcome}

Save to: apps/mobile/e2e/flows/{feature}-{scenario-slug}.yaml

TestIDs available: {list testIDs you added}
```

### 7. Verify

1. `yarn workspace @filmbuddy/mobile typecheck`
2. `yarn workspace @filmbuddy/mobile lint`
3. `yarn workspace @filmbuddy/mobile test:unit`

### 8. Mark Complete

Update the implementation plan status and checkboxes:

```markdown
### Status: Complete
```

## Tips

- **Delegate Maestro tests** to the tester-maestro agent
- **One scenario = one test file**
- **TestIDs are critical** for Maestro to interact with elements
- **Mark todos as you go**
