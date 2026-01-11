---
name: spec-plan
description: Create a plan based on a spec. Research the codebase, plan an implementation of a feature, including testing.
---

# Spec Plan

You are creating a detailed implementation plan for a FilmBuddy feature based on its spec.

## Planning Process

- Read the feature spec from `docs/specs/{spec-name}.md`
- Thoroughly research the codebase to understand existing patterns, loading relevant skills
- Use the maestro-test skill to decide what e2e tests need to be written.
- Write a detailed plan to `docs/plans/{spec-name}.md` using the template in [plan-template.md](plan-template.md)

## Implementation Plan

The plan must include

- A breakdown of tasks in a sensible order in which to do them
- Separate test writing tasks. Test writing tasks should always come before the code they are testing is written.
- Code snippets that make it clear what changes need to be made
- testIds to be used to couple the e2e test and ui together
