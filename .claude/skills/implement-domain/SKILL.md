---
name: implement-domain
description: Implement database tables and schemas with Drizzle ORM. Use when creating or modifying tables, entities, schemas, or data types.
---

# Domains (Database Entities)

Each domain has its own file containing the Drizzle table and Zod schemas.

## File Structure

```
db/
├── index.ts      # DB instance (expo-sqlite)
├── schema.ts     # Re-exports all tables and schemas
├── roll.ts       # rolls table + schemas
├── camera.ts     # cameras table + schemas
└── [domain].ts   # Your new domain
```

## Domain File Pattern

```typescript
// db/item.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 1. Drizzle table definition
export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// 2. Types inferred from Drizzle
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

// 3. Zod insert schema (for validation at input boundaries)
export const itemInsertSchema = createInsertSchema(items, {
  // Override fields that need custom validation
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().max(500).optional(),
});

// 4. Form schema (picks only user-editable fields)
export const itemFormSchema = itemInsertSchema.pick({
  name: true,
  description: true,
});

export type ItemForm = z.infer<typeof itemFormSchema>;
```

## Export from schema.ts

Add exports to the barrel file:

```typescript
// db/schema.ts
export * from "./roll";
export * from "./camera";
export * from "./item"; // Add your new domain
```

## Generate Migration

After adding or modifying a table:

```bash
npx drizzle-kit generate
```

This creates a migration file in `db/migrations/`.

## Import Patterns

```typescript
// Database instance
import { db } from "@/db";

// Tables, types, and schemas
import { items, Item, NewItem, itemFormSchema } from "@/db/schema";

// Drizzle query helpers
import { eq, desc, and } from "drizzle-orm";
```

## Why No Select Schema?

Data from our own database already matches the schema we used to write it. Zod validation is only needed at input boundaries (forms, APIs), not for trusted internal data.

## Checklist

- [ ] Domain file in `db/[domain].ts`
- [ ] Drizzle table with appropriate columns
- [ ] `$inferSelect` and `$inferInsert` types exported
- [ ] `createInsertSchema` with field validations
- [ ] Form schema with `.pick()` for user-editable fields
- [ ] Export from `db/schema.ts`
- [ ] Run `npx drizzle-kit generate` for migration
