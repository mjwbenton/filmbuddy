import { z } from "zod";

// Form schema for adding/editing gear items
export const gearFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export type GearForm = z.infer<typeof gearFormSchema>;

// Domain schemas for database rows
export const cameraSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.date(),
});

export type Camera = z.infer<typeof cameraSchema>;

export const lensSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.date(),
});

export type Lens = z.infer<typeof lensSchema>;

export const filmStockSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.date(),
});

export type FilmStock = z.infer<typeof filmStockSchema>;

// Gear type discriminator for shared components
export type GearType = "camera" | "lens" | "filmStock";

export type GearItem = Camera | Lens | FilmStock;
