import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { rolls, cameras, lenses, filmStocks } from "./schema";

// Roll schemas
export const rollSelectSchema = createSelectSchema(rolls);
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

export type Roll = z.infer<typeof rollSelectSchema>;
export type RollForm = z.infer<typeof rollFormSchema>;

// Camera schemas
export const cameraSelectSchema = createSelectSchema(cameras);
export const cameraInsertSchema = createInsertSchema(cameras, {
  name: z.string().trim().min(1, "Name is required"),
});

export type Camera = z.infer<typeof cameraSelectSchema>;

// Lens schemas
export const lensSelectSchema = createSelectSchema(lenses);
export const lensInsertSchema = createInsertSchema(lenses, {
  name: z.string().trim().min(1, "Name is required"),
});

export type Lens = z.infer<typeof lensSelectSchema>;

// Film stock schemas
export const filmStockSelectSchema = createSelectSchema(filmStocks);
export const filmStockInsertSchema = createInsertSchema(filmStocks, {
  name: z.string().trim().min(1, "Name is required"),
});

export type FilmStock = z.infer<typeof filmStockSelectSchema>;
