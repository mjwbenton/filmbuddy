---
name: spec-create
description: Create or refine feature specs with user stories and GIVEN/WHEN/THEN scenarios. Use when planning a feature, writing scenarios, defining user stories, or creating a feature spec.
---

# Feature Spec Mode

You are helping create or refine a feature spec for FilmBuddy, an iOS app for film photographers.

## Prerequisite

This skill should run inside a worktree, not on main. Check the current branch:

- If on `main`, use the worktree skill to create one first
- If already in a worktree, proceed

## Setup

Feature specs live in `docs/specs/`:

- Use kebab-case for filenames (e.g., `roll-tracking.md`)
- Wireframes live in `docs/wireframes/` (use the `wireframe` skill when creating)
- Product vision is in `docs/vision.md`

## Feature Spec Process

### 1. Determine Starting Point

First, check if this is a new or existing spec:

1. Check if the user provided a feature name
2. Check if `docs/specs/{feature-name}.md` already exists

**If existing spec:** Read it, give a brief summary of current state (scenario count, wireframes linked, open questions), then ask what the user wants to add or change.

**If new spec:** Proceed with the phases below.

### 2. Feature Definition

Ask these questions one at a time, waiting for answers:

1. "What's the feature name?" (will become the filename)
2. "Describe this feature in one sentence."
3. "Which area of the app does this touch?" (Rolls, Meter, Gear, Archive, or multiple)
4. "Does this feature depend on any others?" Check `docs/specs/` for existing specs to reference.

### 3. User Story

Ask:

- "What does the user want to accomplish with this feature?"
- "Why is this valuable to them?"

Then draft a user story: "As a film photographer, I want to [goal] so that [benefit]."

**Wait for user confirmation before proceeding.**

### 4. Scenarios (GIVEN/WHEN/THEN)

Build scenarios iteratively:

1. "Describe the main happy-path scenario—what's the typical successful use?"
2. Convert their description to GIVEN/WHEN/THEN format
3. Confirm: "Does this capture it correctly?"
4. Ask: "What edge cases should we handle?" (one at a time)
5. Ask: "What error states could occur?" (one at a time)
6. For each, convert to GIVEN/WHEN/THEN and confirm

Keep asking "Any other scenarios?" until the user says they're done.

### 5. Wireframes

For the scenarios defined:

1. Ask: "What screens does this feature need?"
2. Check existing wireframes in `docs/wireframes/` - list any relevant ones
3. For each new screen needed:
   - Use the `wireframe` skill to create the HTML file
   - Add it to `docs/wireframes/index.html`
4. Link wireframes to which scenarios use them

### 6. Generate Spec

Create or update `docs/specs/{feature-name}.md` using the template in [spec-template.md](spec-template.md).

### 7. Update Specs Index

Ensure `docs/specs/index.md` exists and includes this spec. See [spec-template.md](spec-template.md) for index format.

## Iteration Mode

When updating an existing spec:

- Preserve existing content unless explicitly changing it
- When adding scenarios, append to existing list
- When adding wireframes, add links without removing existing ones
- Ask before removing or significantly changing existing scenarios

## Tips

- **One question at a time:** Don't overwhelm with multiple questions
- **Confirm before proceeding:** Get explicit approval on user stories and scenarios
- **Check for dependencies:** Reference existing specs when features connect
- **Link wireframes to scenarios:** Make it clear which screens support which flows
- **Capture open questions:** Don't lose track of unresolved decisions
