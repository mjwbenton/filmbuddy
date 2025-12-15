import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";
import * as schema from "@/db/schema";

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
  for (const entry of journal.entries) {
    const sql = readFileSync(
      join(__dirname, `../../drizzle/${entry.tag}.sql`),
      "utf-8",
    );
    sqlite.exec(sql);
  }

  return {
    db,
    close: () => sqlite.close(),
  };
}
