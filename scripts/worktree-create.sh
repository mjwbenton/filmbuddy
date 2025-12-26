#!/bin/bash
# Creates a new git worktree with a random 3-word name

set -e

# Get the repo root (where this script lives)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TREES_DIR="$REPO_ROOT/trees"

# Word lists for random name generation
ADJECTIVES=(
  fiesty clever swift quiet bold bright calm eager gentle happy
  keen lively merry nimble proud quick sharp steady warm witty
  brave silent golden rusty dusty frozen stormy cosmic mighty ancient
)

VERBS=(
  cleaning dancing flying jumping reading running singing sleeping swimming walking
  writing building cooking drawing fishing hiking painting playing sailing thinking
  gliding roaming drifting floating soaring racing climbing diving spinning twisting
)

NOUNS=(
  rabbit falcon tiger dolphin panda koala phoenix badger otter raven
  sparrow turtle dragon meadow forest river mountain ocean sunset thunder
  canyon glacier whisper crystal ember shadow beacon voyage harbor compass
)

# Generate random name
pick_random() {
  local arr=("$@")
  echo "${arr[$RANDOM % ${#arr[@]}]}"
}

NAME="$(pick_random "${ADJECTIVES[@]}")-$(pick_random "${VERBS[@]}")-$(pick_random "${NOUNS[@]}")"
WORKTREE_PATH="$TREES_DIR/$NAME"

# Ensure trees directory exists
mkdir -p "$TREES_DIR"

# Create the worktree with a new branch of the same name
git -C "$REPO_ROOT" worktree add "$WORKTREE_PATH" -b "$NAME"

# Install dependencies
echo "Installing dependencies..." >&2
(cd "$WORKTREE_PATH" && yarn install)

# Output the path for the caller to use
echo "$WORKTREE_PATH"
