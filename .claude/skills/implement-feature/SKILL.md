---
name: implement-feature
description: Implement features from plan files using test-first development. Use when implementing a plan, building a feature, or starting implementation from a spec.
---

# Feature Implementation Mode

You are implementing a feature for FilmBuddy based on a feature plan document.

## Implementation Process

### 1. Load the Feature Plan

1. If the user specified a plan name, read `docs/plans/{plan-name}.md`
2. If not specified, list available plans from `docs/plans/` and ask which to implement
3. Read linked wireframes from `docs/wireframes/`
4. Check if an implementation plan already exists at the bottom of the plan file

### 2. Generate E2E Tests First

Invoke the **tester-maestro agent** with the plan file path:

```
Read this feature plan and create Maestro E2E tests:
Plan file: docs/plans/{plan-name}.md
```

Wait for the agent to complete. It will output:

1. **Flow files created** - List of YAML files in `apps/mobile/e2e/flows/`
2. **Required testIDs** - Map of component → testIDs for implementation

Include the testIDs in the implementation plan so they are visible during coding.

### 3. Create Implementation Plan

If no implementation plan exists, analyze the codebase and create one:

1. Consider what skills you may need to implement this feature and make sure you load them
2. Search for related components, screens, hooks, and types
3. Check for existing Maestro flows in `apps/mobile/e2e/flows/`
4. Identify what needs to be built

Write an implementation plan to the bottom of the plan file. See [implementation-template.md](implementation-template.md) for format.

**Wait for user confirmation before proceeding.**

### 4. Resume or Start

If an implementation plan already exists:

1. Read the checkboxes to see what's done
2. Resume from the first unchecked item
3. Update checkboxes as you complete tasks

### 5. Write Unit Tests First

Before implementing pure functions, write failing unit tests:

1. Identify functions that will contain logic (validation, calculations, transformations)
2. Write tests for expected behavior per `docs/testing.md`
3. Tests will fail until implementation is complete

### 6. Implement Code

Work through tasks in order. Follow patterns from `docs/architecture.md`.

**For testability:** Add `testID` props to all interactive elements:

- `testID="add-roll-button"`
- `testID="film-stock-input"`

Update checkboxes in the plan file as you complete each task.

### 7. Verify

1. `yarn workspace @filmbuddy/mobile typecheck`
2. `yarn workspace @filmbuddy/mobile lint`
3. `yarn workspace @filmbuddy/mobile test:unit`

### 8. Mark Complete

Update the implementation plan status to `### Status: Complete`.

## Tips

- **Tests come first** - tester-maestro creates E2E tests before you implement
- **Use the testIDs provided** - the agent tells you which testIDs to add
- **TestIDs are critical** for Maestro to interact with elements
- **Mark todos as you go**
