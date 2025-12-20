import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const rolls = sqliteTable("rolls", {
  id: text("id").primaryKey(),
  filmStock: text("film_stock").notNull(),
  iso: integer("iso").notNull(),
  camera: text("camera").notNull(),
  loadedAt: integer("loaded_at", { mode: "timestamp" }).notNull(),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
});

export type Roll = typeof rolls.$inferSelect;
export type NewRoll = typeof rolls.$inferInsert;

export const cameras = sqliteTable("cameras", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Camera = typeof cameras.$inferSelect;
export type NewCamera = typeof cameras.$inferInsert;

export const lenses = sqliteTable("lenses", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Lens = typeof lenses.$inferSelect;
export type NewLens = typeof lenses.$inferInsert;

export const filmStocks = sqliteTable("film_stocks", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type FilmStock = typeof filmStocks.$inferSelect;
export type NewFilmStock = typeof filmStocks.$inferInsert;
