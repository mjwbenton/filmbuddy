# Close Worktree

Merge the current worktree branch back to main and clean up.

## Instructions

1. First, check for uncommitted changes in the current directory:

   ```bash
   git status
   ```

2. If there are uncommitted changes, ask the user whether to:
   - Commit them first (use `/commit`)
   - Stash them
   - Discard them

3. Once the working directory is clean, get the paths and change to the main repo BEFORE closing:

   ```bash
   WORKTREE_PATH="$(pwd)"
   MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
   cd "$MAIN_REPO"
   ```

4. Run the close script with the worktree path:

   ```bash
   ./scripts/worktree-close.sh "$WORKTREE_PATH"
   ```

5. The script merges the branch to main, removes the worktree, and deletes the branch.

6. Confirm to the user that the worktree has been closed and the branch merged.
