import { z } from "zod";

export const ISO_VALUES = [
  25, 50, 80, 100, 160, 200, 400, 800, 1600, 3200,
] as const;
export type ISOValue = (typeof ISO_VALUES)[number];

// Derive schema from ISO_VALUES to maintain single source of truth
const isoLiterals = ISO_VALUES.map((v) => z.literal(v)) as [
  z.ZodLiteral<ISOValue>,
  ...z.ZodLiteral<ISOValue>[],
];

const isoSchema = z.union(isoLiterals);

export const rollFormSchema = z.object({
  filmStock: z.string().trim().min(1, "Film stock is required"),
  iso: isoSchema,
  camera: z.string().trim().min(1, "Camera is required"),
});

export type RollForm = z.infer<typeof rollFormSchema>;

export const rollSchema = z.object({
  id: z.string().min(1),
  filmStock: z.string().min(1),
  iso: isoSchema,
  camera: z.string().min(1),
  loadedAt: z.date(),
  finishedAt: z.date().nullable(),
});

export type Roll = z.infer<typeof rollSchema>;
