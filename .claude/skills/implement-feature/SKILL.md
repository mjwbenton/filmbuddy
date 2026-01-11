---
name: implement-feature
description: Implement features from spec files using test-first development. Use when implementing a spec, building a feature, or starting implementation from a spec.
---

# Feature Implementation Mode

You are implementing a feature for FilmBuddy based on a feature spec document.

## Implementation Process

### 1. Ensure you are on a worktree

All feature implementation should happen in an isolated worktree. Check whether you're already operating in one, and if not create a new one with an appropriate name for the feature you are implementing.

### 2. Load the Feature Spec

1. Read the spec from `docs/specs/{spec-name}.md`
2. Read linked wireframes from `docs/wireframes/`
3. Check if an implementation plan already exists at the bottom of the spec file

### 3. Create Implementation Plan

If no implementation plan exists, analyze the codebase and create one:

1. Consider what skills you may need to implement this feature and make sure you load them
2. Search for related components, screens, hooks, and types
3. Check for existing Maestro flows in `apps/mobile/e2e/flows/`
4. Identify what needs to be built

Write an implementation plan to the bottom of the spec file. See [implementation-template.md](implementation-template.md) for format.

Commit the implementation plan before moving on.

### 3. Generate E2E Tests First

Invoke the **tester-maestro agent** with the spec file path:

```
Read this feature spec and create Maestro E2E tests:
Spec file: docs/specs/{spec-name}.md
```

Wait for the agent to complete. It will output:

1. **Flow files created** - List of YAML files in `apps/mobile/e2e/flows/`
2. **Required testIDs** - Map of component → testIDs for implementation

Include the testIDs in the implementation plan so they are visible during coding.

Commit the maestro tests before moving on.

### 4. Resume or Start

If an implementation plan already exists:

1. Read the checkboxes to see what's done
2. Resume from the first unchecked item
3. Update checkboxes as you complete tasks
4. Commit each task before moving on to the next one

### 5. Write Unit Tests First

Before implementing pure functions, write failing unit tests:

1. Identify functions that will contain logic (validation, calculations, transformations)
2. Write tests for expected behavior per `docs/testing.md`
3. Tests will fail until implementation is complete

### 6. Implement Code

Work through tasks in order.

**For testability:** Add `testID` props to all interactive elements:

- `testID="add-roll-button"`
- `testID="film-stock-input"`

Update checkboxes in the spec file as you complete each task.

### 7. Verify

1. `yarn typecheck`
2. `yarn lint`
3. `yarn test:unit`

### 8. Mark Complete

Update the implementation plan status to `### Status: Complete`.

## Tips

- **Tests come first** - tester-maestro creates E2E tests before you implement
- **Use the testIDs provided** - the agent tells you which testIDs to add
- **TestIDs are critical** for Maestro to interact with elements
- **Mark todos as you go**
