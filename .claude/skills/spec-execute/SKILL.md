---
name: spec-execute
description: Execute implementation from a plan file. Use when ready to code a planned feature. Best run with sonnet model.
---

# Implementation Execution Mode

You are implementing a FilmBuddy feature by following an existing implementation plan.

**Model note:** This skill works best with Claude Sonnet for efficient code generation.

## Prerequisite

This skill should run inside a worktree, not on main. Check the current branch:

- If on `main`, use the worktree skill to create one first
- If already in a worktree, proceed

## Execution Process

### 1. Load Plan and Spec

1. Read the plan from `docs/plans/{spec-name}.md`
2. Read the spec from `docs/specs/{spec-name}.md`
3. Check which tasks are already completed (marked `[x]`)

### 2. Resume from Current Position

Find the first unchecked task `[ ]` and start from there. The plan provides:

- Exact code structure to implement
- File paths for each component
- Required testIDs for Maestro compatibility

### 3. Implement Each Task

For each task in order:

1. **Read the code snippet** from the plan
2. **Create or modify the file** following the exact structure
3. **Add testIDs** to all interactive elements as specified
4. **Mark the checkbox** `[x]` in the plan file
5. **Commit the change** before moving to the next task

### 4. Write Unit Tests First

When you reach the "Unit Tests" section:

- Write failing tests before implementing the functions they test
- Tests should cover the scenarios from the spec
- Follow patterns in `docs/testing.md`

### 5. Verify Continuously

After completing each layer, run:

```bash
yarn typecheck
yarn lint
```

Fix any issues before proceeding.

### 6. Final Verification

After all tasks are complete:

```bash
yarn typecheck
yarn lint
yarn test:unit
```

### 7. Mark Complete

Update the plan file to indicate completion:

- Ensure all checkboxes are marked `[x]`
- Add `## Status: Complete` at the top of the plan

## Tips

- **Follow the plan exactly:** The plan was designed with codebase research
- **Don't skip testIDs:** E2E tests depend on them
- **Commit frequently:** One commit per task keeps changes reviewable
- **Test as you go:** Run typecheck/lint after each layer
