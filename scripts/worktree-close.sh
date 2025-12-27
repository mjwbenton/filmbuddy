#!/bin/bash
# Merges a worktree branch back to main and cleans up

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
  echo "Error: Cannot close worktree on main/master branch" >&2
  exit 1
fi

# Check for uncommitted changes
if ! git -C "$WORKTREE_PATH" diff --quiet || ! git -C "$WORKTREE_PATH" diff --cached --quiet; then
  echo "Error: Worktree has uncommitted changes. Please commit or stash first." >&2
  exit 1
fi

# Count commits on this branch since diverging from main
COMMIT_COUNT=$(git -C "$MAIN_REPO" rev-list --count main.."$BRANCH_NAME")

echo "Branch has $COMMIT_COUNT commit(s) since main..."

if [ "$COMMIT_COUNT" -eq 1 ]; then
  # Single commit - rebase onto main and fast-forward
  echo "Rebasing single commit onto main..."
  git -C "$WORKTREE_PATH" rebase main
  git -C "$MAIN_REPO" checkout main
  git -C "$MAIN_REPO" merge --ff-only "$BRANCH_NAME"
else
  # Multiple commits - create a merge commit
  echo "Merging $BRANCH_NAME into main..."
  git -C "$MAIN_REPO" checkout main
  git -C "$MAIN_REPO" merge --no-ff "$BRANCH_NAME" --no-edit
fi

# Remove the worktree
echo "Removing worktree..."
git -C "$MAIN_REPO" worktree remove "$WORKTREE_PATH"

# Delete the branch
echo "Deleting branch $BRANCH_NAME..."
git -C "$MAIN_REPO" branch -d "$BRANCH_NAME"

echo "Done. Worktree closed and branch merged."

# Output the main repo path for the caller
echo "$MAIN_REPO"
