#!/bin/bash
# Renames a worktree directory and its associated branch

set -e

# Get the main repo root (works from worktree or main repo)
GIT_COMMON_DIR="$(git rev-parse --git-common-dir)"
MAIN_REPO="$(cd "$GIT_COMMON_DIR/.." && pwd)"
TREES_DIR="$MAIN_REPO/trees"

# Get new name from argument
NEW_NAME="$1"

if [ -z "$NEW_NAME" ]; then
  echo "Error: New name required" >&2
  echo "Usage: $0 <new-name>" >&2
  exit 1
fi

# Valid category prefixes
VALID_CATEGORIES="setup|workflow|feature|plan|bug|quality|other"

# Validate name format: category/description
if ! echo "$NEW_NAME" | grep -qE "^($VALID_CATEGORIES)/[a-z0-9][a-z0-9-]*[a-z0-9]$|^($VALID_CATEGORIES)/[a-z0-9]$"; then
  echo "Error: Name must be category/description format" >&2
  echo "Valid categories: setup, workflow, feature, plan, bug, quality, other" >&2
  echo "Example: 'feature/add-camera-form' or 'bug/fix-roll-counter'" >&2
  exit 1
fi

# Branch name uses slash, directory name uses hyphen
NEW_BRANCH="$NEW_NAME"
NEW_DIR_NAME=$(echo "$NEW_NAME" | tr '/' '-')

# Determine current worktree path from cwd
CURRENT_DIR="$(pwd)"
if [[ "$CURRENT_DIR" == "$TREES_DIR/"* ]]; then
  OLD_DIR_NAME=$(echo "$CURRENT_DIR" | sed "s|$TREES_DIR/||" | cut -d'/' -f1)
  OLD_WORKTREE_PATH="$TREES_DIR/$OLD_DIR_NAME"
else
  echo "Error: Not in a worktree directory" >&2
  exit 1
fi

NEW_WORKTREE_PATH="$TREES_DIR/$NEW_DIR_NAME"

# Check if new directory already exists
if [ -d "$NEW_WORKTREE_PATH" ]; then
  echo "Error: Worktree directory '$NEW_DIR_NAME' already exists" >&2
  exit 1
fi

# Check if branch name already exists
if git -C "$MAIN_REPO" show-ref --verify --quiet "refs/heads/$NEW_BRANCH"; then
  echo "Error: Branch '$NEW_BRANCH' already exists" >&2
  exit 1
fi

# Get the current branch name
OLD_BRANCH=$(git -C "$OLD_WORKTREE_PATH" rev-parse --abbrev-ref HEAD)

if [ "$OLD_BRANCH" = "main" ] || [ "$OLD_BRANCH" = "master" ]; then
  echo "Error: Cannot rename worktree on main/master branch" >&2
  exit 1
fi

echo "Renaming: $OLD_DIR_NAME -> $NEW_DIR_NAME (branch: $NEW_BRANCH)"

# Rename the branch
echo "Renaming branch..."
git -C "$OLD_WORKTREE_PATH" branch -m "$NEW_BRANCH"

# Move the worktree directory
echo "Moving worktree directory..."
git -C "$MAIN_REPO" worktree move "$OLD_WORKTREE_PATH" "$NEW_WORKTREE_PATH"

# Reinstall dependencies to fix git hooks (Husky setup)
echo "Reinstalling dependencies..."
(cd "$NEW_WORKTREE_PATH" && yarn install)

echo "Done."

# Output the new path for the caller
echo "$NEW_WORKTREE_PATH"
