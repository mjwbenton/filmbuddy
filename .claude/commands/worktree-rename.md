# Rename Worktree

Rename the current worktree and branch based on the work being done.

## Categories

Every worktree must be classified into one of these categories:

- **setup** - Infrastructure work for the app (dependencies, config, tooling)
- **workflow** - Changes to how we work on the app (scripts, commands, CI)
- **feature** - New features for the app
- **plan** - Planning features or other work
- **bug** - Bug fixes
- **quality** - Code quality improvements (refactoring, tests, types)
- **other** - Everything else

## Instructions

1. First, analyze the work in this worktree to understand what it's about:
   - Check `git diff main` to see what code changes have been made
   - Check `git log main..HEAD --oneline` to see commit messages
   - Look at any uncommitted changes with `git status` and `git diff`

2. Based on the changes, determine:
   - The appropriate **category** from the list above
   - A descriptive **name** that:
     - Is lowercase with hyphens (e.g., `add-camera-form`, `fix-roll-counter`)
     - Starts with a verb when possible (add, fix, refactor, update, implement)
     - Is concise but descriptive (2-4 words)
     - Describes the feature or fix, not implementation details

3. Present your suggested `category/name` to the user and ask for confirmation or alternatives.

4. Once confirmed, run the rename script:

   ```bash
   ./scripts/worktree-rename.sh <category/name>
   ```

   The branch will be named `category/name` (e.g., `workflow/worktree-rename`).
   The directory will be named `category-name` (e.g., `workflow-worktree-rename`).

5. The script outputs the new worktree path. Use `cd` to change into the renamed directory.

6. Confirm to the user the rename is complete and show the new branch name and path.
