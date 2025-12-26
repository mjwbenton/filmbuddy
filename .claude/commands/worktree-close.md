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

3. Once the working directory is clean, run the close script:

   ```bash
   ./scripts/worktree-close.sh
   ```

4. The script merges the branch to main, removes the worktree, and deletes the branch. It outputs the main repo path.

5. Use `cd` to change back to the main repo directory.

6. Confirm to the user that the worktree has been closed and the branch merged.
