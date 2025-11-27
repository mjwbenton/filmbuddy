# Git Commit

Create a git commit for files related to this chat session.

## Instructions

1. Run `git status` to see all modified, added, and deleted files in the working directory
2. Review the conversation history to understand what was worked on in this session
3. For each changed file, determine if it's related to this session:
   - Files Claude directly created or edited
   - Files the user modified as part of this task
   - Files changed by running code/commands during this session (e.g., build outputs, generated files, lock files)
   - Exclude files that appear unrelated to the work done in this chat
4. Stage only the files determined to be related to this session
5. Generate a brief, single-line commit message that summarizes what was changed
6. Create the commit

## Commit Message Format

- Single line only, no body
- Brief and descriptive (under 72 characters)
- Use imperative mood (e.g., "Add feature" not "Added feature")
- End with the standard Claude Code footer

## Important

- If unsure whether a file is related, ask the user
- If no related files have changes, inform the user and do not create an empty commit
