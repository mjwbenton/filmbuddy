---
name: commit
description: Create git commits
model: claude-haiku-4-5
---

# Git Commit

When creating commits, only commit the files related to the current context – don't just commit everything there may be unrelated modifications in the working tree.

**Arguments:** $ARGUMENTS

## Commit Message Format

- Single line only, no body
- Brief and descriptive (under 72 characters)
- Use imperative mood (e.g., "Add feature" not "Added feature")
- End with the standard Claude Code footer

## Important

- If unsure whether a file is related, ask the user
- If no related files have changes, inform the user and do not create an empty commit
