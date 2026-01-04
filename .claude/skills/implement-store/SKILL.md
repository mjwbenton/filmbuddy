---
name: implement-store
description: Implement Zustand stores for database access and state management. Use when creating or modifying stores, data access, or CRUD operations.
---

# Zustand Stores

Zustand stores are the standard way to access the database. Each domain entity gets its own store for CRUD operations.

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

## Converting DB Types to Consumer Types

When the database representation differs from what consumers need (see implement-domain skill), the store is responsible for the conversion:

```typescript
import { DbLens, Lens } from "@/db/schema";
import { parseAperturesJson } from "@/lib/aperture";

/** Convert a database row to consumer-facing type */
function parseLensRow(row: DbLens): Lens {
  return {
    ...row,
    apertures: parseAperturesJson(row.apertures),
  };
}

// In load():
const rows = await db.select().from(lenses);
set({ lenses: rows.map(parseLensRow) });
```

This ensures:

- Components receive clean, typed data (e.g., `apertures: number[]`)
- JSON serialization details stay hidden from the rest of the app
- Type safety is preserved end-to-end

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

Tests use `better-sqlite3` for real SQLite and `vi.mock` to replace Expo dependencies.

```typescript
// stores/itemStore.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createTestDb, type TestDbContext } from "@/test/db";

let testDb: TestDbContext;
let idCounter = 0;

vi.mock("expo-crypto", () => ({
  randomUUID: () => `test-id-${++idCounter}`,
}));

vi.mock("@/db", () => ({
  get db() {
    return testDb.db;
  },
}));

beforeEach(async () => {
  testDb = createTestDb();
  idCounter = 0;
  vi.resetModules();
});

afterEach(() => {
  testDb.close();
});

describe("itemStore", () => {
  it("adds an item", async () => {
    const { useItemStore } = await import("./itemStore");
    const store = useItemStore.getState();

    await store.addItem({ name: "Test Item" });
    await store.load();

    expect(useItemStore.getState().items).toHaveLength(1);
    expect(useItemStore.getState().items[0].name).toBe("Test Item");
  });
});
```

Key points:

- `vi.resetModules()` in `beforeEach` gets a fresh store instance
- Dynamic `import()` after reset loads store with mocks applied
- `get db()` getter ensures each test uses its own database

## Checklist

- [ ] Store file in `stores/[name]Store.ts`
- [ ] Export named hook `use[Name]Store`
- [ ] `load()` method for initial data fetch
- [ ] Error handling with `logger.error()`
- [ ] TypeScript interface for store shape
- [ ] Integration test in `stores/[name]Store.test.ts`
