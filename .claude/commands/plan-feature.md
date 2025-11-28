# Plan Feature

You are helping create or refine a feature plan for FilmBuddy.

## Context

- Feature plans live in `docs/plans/`
- Wireframes live in `docs/wireframes/` (use the `wireframe` skill conventions when creating)
- Product vision is in `docs/vision.md`

## Starting Point

First, determine if this is a new or existing plan:

1. Check if the user provided a feature name
2. Check if `docs/plans/{feature-name}.md` already exists

**If existing plan:** Read it, give a brief summary of current state (scenarios count, wireframes linked, open questions), then ask what the user wants to add or change.

**If new plan:** Proceed with the phases below.

## Phase 1: Feature Definition

Ask these questions one at a time, waiting for answers:

1. "What's the feature name?" (will become the filename, use kebab-case)
2. "Describe this feature in one sentence."
3. "Which area of the app does this touch?" (Rolls, Meter, Gear, Archive, or multiple)
4. "Does this feature depend on any others?" Check `docs/plans/` for existing plans to reference.

## Phase 2: User Story

Ask:
- "What does the user want to accomplish with this feature?"
- "Why is this valuable to them?"

Then draft a user story: "As a film photographer, I want to [goal] so that [benefit]."

Confirm with the user before proceeding.

## Phase 3: Scenarios (GIVEN/WHEN/THEN)

Build scenarios iteratively:

1. "Describe the main happy-path scenario—what's the typical successful use?"
2. Convert their description to GIVEN/WHEN/THEN format
3. Confirm: "Does this capture it correctly?"
4. Ask: "What edge cases should we handle?" (one at a time)
5. Ask: "What error states could occur?" (one at a time)
6. For each, convert to GIVEN/WHEN/THEN and confirm

Keep asking "Any other scenarios?" until the user says they're done.

## Phase 4: Wireframes

For the scenarios defined:

1. Ask: "What screens does this feature need?"
2. Check existing wireframes in `docs/wireframes/` - list any relevant ones
3. For each new screen needed:
   - Create the wireframe HTML file following the `wireframe` skill conventions
   - Add it to `docs/wireframes/index.html`
4. Link wireframes to which scenarios use them

## Phase 5: Generate Plan

Create or update `docs/plans/{feature-name}.md` using this structure:

```markdown
# Feature: [Name]

## Summary

[One sentence description]

## Dependencies

<!-- Remove this section if no dependencies -->
- [Other Feature](other-feature.md) - [brief reason why needed]

## User Story

As a film photographer, I want to [goal] so that [benefit].

## Scenarios

### Scenario: [Descriptive Name]

- **GIVEN** [precondition]
- **WHEN** [action]
- **THEN** [outcome]

<!-- Repeat for each scenario -->

## Wireframes

- [Screen Name](../wireframes/screen.html) - used in [scenario names]

## Open Questions

<!-- Remove this section if no open questions -->
- [Any unresolved decisions or unknowns]
```

Also ensure `docs/plans/index.md` exists and includes this plan.

## Plans Index Structure

If `docs/plans/index.md` doesn't exist, create it:

```markdown
# Feature Plans

## Rolls
- [Feature Name](feature-name.md)

## Meter
- [Feature Name](feature-name.md)

## Gear
- [Feature Name](feature-name.md)

## Archive
- [Feature Name](feature-name.md)
```

Group plans by app area. A plan can appear in multiple sections if it spans areas.

## Iteration Mode

When updating an existing plan:

- Preserve existing content unless explicitly changing it
- When adding scenarios, append to existing list
- When adding wireframes, add links without removing existing ones
- Ask before removing or significantly changing existing scenarios
