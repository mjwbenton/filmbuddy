import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table
export const lenses = sqliteTable("lenses", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Types
export type Lens = typeof lenses.$inferSelect;
export type NewLens = typeof lenses.$inferInsert;

// Zod schemas (for form validation)
export const lensInsertSchema = createInsertSchema(lenses, {
  name: z.string().trim().min(1, "Name is required"),
});

export const lensFormSchema = lensInsertSchema.pick({
  name: true,
});

export type LensForm = z.infer<typeof lensFormSchema>;
