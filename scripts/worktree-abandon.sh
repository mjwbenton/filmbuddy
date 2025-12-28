#!/bin/bash
# Abandons a worktree and deletes its branch without merging

set -e

# Get the main repo root (works from worktree or main repo)
GIT_COMMON_DIR="$(git rev-parse --git-common-dir)"
MAIN_REPO="$(cd "$GIT_COMMON_DIR/.." && pwd)"
TREES_DIR="$MAIN_REPO/trees"

# Determine worktree path - use argument or try to detect from cwd
if [ -n "$1" ]; then
  WORKTREE_PATH="$1"
else
  # Check if current directory is inside a worktree
  CURRENT_DIR="$(pwd)"
  if [[ "$CURRENT_DIR" == "$TREES_DIR/"* ]]; then
    # Extract the worktree name from the path
    WORKTREE_NAME=$(echo "$CURRENT_DIR" | sed "s|$TREES_DIR/||" | cut -d'/' -f1)
    WORKTREE_PATH="$TREES_DIR/$WORKTREE_NAME"
  else
    echo "Error: Not in a worktree and no worktree path provided" >&2
    exit 1
  fi
fi

# Verify the worktree exists
if [ ! -d "$WORKTREE_PATH" ]; then
  echo "Error: Worktree path does not exist: $WORKTREE_PATH" >&2
  exit 1
fi

# Get the branch name from the worktree
BRANCH_NAME=$(git -C "$WORKTREE_PATH" rev-parse --abbrev-ref HEAD)

if [ "$BRANCH_NAME" = "main" ] || [ "$BRANCH_NAME" = "master" ]; then
  echo "Error: Cannot abandon worktree on main/master branch" >&2
  exit 1
fi

echo "Abandoning worktree: $WORKTREE_PATH"
echo "Branch to delete: $BRANCH_NAME"

# Remove the worktree (force to handle uncommitted changes)
echo "Removing worktree..."
git -C "$MAIN_REPO" worktree remove --force "$WORKTREE_PATH"

# Force delete the branch (since it's not merged)
echo "Deleting branch $BRANCH_NAME..."
git -C "$MAIN_REPO" branch -D "$BRANCH_NAME"

echo "Done. Worktree abandoned and branch deleted."

# Output the main repo path for the caller
echo "$MAIN_REPO"
