import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { APERTURE_BOUNDS, type StopIncrement } from "@/lib/aperture";

// Aperture mode type
export type ApertureMode = "standard" | "custom";

// Drizzle table
export const lenses = sqliteTable("lenses", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  // Aperture configuration
  apertureMode: text("aperture_mode")
    .$type<ApertureMode>()
    .notNull()
    .default("standard"),
  maxAperture: real("max_aperture").notNull().default(2.8),
  minAperture: real("min_aperture").notNull().default(16),
  stopIncrement: text("stop_increment")
    .$type<StopIncrement>()
    .notNull()
    .default("whole"),
  customApertures: text("custom_apertures"), // JSON-stringified array, null for standard mode
});

// Types
export type Lens = typeof lenses.$inferSelect;
export type NewLens = typeof lenses.$inferInsert;

// Aperture mode enum for Zod
const apertureModeSchema = z.enum(["standard", "custom"]);
const stopIncrementSchema = z.enum(["whole", "half", "third"]);

// Custom apertures array schema
const customAperturesSchema = z.array(
  z.number().min(APERTURE_BOUNDS.min).max(APERTURE_BOUNDS.max),
);

// Zod schemas (for form validation)
export const lensInsertSchema = createInsertSchema(lenses, {
  name: z.string().trim().min(1, "Name is required"),
  apertureMode: apertureModeSchema,
  maxAperture: z.number().min(APERTURE_BOUNDS.min).max(APERTURE_BOUNDS.max),
  minAperture: z.number().min(APERTURE_BOUNDS.min).max(APERTURE_BOUNDS.max),
  stopIncrement: stopIncrementSchema,
  customApertures: z.string().nullable(),
});

// Form schema for user-editable fields
export const lensFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    apertureMode: apertureModeSchema,
    maxAperture: z.number().min(APERTURE_BOUNDS.min).max(APERTURE_BOUNDS.max),
    minAperture: z.number().min(APERTURE_BOUNDS.min).max(APERTURE_BOUNDS.max),
    stopIncrement: stopIncrementSchema,
    customApertures: customAperturesSchema,
  })
  .refine(
    (data) => {
      if (data.apertureMode === "standard") {
        // For standard mode, min must be narrower (larger f-number) than max
        return data.maxAperture < data.minAperture;
      }
      return true;
    },
    {
      message: "Minimum aperture must be narrower than maximum",
      path: ["minAperture"],
    },
  )
  .refine(
    (data) => {
      if (data.apertureMode === "custom") {
        // For custom mode, must have at least one aperture
        return data.customApertures.length > 0;
      }
      return true;
    },
    {
      message: "At least one aperture is required",
      path: ["customApertures"],
    },
  );

export type LensForm = z.infer<typeof lensFormSchema>;
