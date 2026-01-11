import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cameras = sqliteTable("cameras", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Camera = typeof cameras.$inferSelect;
export type NewCamera = typeof cameras.$inferInsert;

export const cameraInsertSchema = createInsertSchema(cameras, {
  name: z.string().trim().min(1, "Name is required"),
});

export const cameraFormSchema = cameraInsertSchema.pick({
  name: true,
});

export type CameraForm = z.infer<typeof cameraFormSchema>;
