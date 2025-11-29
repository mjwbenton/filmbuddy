import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite";
import migrations from "../../drizzle/migrations";
import * as schema from "./schema";

const expo = openDatabaseSync("app.db", { enableChangeListener: true });
export const db = drizzle(expo, { schema });

export function useDbReady(): { success: boolean; error?: Error } {
  return useMigrations(db, migrations);
}
