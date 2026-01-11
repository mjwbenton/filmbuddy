import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { APERTURE_BOUNDS } from "@/lib/aperture";

export const lenses = sqliteTable("lenses", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  apertures: text("apertures").notNull().default("[]"),
});

export type DbLens = typeof lenses.$inferSelect;
export type NewLens = typeof lenses.$inferInsert;

export type Lens = Omit<DbLens, "apertures"> & {
  apertures: number[];
};

const aperturesSchema = z
  .array(z.number().min(APERTURE_BOUNDS.min).max(APERTURE_BOUNDS.max))
  .min(1, "At least one aperture is required");

export const lensFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  apertures: aperturesSchema,
});

export type LensForm = z.infer<typeof lensFormSchema>;
