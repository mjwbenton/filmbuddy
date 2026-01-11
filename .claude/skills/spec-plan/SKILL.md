---
name: spec-plan
description: Research codebase and create detailed implementation plan from a spec. Use when planning implementation, researching patterns, or preparing to build a feature.
---

# Implementation Planning Mode

You are creating a detailed implementation plan for a FilmBuddy feature based on its spec.

## Prerequisite

This skill should run inside a worktree, not on main. Check the current branch:

- If on `main`, use the worktree skill to create one first
- If already in a worktree, proceed

## Planning Process

### 1. Load the Feature Spec

1. Read the spec from `docs/specs/{spec-name}.md`
2. Read linked wireframes from `docs/wireframes/`
3. Summarize the feature scope: scenarios, screens, and key behaviors

### 2. Research the Codebase

Thoroughly investigate the codebase to understand existing patterns:

**Data layer:**

- Search `apps/mobile/src/db/schema.ts` for related tables
- Check `apps/mobile/src/stores/` for similar store patterns
- Look at existing Zod schemas for validation patterns

**Components:**

- Search `apps/mobile/src/components/` for reusable components
- Check `apps/mobile/src/components/ui/` for UI primitives
- Look for similar screens in `apps/mobile/app/`

**Existing flows:**

- Check `apps/mobile/e2e/flows/` for related Maestro tests
- Look at how similar features handle navigation, forms, state

**Document what you find:** Include file paths and relevant code patterns in your plan.

### 3. Generate E2E Tests

Use `/maestro-test` with the spec file path to create E2E tests.

This will output:

1. **Flow files created** - List of YAML files in `apps/mobile/e2e/flows/`
2. **Required testIDs** - Map of component → testIDs for implementation

### 4. Create Implementation Plan

Write a detailed plan to `docs/plans/{spec-name}.md` using the template in [plan-template.md](plan-template.md).

The plan must include:

**Task breakdown by layer:**

- Data layer (tables, stores, types)
- Unit tests (write before implementation)
- Components (with specific props and testIDs)
- Screens (with navigation and state management)

**Code snippets for each task:**
Show the exact code structure, not just file paths. For example:

```typescript
// apps/mobile/src/db/schema.ts
export const rolls = sqliteTable("rolls", {
  id: text("id").primaryKey(),
  filmStock: text("film_stock").notNull(),
  // ... other fields from spec
});
```

**Required testIDs:**
Include the complete list from maestro-test output.

### 5. Commit and Continue

1. Commit the Maestro tests: `git add apps/mobile/e2e && git commit -m "Add E2E tests for {feature}"`
2. Commit the plan: `git add docs/plans && git commit -m "Add implementation plan for {feature}"`

The plan is now ready for execution with `/spec-execute`.

## Tips

- **Be specific:** Include exact file paths, function names, and code structure
- **Follow existing patterns:** Match conventions already in the codebase
- **Include all testIDs:** Missing testIDs will cause E2E test failures
- **Group related tasks:** Organize by layer for logical implementation order
