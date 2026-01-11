---
name: worktree-abandon
description: Abandon Worktree. Throw away a worktree and its branch without merging.
---

# Abandon Worktree

Throw away a worktree and its branch without merging.

## Instructions

1. Get the paths and change to the main repo BEFORE abandoning:

   ```bash
   WORKTREE_PATH="$(pwd)"
   MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
   cd "$MAIN_REPO"
   ```

2. Run the abandon script with the worktree path:

   ```bash
   ./scripts/worktree-abandon.sh "$WORKTREE_PATH"
   ```

3. The script removes the worktree and force-deletes the branch without merging.

4. Confirm to the user that the worktree has been abandoned.
