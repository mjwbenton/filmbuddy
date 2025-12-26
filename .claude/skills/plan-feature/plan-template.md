# Feature Plan Template

Use this template when creating `docs/plans/{feature-name}.md`:

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

## Plans Index Template

Use this for `docs/plans/index.md`:

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
