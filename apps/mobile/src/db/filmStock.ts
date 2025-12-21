import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Drizzle table
export const filmStocks = sqliteTable("film_stocks", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Drizzle-inferred types (for DB operations)
export type DbFilmStock = typeof filmStocks.$inferSelect;
export type NewFilmStock = typeof filmStocks.$inferInsert;

// Zod schemas
export const filmStockSelectSchema = createSelectSchema(filmStocks);
export const filmStockInsertSchema = createInsertSchema(filmStocks, {
  name: z.string().trim().min(1, "Name is required"),
});

// Zod-inferred types (for validation)
export type FilmStock = z.infer<typeof filmStockSelectSchema>;
