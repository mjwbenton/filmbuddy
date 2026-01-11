#!/bin/bash
# Rebases a worktree branch onto the latest main

set -e

# Get the main repo root (works from worktree or main repo) and trees dir (sibling)
GIT_COMMON_DIR="$(git rev-parse --git-common-dir)"
MAIN_REPO="$(cd "$GIT_COMMON_DIR/.." && pwd)"
TREES_DIR="$(dirname "$MAIN_REPO")/trees"

# Determine worktree path from cwd or argument
if [ -n "$1" ]; then
  WORKTREE_PATH="$1"
else
  CURRENT_DIR="$(pwd)"
  if [[ "$CURRENT_DIR" == "$TREES_DIR/"* ]]; then
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
  echo "Error: Cannot rebase main/master branch" >&2
  exit 1
fi

# Check for uncommitted changes and stash if needed
STASHED=false
if ! git -C "$WORKTREE_PATH" diff --quiet || ! git -C "$WORKTREE_PATH" diff --cached --quiet; then
  echo "Stashing uncommitted changes..."
  git -C "$WORKTREE_PATH" stash push -m "worktree-update: auto-stash before rebase"
  STASHED=true
fi

# Fetch latest main in the main repo
echo "Fetching latest main..."
git -C "$MAIN_REPO" fetch origin main:main 2>/dev/null || git -C "$MAIN_REPO" checkout main && git -C "$MAIN_REPO" pull && git -C "$MAIN_REPO" checkout -

# Rebase onto main
echo "Rebasing $BRANCH_NAME onto main..."
if ! git -C "$WORKTREE_PATH" rebase main; then
  echo "Rebase failed. Your changes are still stashed." >&2
  echo "Resolve conflicts, then run 'git rebase --continue' and 'git stash pop'" >&2
  exit 1
fi

# Restore stashed changes
if [ "$STASHED" = true ]; then
  echo "Restoring stashed changes..."
  git -C "$WORKTREE_PATH" stash pop
fi

echo "Done. Branch $BRANCH_NAME is now up to date with main."
