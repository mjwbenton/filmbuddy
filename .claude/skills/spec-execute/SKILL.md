---
name: spec-execute
description: Execute implementation of a spec from a plan file.
model: sonnet
---

# Spec execute

You are implementing a FilmBuddy feature by following an existing implementation plan.

## Prerequisite

This skill should run inside a worktree. Confirm you are running in a worktree by checking the branch is not main before continuing.

```bash
git rev-parse --abbrev-ref HEAD
```

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
2. **Create or modify files** following the plan
3. **Run lint, typecheck and unit tests** using `yarn typecheck`, `yarn lint` and `yarn test:unit`
4. **Mark the checkbox** `[x]` in the plan file
5. **Commit** If you've finished a section of the plan, then create a commit for the work you have completed

### 4. Mark Complete

Update the plan file to indicate completion:

- Ensure all checkboxes are marked `[x]`
- Add `## Status: Complete` at the top of the plan
