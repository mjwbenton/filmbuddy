---
name: worktree-update
description: Update Worktree. Rebase the current worktree branch onto the latest main.
---

# Update Worktree

Rebase the current worktree branch onto the latest main.

## Instructions

1. Run the update script:

   ```bash
   ./scripts/worktree-update.sh
   ```

   The script automatically stashes uncommitted changes, rebases, and restores them.

2. If there are rebase conflicts:
   - Show the user which files have conflicts
   - Help resolve them
   - Run `git rebase --continue` after resolving
   - Run `git stash pop` to restore any stashed changes

3. Confirm to the user that the branch has been rebased onto main.
