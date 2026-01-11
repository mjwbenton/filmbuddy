# Implementation Plan Template

Use this template when creating `docs/plans/{feature-name}.md`:

````markdown
# Plan: [Feature Name]

Spec: [../specs/{feature-name}.md](../specs/{feature-name}.md)

## Summary

[Brief description of what will be built]

## Tasks

### 1. Data Layer

- [ ] **Add table to schema**

  ```typescript
  // apps/mobile/src/db/schema.ts
  export const rolls = sqliteTable("rolls", {
    id: text("id").primaryKey(),
    filmStock: text("film_stock").notNull(),
    iso: integer("iso"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  });
  ```
````

- [ ] **Create Zod schemas**

  ```typescript
  // apps/mobile/src/db/schema.ts
  export const insertRollSchema = createInsertSchema(rolls);
  export const rollFormSchema = insertRollSchema.pick({
    filmStock: true,
    iso: true,
  });
  ```

- [ ] **Create store**

  ```typescript
  // apps/mobile/src/stores/rollStore.ts
  interface RollStore {
    rolls: Roll[];
    addRoll: (roll: InsertRoll) => Promise<void>;
    // ... other methods
  }
  ```

### 2. Unit Tests

- [ ] **Validation tests** - `apps/mobile/src/lib/__tests__/roll-validation.test.ts`
  - Test valid input passes
  - Test required fields reject empty values
  - Test ISO range validation

### 3. Components

- [ ] **RollCard** - `apps/mobile/src/components/RollCard.tsx`

  ```typescript
  interface RollCardProps {
    roll: Roll;
    onPress: () => void;
    testID?: string;
  }
  ```

- [ ] **RollForm** - `apps/mobile/src/components/RollForm.tsx`

  Required testIDs:
  - `film-stock-input`
  - `iso-input`
  - `save-button`

### 4. Screens

- [ ] **Roll list** - `apps/mobile/app/(tabs)/rolls.tsx`

  Required testIDs:
  - `add-roll-button`
  - `roll-list`

- [ ] **Roll detail** - `apps/mobile/app/roll/[id].tsx`

### 5. E2E Tests

- [x] Maestro flows created in `apps/mobile/e2e/flows/`

## Required testIDs

From maestro-test output:

| Element          | testID             | Component   |
| ---------------- | ------------------ | ----------- |
| Add button       | `add-roll-button`  | RollsScreen |
| Film stock input | `film-stock-input` | RollForm    |
| Save button      | `save-button`      | RollForm    |

## Codebase Patterns

[Document relevant patterns discovered during research]

- Forms use react-hook-form with Zod resolver
- Stores follow pattern in `apps/mobile/src/stores/gearStore.ts`
- Lists use FlashList from `@shopify/flash-list`

```

## Conventions

- Use checkboxes `[ ]` for pending, `[x]` for done
- Group tasks by layer (data, tests, components, screens)
- Include code snippets showing exact structure
- Include testIDs table from maestro-test output
- Link to spec at the top
```
