# FilmBuddy

A field companion app for film photographers to track active rolls, log selective notes per frame, and manage their gear library.

## Project Vision

See [docs/vision.md](docs/vision.md) for the full product vision, design principles, and target user.

## Design System

See [docs/design.md](docs/design.md) for colors, typography, spacing, and component guidelines. All UI work should follow these standards.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the technical stack, project structure, and development workflow.

## Communication Style

Be direct and concise. No fluff, no filler—get straight to the point.

Don't summarize or repeat back what you just did—I can see the changes in the files. Only tell me things I can't already see: errors, blockers, decisions you made, or questions you have.

## Coding Guidelines

### Imports

Don't use barrel files (index.ts files that only re-export). Import directly from the source file.

**Good:**

```typescript
import { Button } from "@/components/ui/Button";
import { rolls } from "@/db/roll";
```

**Bad:**

```typescript
import { Button } from "@/components/ui";
import { rolls } from "@/db/schema";
```

### Comments

Comments should explain **why**, not **what**. The "what" can always be derived from reading the code.

**Good** - explains non-obvious reasoning:

```typescript
// Epsilon for comparing aperture values (handles floating point imprecision)
const APERTURE_EPSILON = 0.01;
```

**Bad** - restates what the code already shows:

```typescript
// Drizzle table
export const cameras = sqliteTable("cameras", {
```
