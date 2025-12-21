import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table
export const rolls = sqliteTable("rolls", {
  id: text("id").primaryKey(),
  filmStock: text("film_stock").notNull(),
  iso: integer("iso").notNull(),
  camera: text("camera").notNull(),
  loadedAt: integer("loaded_at", { mode: "timestamp" }).notNull(),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
});

// Types
export type Roll = typeof rolls.$inferSelect;
export type NewRoll = typeof rolls.$inferInsert;

// Zod schemas (for form validation)
export const rollInsertSchema = createInsertSchema(rolls, {
  filmStock: z.string().trim().min(1, "Film stock is required"),
  camera: z.string().trim().min(1, "Camera is required"),
  iso: z.number().int().positive(),
});

export const rollFormSchema = rollInsertSchema.pick({
  filmStock: true,
  iso: true,
  camera: true,
});

export type RollForm = z.infer<typeof rollFormSchema>;
