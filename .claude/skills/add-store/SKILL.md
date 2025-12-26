---
name: add-store
description: Add Zustand stores for state management. Use when creating a store, managing state, or building data logic that persists to SQLite.
---

# Adding Zustand Stores

Zustand provides lightweight, TypeScript-first state management.

## When to Use Stores

Use a Zustand store when you need:

- CRUD operations on database entities
- State that combines multiple data sources
- Optimistic updates
- Complex derived state

For simple list/detail views that just display database data, you may not need a store.

## Store Location

Store files live in `stores/`:

```
stores/
├── rollStore.ts
├── cameraStore.ts
└── lensStore.ts
```

## Basic Store Pattern

```typescript
// stores/itemStore.ts
import { create } from "zustand";
import { db } from "@/db";
import { items, Item, NewItem } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import { logger } from "@/lib/logger";

interface ItemStore {
  items: Item[];
  isLoading: boolean;
  load: () => Promise<void>;
  addItem: (item: Omit<NewItem, "id" | "createdAt">) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    try {
      const result = await db
        .select()
        .from(items)
        .orderBy(desc(items.createdAt));
      set({ items: result });
    } catch (error) {
      logger.error("Failed to load items", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (data) => {
    const newItem: NewItem = {
      id: randomUUID(),
      createdAt: new Date(),
      ...data,
    };
    try {
      await db.insert(items).values(newItem);
      await get().load(); // Reload from DB
    } catch (error) {
      logger.error("Failed to add item", error);
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      await db.delete(items).where(eq(items.id, id));
      await get().load();
    } catch (error) {
      logger.error("Failed to delete item", error);
      throw error;
    }
  },
}));
```

## Using in Components

```tsx
import { useItemStore } from "@/stores/itemStore";
import { useEffect } from "react";

export function ItemList() {
  const { items, isLoading, load } = useItemStore();

  useEffect(() => {
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ItemCard item={item} />}
    />
  );
}
```

## Selectors

Use selectors to minimize re-renders:

```tsx
// Only re-renders when items array changes
const items = useItemStore((state) => state.items);

// Only re-renders when specific item changes
const item = useItemStore((state) => state.items.find((i) => i.id === id));

// Derived state
const activeItems = useItemStore((state) =>
  state.items.filter((i) => i.status === "active"),
);
```

## Integration Testing

Stores are tested with real SQLite using `better-sqlite3`. See `docs/testing.md` for the full pattern.

Key points:

- Use `vi.mock` for `expo-crypto` and `@/db`
- Use `vi.resetModules()` in `beforeEach` to get fresh store instances
- Use dynamic `import()` after reset to load store with mocks

## Checklist

- [ ] Store file in `stores/[name]Store.ts`
- [ ] Export named hook `use[Name]Store`
- [ ] `load()` method for initial data fetch
- [ ] Error handling with `logger.error()`
- [ ] TypeScript interface for store shape
- [ ] Integration test in `stores/[name]Store.test.ts`
