import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";
import * as cameraSchema from "@/db/camera";
import * as filmStockSchema from "@/db/filmStock";
import * as lensSchema from "@/db/lens";
import * as rollSchema from "@/db/roll";

const schema = {
  ...cameraSchema,
  ...filmStockSchema,
  ...lensSchema,
  ...rollSchema,
};

// Read migration journal to get list of migrations
import journal from "../../drizzle/meta/_journal.json";

export type TestDb = BetterSQLite3Database<typeof schema>;

export interface TestDbContext {
  db: TestDb;
  close: () => void;
}

export function createTestDb(): TestDbContext {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema });

  // Apply all migrations from journal in order
  journal.entries.forEach((entry) => {
    const sql = readFileSync(
      join(__dirname, `../../drizzle/${entry.tag}.sql`),
      "utf-8",
    );
    sqlite.exec(sql);
  });

  return {
    db,
    close: () => sqlite.close(),
  };
}
