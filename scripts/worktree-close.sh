#!/bin/bash
# Merges a worktree branch back to main and cleans up

set -e

# Get the repo root
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Determine worktree path - use argument or try to detect from cwd
if [ -n "$1" ]; then
  WORKTREE_PATH="$1"
else
  # Check if current directory is inside a worktree
  CURRENT_DIR="$(pwd)"
  if [[ "$CURRENT_DIR" == "$REPO_ROOT/trees/"* ]]; then
    # Extract the worktree name from the path
    WORKTREE_NAME=$(echo "$CURRENT_DIR" | sed "s|$REPO_ROOT/trees/||" | cut -d'/' -f1)
    WORKTREE_PATH="$REPO_ROOT/trees/$WORKTREE_NAME"
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
  echo "Error: Cannot close worktree on main/master branch" >&2
  exit 1
fi

# Check for uncommitted changes
if ! git -C "$WORKTREE_PATH" diff --quiet || ! git -C "$WORKTREE_PATH" diff --cached --quiet; then
  echo "Error: Worktree has uncommitted changes. Please commit or stash first." >&2
  exit 1
fi

# Merge the branch into main
echo "Merging $BRANCH_NAME into main..."
git -C "$REPO_ROOT" checkout main
git -C "$REPO_ROOT" merge "$BRANCH_NAME" --no-edit

# Remove the worktree
echo "Removing worktree..."
git -C "$REPO_ROOT" worktree remove "$WORKTREE_PATH"

# Delete the branch
echo "Deleting branch $BRANCH_NAME..."
git -C "$REPO_ROOT" branch -d "$BRANCH_NAME"

echo "Done. Worktree closed and branch merged."

# Output the main repo path for the caller
echo "$REPO_ROOT"
