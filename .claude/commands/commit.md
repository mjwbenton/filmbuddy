# Git Commit

Create a git commit for files related to this chat session, or all modified files if requested.

**Arguments:** $ARGUMENTS

## Instructions

1. Run `git status` to see all modified, added, and deleted files in the working directory
2. Determine which files to include:
   - **If arguments contain "all"**: Include ALL modified, added, and deleted files from git status
   - **Otherwise (default)**: Only include files related to this session:
     - Files Claude directly created or edited
     - Files the user modified as part of this task
     - Files changed by running code/commands during this session (e.g., build outputs, generated files, lock files)
     - Exclude files that appear unrelated to the work done in this chat
3. Stage the appropriate files based on step 2
4. Generate a brief, single-line commit message that summarizes what was changed
5. Create the commit

## Commit Message Format

- Single line only, no body
- Brief and descriptive (under 72 characters)
- Use imperative mood (e.g., "Add feature" not "Added feature")
- End with the standard Claude Code footer

## Important

- If unsure whether a file is related, ask the user
- If no related files have changes, inform the user and do not create an empty commit
