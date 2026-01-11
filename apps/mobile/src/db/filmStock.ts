import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const filmStocks = sqliteTable("film_stocks", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type FilmStock = typeof filmStocks.$inferSelect;
export type NewFilmStock = typeof filmStocks.$inferInsert;

export const filmStockInsertSchema = createInsertSchema(filmStocks, {
  name: z.string().trim().min(1, "Name is required"),
});

export const filmStockFormSchema = filmStockInsertSchema.pick({
  name: true,
});

export type FilmStockForm = z.infer<typeof filmStockFormSchema>;
