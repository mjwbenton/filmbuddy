# FilmBuddy

A field companion app for film photographers. Track active rolls, log selective notes per frame, and manage your gear library.

See [docs/vision.md](docs/vision.md) for the full product vision.

## Project Setup

This project uses git worktrees for isolated development. The directory structure is:

```
filmbuddy/
├── main/          # Main branch (this repo)
│   ├── scripts/   # Worktree management scripts
│   └── ...
└── trees/         # Active worktrees
    ├── feature-add-camera/
    ├── bug-fix-roll-counter/
    └── ...
```

### Initial Setup

Clone the repo as `main`:

```bash
git clone <repo-url> filmbuddy/main
cd filmbuddy/main
mkdir ../trees
yarn install
```
