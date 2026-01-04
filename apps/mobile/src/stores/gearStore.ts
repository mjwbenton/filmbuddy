import { create } from "zustand";
import { eq, asc } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import { db } from "@/db";
import {
  cameras,
  lenses,
  filmStocks,
  Camera,
  Lens,
  FilmStock,
  LensForm,
} from "@/db/schema";
import { UserFacingError } from "@/lib/errors";

interface GearStore {
  cameras: Camera[];
  lenses: Lens[];
  filmStocks: FilmStock[];
  isLoading: boolean;
  error: Error | null;
  loadGear: () => Promise<void>;
  addCamera: (name: string) => Promise<void>;
  updateCamera: (id: string, name: string) => Promise<void>;
  deleteCamera: (id: string) => Promise<void>;
  addLens: (data: LensForm) => Promise<void>;
  updateLens: (id: string, data: LensForm) => Promise<void>;
  deleteLens: (id: string) => Promise<void>;
  addFilmStock: (name: string) => Promise<void>;
  updateFilmStock: (id: string, name: string) => Promise<void>;
  deleteFilmStock: (id: string) => Promise<void>;
  getCameraById: (id: string) => Camera | undefined;
  getLensById: (id: string) => Lens | undefined;
  getFilmStockById: (id: string) => FilmStock | undefined;
}

export const useGearStore = create<GearStore>((set, get) => ({
  cameras: [],
  lenses: [],
  filmStocks: [],
  isLoading: false,
  error: null,

  loadGear: async () => {
    set({ isLoading: true, error: null });
    try {
      const [cameraRows, lensRows, filmStockRows] = await Promise.all([
        db.select().from(cameras).orderBy(asc(cameras.createdAt)),
        db.select().from(lenses).orderBy(asc(lenses.createdAt)),
        db.select().from(filmStocks).orderBy(asc(filmStocks.createdAt)),
      ]);
      set({
        cameras: cameraRows,
        lenses: lensRows,
        filmStocks: filmStockRows,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error(String(error)),
        isLoading: false,
      });
    }
  },

  // Camera operations
  addCamera: async (name: string) => {
    const trimmedName = name.trim();
    const existing = get().cameras.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      throw new UserFacingError("A camera with this name already exists");
    }
    await db.insert(cameras).values({
      id: randomUUID(),
      name: trimmedName,
      createdAt: new Date(),
    });
    await get().loadGear();
  },

  updateCamera: async (id: string, name: string) => {
    const trimmedName = name.trim();
    const existing = get().cameras.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== id,
    );
    if (existing) {
      throw new UserFacingError("A camera with this name already exists");
    }
    await db
      .update(cameras)
      .set({ name: trimmedName })
      .where(eq(cameras.id, id));
    await get().loadGear();
  },

  deleteCamera: async (id: string) => {
    await db.delete(cameras).where(eq(cameras.id, id));
    await get().loadGear();
  },

  getCameraById: (id: string) => {
    return get().cameras.find((c) => c.id === id);
  },

  // Lens operations
  addLens: async (data: LensForm) => {
    const trimmedName = data.name.trim();
    const existing = get().lenses.find(
      (l) => l.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      throw new UserFacingError("A lens with this name already exists");
    }
    await db.insert(lenses).values({
      id: randomUUID(),
      name: trimmedName,
      createdAt: new Date(),
      apertureMode: data.apertureMode,
      maxAperture: data.maxAperture,
      minAperture: data.minAperture,
      stopIncrement: data.stopIncrement,
      customApertures:
        data.apertureMode === "custom"
          ? JSON.stringify(data.customApertures)
          : null,
    });
    await get().loadGear();
  },

  updateLens: async (id: string, data: LensForm) => {
    const trimmedName = data.name.trim();
    const existing = get().lenses.find(
      (l) => l.name.toLowerCase() === trimmedName.toLowerCase() && l.id !== id,
    );
    if (existing) {
      throw new UserFacingError("A lens with this name already exists");
    }
    await db
      .update(lenses)
      .set({
        name: trimmedName,
        apertureMode: data.apertureMode,
        maxAperture: data.maxAperture,
        minAperture: data.minAperture,
        stopIncrement: data.stopIncrement,
        customApertures:
          data.apertureMode === "custom"
            ? JSON.stringify(data.customApertures)
            : null,
      })
      .where(eq(lenses.id, id));
    await get().loadGear();
  },

  deleteLens: async (id: string) => {
    await db.delete(lenses).where(eq(lenses.id, id));
    await get().loadGear();
  },

  getLensById: (id: string) => {
    return get().lenses.find((l) => l.id === id);
  },

  // Film stock operations
  addFilmStock: async (name: string) => {
    const trimmedName = name.trim();
    const existing = get().filmStocks.find(
      (f) => f.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      throw new UserFacingError("A film stock with this name already exists");
    }
    await db.insert(filmStocks).values({
      id: randomUUID(),
      name: trimmedName,
      createdAt: new Date(),
    });
    await get().loadGear();
  },

  updateFilmStock: async (id: string, name: string) => {
    const trimmedName = name.trim();
    const existing = get().filmStocks.find(
      (f) => f.name.toLowerCase() === trimmedName.toLowerCase() && f.id !== id,
    );
    if (existing) {
      throw new UserFacingError("A film stock with this name already exists");
    }
    await db
      .update(filmStocks)
      .set({ name: trimmedName })
      .where(eq(filmStocks.id, id));
    await get().loadGear();
  },

  deleteFilmStock: async (id: string) => {
    await db.delete(filmStocks).where(eq(filmStocks.id, id));
    await get().loadGear();
  },

  getFilmStockById: (id: string) => {
    return get().filmStocks.find((f) => f.id === id);
  },
}));
