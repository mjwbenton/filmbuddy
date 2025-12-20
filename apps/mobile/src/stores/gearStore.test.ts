import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createTestDb, type TestDbContext } from "@/test/db";

// Track test state using object to avoid let
const testState: { db: TestDbContext | null; idCounter: number } = {
  db: null,
  idCounter: 0,
};

// Mock expo-crypto
vi.mock("expo-crypto", () => ({
  randomUUID: () => `test-id-${++testState.idCounter}`,
}));

// Mock @/db to use test database
vi.mock("@/db", () => ({
  get db() {
    return testState.db?.db;
  },
}));

describe("gearStore", () => {
  beforeEach(async () => {
    testState.db = createTestDb();
    testState.idCounter = 0;
    vi.resetModules();
  });

  afterEach(() => {
    testState.db?.close();
  });

  describe("loadGear", () => {
    it("loads empty lists from empty database", async () => {
      const { useGearStore } = await import("./gearStore");

      await useGearStore.getState().loadGear();

      expect(useGearStore.getState().cameras).toEqual([]);
      expect(useGearStore.getState().lenses).toEqual([]);
      expect(useGearStore.getState().filmStocks).toEqual([]);
      expect(useGearStore.getState().isLoading).toBe(false);
    });

    it("orders items by createdAt ascending (oldest first)", async () => {
      const { useGearStore } = await import("./gearStore");

      await useGearStore.getState().addCamera("Second Camera");
      await useGearStore.getState().addCamera("First Camera");

      const { cameras } = useGearStore.getState();
      expect(cameras[0].name).toBe("Second Camera");
      expect(cameras[1].name).toBe("First Camera");
    });
  });

  describe("cameras", () => {
    describe("addCamera", () => {
      it("creates a camera and updates state", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");

        const { cameras } = useGearStore.getState();
        expect(cameras).toHaveLength(1);
        expect(cameras[0].name).toBe("Leica M6");
        expect(cameras[0].id).toBe("test-id-1");
        expect(cameras[0].createdAt).toBeInstanceOf(Date);
      });

      it("trims whitespace from name", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addCamera("  Leica M6  ");

        const { cameras } = useGearStore.getState();
        expect(cameras[0].name).toBe("Leica M6");
      });

      it("throws DuplicateNameError for duplicate name", async () => {
        const { useGearStore, DuplicateNameError } =
          await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");

        await expect(
          useGearStore.getState().addCamera("Leica M6"),
        ).rejects.toThrow(DuplicateNameError);
      });

      it("throws DuplicateNameError for case-insensitive duplicate", async () => {
        const { useGearStore, DuplicateNameError } =
          await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");

        await expect(
          useGearStore.getState().addCamera("leica m6"),
        ).rejects.toThrow(DuplicateNameError);
      });
    });

    describe("updateCamera", () => {
      it("updates camera name", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");
        await useGearStore.getState().updateCamera("test-id-1", "Leica M6 TTL");

        const { cameras } = useGearStore.getState();
        expect(cameras[0].name).toBe("Leica M6 TTL");
      });

      it("throws DuplicateNameError when updating to existing name", async () => {
        const { useGearStore, DuplicateNameError } =
          await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");
        await useGearStore.getState().addCamera("Hasselblad 500C/M");

        await expect(
          useGearStore.getState().updateCamera("test-id-2", "Leica M6"),
        ).rejects.toThrow(DuplicateNameError);
      });

      it("allows updating to same name (no change)", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");
        await useGearStore.getState().updateCamera("test-id-1", "Leica M6");

        const { cameras } = useGearStore.getState();
        expect(cameras[0].name).toBe("Leica M6");
      });
    });

    describe("deleteCamera", () => {
      it("removes camera from database and state", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");
        await useGearStore.getState().deleteCamera("test-id-1");

        const { cameras } = useGearStore.getState();
        expect(cameras).toHaveLength(0);
      });
    });

    describe("getCameraById", () => {
      it("finds camera by id", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addCamera("Leica M6");

        const camera = useGearStore.getState().getCameraById("test-id-1");
        expect(camera).toBeDefined();
        expect(camera?.name).toBe("Leica M6");
      });

      it("returns undefined for non-existent camera", async () => {
        const { useGearStore } = await import("./gearStore");

        const camera = useGearStore.getState().getCameraById("non-existent");
        expect(camera).toBeUndefined();
      });
    });
  });

  describe("lenses", () => {
    describe("addLens", () => {
      it("creates a lens and updates state", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addLens("Summicron 50mm f/2");

        const { lenses } = useGearStore.getState();
        expect(lenses).toHaveLength(1);
        expect(lenses[0].name).toBe("Summicron 50mm f/2");
      });

      it("throws DuplicateNameError for duplicate name", async () => {
        const { useGearStore, DuplicateNameError } =
          await import("./gearStore");

        await useGearStore.getState().addLens("Summicron 50mm f/2");

        await expect(
          useGearStore.getState().addLens("Summicron 50mm f/2"),
        ).rejects.toThrow(DuplicateNameError);
      });
    });

    describe("updateLens", () => {
      it("updates lens name", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addLens("Summicron 50mm f/2");
        await useGearStore
          .getState()
          .updateLens("test-id-1", "Summilux 50mm f/1.4");

        const { lenses } = useGearStore.getState();
        expect(lenses[0].name).toBe("Summilux 50mm f/1.4");
      });
    });

    describe("deleteLens", () => {
      it("removes lens from database and state", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addLens("Summicron 50mm f/2");
        await useGearStore.getState().deleteLens("test-id-1");

        const { lenses } = useGearStore.getState();
        expect(lenses).toHaveLength(0);
      });
    });

    describe("getLensById", () => {
      it("finds lens by id", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addLens("Summicron 50mm f/2");

        const lens = useGearStore.getState().getLensById("test-id-1");
        expect(lens).toBeDefined();
        expect(lens?.name).toBe("Summicron 50mm f/2");
      });
    });
  });

  describe("filmStocks", () => {
    describe("addFilmStock", () => {
      it("creates a film stock and updates state", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addFilmStock("Kodak Portra 400");

        const { filmStocks } = useGearStore.getState();
        expect(filmStocks).toHaveLength(1);
        expect(filmStocks[0].name).toBe("Kodak Portra 400");
      });

      it("throws DuplicateNameError for duplicate name", async () => {
        const { useGearStore, DuplicateNameError } =
          await import("./gearStore");

        await useGearStore.getState().addFilmStock("Kodak Portra 400");

        await expect(
          useGearStore.getState().addFilmStock("Kodak Portra 400"),
        ).rejects.toThrow(DuplicateNameError);
      });
    });

    describe("updateFilmStock", () => {
      it("updates film stock name", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addFilmStock("Kodak Portra 400");
        await useGearStore
          .getState()
          .updateFilmStock("test-id-1", "Kodak Portra 800");

        const { filmStocks } = useGearStore.getState();
        expect(filmStocks[0].name).toBe("Kodak Portra 800");
      });
    });

    describe("deleteFilmStock", () => {
      it("removes film stock from database and state", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addFilmStock("Kodak Portra 400");
        await useGearStore.getState().deleteFilmStock("test-id-1");

        const { filmStocks } = useGearStore.getState();
        expect(filmStocks).toHaveLength(0);
      });
    });

    describe("getFilmStockById", () => {
      it("finds film stock by id", async () => {
        const { useGearStore } = await import("./gearStore");

        await useGearStore.getState().addFilmStock("Kodak Portra 400");

        const filmStock = useGearStore.getState().getFilmStockById("test-id-1");
        expect(filmStock).toBeDefined();
        expect(filmStock?.name).toBe("Kodak Portra 400");
      });
    });
  });

  describe("error handling", () => {
    it("sets error state when database query fails", async () => {
      testState.db?.close();

      const { useGearStore } = await import("./gearStore");

      await useGearStore.getState().loadGear();

      expect(useGearStore.getState().error).toBeInstanceOf(Error);
      expect(useGearStore.getState().isLoading).toBe(false);
    });
  });

  describe("loading state", () => {
    it("sets isLoading during loadGear", async () => {
      const { useGearStore } = await import("./gearStore");

      const loadPromise = useGearStore.getState().loadGear();

      expect(useGearStore.getState().isLoading).toBe(true);

      await loadPromise;

      expect(useGearStore.getState().isLoading).toBe(false);
    });
  });
});
