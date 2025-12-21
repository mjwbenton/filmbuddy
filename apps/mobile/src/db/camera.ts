import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table
export const cameras = sqliteTable("cameras", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Types
export type Camera = typeof cameras.$inferSelect;
export type NewCamera = typeof cameras.$inferInsert;

// Zod schemas (for form validation)
export const cameraInsertSchema = createInsertSchema(cameras, {
  name: z.string().trim().min(1, "Name is required"),
});

export const cameraFormSchema = cameraInsertSchema.pick({
  name: true,
});

export type CameraForm = z.infer<typeof cameraFormSchema>;
