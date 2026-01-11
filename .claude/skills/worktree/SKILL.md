---
name: worktree
description: Git worktree management. Create, rename, update, close, or abandon worktrees for isolated work.
---

# Git Worktree Management

Worktrees let you work on multiple branches simultaneously in separate directories. Each worktree has its own working directory but shares the same git repository.

## Directory Structure

- **Main repo**: `<project>/main` (contains scripts and the `main` branch)
- **Worktrees**: `<project>/trees/<worktree-name>`

To find the main repo from any worktree:

```bash
MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
```

## Operations

### Create a new worktree

Start isolated work with a randomly-named worktree (run from main repo):

```bash
MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
cd "$MAIN_REPO" && ./scripts/worktree-create.sh
```

The script outputs the path to the new worktree. Use `cd` to change into that directory and continue working from there.

### Rename a worktree

Rename the current worktree and branch based on the work being done. Use your current understanding of the work in progress to choose a name.

**Categories** (every worktree must use one):

- **setup** - Infrastructure work (dependencies, config, tooling)
- **workflow** - Changes to how we work (scripts, commands, CI)
- **feature** - New features
- **plan** - Planning features or other work
- **bug** - Bug fixes
- **quality** - Code quality improvements (refactoring, tests, types)
- **other** - Everything else

**Choosing a name**:

- Lowercase with hyphens (e.g., `add-camera-form`, `fix-roll-counter`)
- Start with a verb when possible (add, fix, refactor, update, implement)
- Concise but descriptive (2-4 words)
- Describes the feature or fix, not implementation details

```bash
MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
"$MAIN_REPO/scripts/worktree-rename.sh" <category/name>
```

The branch becomes `category/name` (e.g., `workflow/worktree-rename`).
The directory becomes `category-name` (e.g., `workflow-worktree-rename`).

Use `cd` to change into the renamed directory.

### Update a worktree

Rebase the current worktree branch onto the latest main:

```bash
MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
"$MAIN_REPO/scripts/worktree-update.sh"
```

The script automatically stashes uncommitted changes, rebases, and restores them.

If there are rebase conflicts, show the user which files have conflicts, help resolve them, then run `git rebase --continue` and `git stash pop`.

### Close a worktree (merge and cleanup)

Merge the current worktree branch back to main and clean up.

1. Check for uncommitted changes with `git status`
2. If dirty, ask the user whether to commit, stash, or discard changes
3. Once clean, get the paths and switch to main repo:

```bash
WORKTREE_PATH="$(pwd)"
MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
cd "$MAIN_REPO"
./scripts/worktree-close.sh "$WORKTREE_PATH"
```

### Abandon a worktree (discard without merging)

Throw away a worktree and its branch without merging:

```bash
WORKTREE_PATH="$(pwd)"
MAIN_REPO="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
cd "$MAIN_REPO"
./scripts/worktree-abandon.sh "$WORKTREE_PATH"
```
