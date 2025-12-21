import { create } from "zustand";
import { eq, desc, isNull, isNotNull } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import { db } from "@/db";
import { rolls, Roll as DbRoll, NewRoll } from "@/db/schema";
import { rollSelectSchema, Roll } from "@/db/schemas";
import { logger } from "@/lib/logger";

// Convert DB row to domain type with runtime validation
function toRoll(dbRow: DbRoll): Roll {
  const result = rollSelectSchema.safeParse(dbRow);
  if (!result.success) {
    logger.warn(`Invalid roll data for ${dbRow.id}`, result.error.flatten());
    return dbRow as Roll;
  }
  return result.data;
}

interface RollStore {
  activeRolls: Roll[];
  finishedRolls: Roll[];
  isLoading: boolean;
  error: Error | null;
  loadRolls: () => Promise<void>;
  addRoll: (roll: Omit<NewRoll, "id" | "loadedAt">) => Promise<void>;
  updateRoll: (
    id: string,
    updates: Partial<Pick<Roll, "filmStock" | "iso" | "camera">>,
  ) => Promise<void>;
  markFinished: (id: string) => Promise<void>;
  markActive: (id: string) => Promise<void>;
  deleteRoll: (id: string) => Promise<void>;
  getRollById: (id: string) => Roll | undefined;
}

export const useRollStore = create<RollStore>((set, get) => ({
  activeRolls: [],
  finishedRolls: [],
  isLoading: false,
  error: null,

  loadRolls: async () => {
    set({ isLoading: true, error: null });
    try {
      const [active, finished] = await Promise.all([
        db
          .select()
          .from(rolls)
          .where(isNull(rolls.finishedAt))
          .orderBy(desc(rolls.loadedAt)),
        db
          .select()
          .from(rolls)
          .where(isNotNull(rolls.finishedAt))
          .orderBy(desc(rolls.finishedAt)),
      ]);
      set({
        activeRolls: active.map(toRoll),
        finishedRolls: finished.map(toRoll),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error(String(error)),
        isLoading: false,
      });
    }
  },

  addRoll: async (rollData) => {
    const newRoll: NewRoll = {
      id: randomUUID(),
      filmStock: rollData.filmStock,
      iso: rollData.iso,
      camera: rollData.camera,
      loadedAt: new Date(),
      finishedAt: null,
    };
    await db.insert(rolls).values(newRoll);
    await get().loadRolls();
  },

  updateRoll: async (id, updates) => {
    await db.update(rolls).set(updates).where(eq(rolls.id, id));
    await get().loadRolls();
  },

  markFinished: async (id) => {
    await db
      .update(rolls)
      .set({ finishedAt: new Date() })
      .where(eq(rolls.id, id));
    await get().loadRolls();
  },

  markActive: async (id) => {
    await db.update(rolls).set({ finishedAt: null }).where(eq(rolls.id, id));
    await get().loadRolls();
  },

  deleteRoll: async (id) => {
    await db.delete(rolls).where(eq(rolls.id, id));
    await get().loadRolls();
  },

  getRollById: (id) => {
    const { activeRolls, finishedRolls } = get();
    return (
      activeRolls.find((r) => r.id === id) ||
      finishedRolls.find((r) => r.id === id)
    );
  },
}));
