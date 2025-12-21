import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table
export const lenses = sqliteTable("lenses", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Drizzle-inferred types (for DB operations)
export type DbLens = typeof lenses.$inferSelect;
export type NewLens = typeof lenses.$inferInsert;

// Zod schemas
export const lensSelectSchema = createSelectSchema(lenses);
export const lensInsertSchema = createInsertSchema(lenses, {
  name: z.string().trim().min(1, "Name is required"),
});

// Zod-inferred types (for validation)
export type Lens = z.infer<typeof lensSelectSchema>;
