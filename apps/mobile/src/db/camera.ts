import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table
export const cameras = sqliteTable("cameras", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Drizzle-inferred types (for DB operations)
export type DbCamera = typeof cameras.$inferSelect;
export type NewCamera = typeof cameras.$inferInsert;

// Zod schemas
export const cameraSelectSchema = createSelectSchema(cameras);
export const cameraInsertSchema = createInsertSchema(cameras, {
  name: z.string().trim().min(1, "Name is required"),
});

// Zod-inferred types (for validation)
export type Camera = z.infer<typeof cameraSelectSchema>;
