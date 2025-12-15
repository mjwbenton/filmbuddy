import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createTestDb, type TestDbContext } from "@/test/db";

// Track test state
let testDb: TestDbContext;
let idCounter = 0;

// Mock expo-crypto
vi.mock("expo-crypto", () => ({
  randomUUID: () => `test-id-${++idCounter}`,
}));

// Mock @/db to use test database
vi.mock("@/db", () => ({
  get db() {
    return testDb.db;
  },
}));

describe("rollStore", () => {
  beforeEach(async () => {
    // Reset state for each test
    testDb = createTestDb();
    idCounter = 0;

    // Clear module cache to get fresh store instance
    vi.resetModules();
  });

  afterEach(() => {
    testDb.close();
  });

  describe("loadRolls", () => {
    it("loads empty lists from empty database", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().loadRolls();

      expect(useRollStore.getState().activeRolls).toEqual([]);
      expect(useRollStore.getState().finishedRolls).toEqual([]);
      expect(useRollStore.getState().isLoading).toBe(false);
    });

    it("separates active and finished rolls", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Portra 400",
        iso: 400,
        camera: "Leica M6",
      });
      await useRollStore.getState().addRoll({
        filmStock: "HP5",
        iso: 400,
        camera: "Canon AE-1",
      });
      await useRollStore.getState().markFinished("test-id-1");

      const { activeRolls, finishedRolls } = useRollStore.getState();
      expect(activeRolls).toHaveLength(1);
      expect(activeRolls[0].filmStock).toBe("HP5");
      expect(finishedRolls).toHaveLength(1);
      expect(finishedRolls[0].filmStock).toBe("Portra 400");
    });
  });

  describe("addRoll", () => {
    it("creates a roll and updates activeRolls", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Portra 400",
        iso: 400,
        camera: "Leica M6",
      });

      const { activeRolls } = useRollStore.getState();
      expect(activeRolls).toHaveLength(1);
      expect(activeRolls[0].filmStock).toBe("Portra 400");
      expect(activeRolls[0].iso).toBe(400);
      expect(activeRolls[0].camera).toBe("Leica M6");
      expect(activeRolls[0].id).toBe("test-id-1");
      expect(activeRolls[0].loadedAt).toBeInstanceOf(Date);
      expect(activeRolls[0].finishedAt).toBeNull();
    });

    it("generates unique IDs for each roll", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Portra 400",
        iso: 400,
        camera: "Leica M6",
      });
      await useRollStore.getState().addRoll({
        filmStock: "HP5",
        iso: 400,
        camera: "Canon AE-1",
      });

      const { activeRolls } = useRollStore.getState();
      const ids = activeRolls.map((r) => r.id);
      expect(ids).toContain("test-id-1");
      expect(ids).toContain("test-id-2");
      expect(new Set(ids).size).toBe(2);
    });
  });

  describe("updateRoll", () => {
    it("updates roll properties", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Portra 400",
        iso: 400,
        camera: "Leica M6",
      });
      await useRollStore.getState().updateRoll("test-id-1", {
        filmStock: "Portra 800",
        iso: 800,
      });

      const { activeRolls } = useRollStore.getState();
      expect(activeRolls[0].filmStock).toBe("Portra 800");
      expect(activeRolls[0].iso).toBe(800);
      expect(activeRolls[0].camera).toBe("Leica M6");
    });
  });

  describe("markFinished", () => {
    it("moves roll from active to finished with timestamp", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "HP5",
        iso: 400,
        camera: "Canon AE-1",
      });

      await useRollStore.getState().markFinished("test-id-1");

      const { activeRolls, finishedRolls } = useRollStore.getState();
      expect(activeRolls).toHaveLength(0);
      expect(finishedRolls).toHaveLength(1);
      expect(finishedRolls[0].finishedAt).toBeInstanceOf(Date);
    });
  });

  describe("markActive", () => {
    it("moves roll from finished back to active", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Ektar 100",
        iso: 100,
        camera: "Nikon F3",
      });
      await useRollStore.getState().markFinished("test-id-1");
      await useRollStore.getState().markActive("test-id-1");

      const { activeRolls, finishedRolls } = useRollStore.getState();
      expect(activeRolls).toHaveLength(1);
      expect(finishedRolls).toHaveLength(0);
      expect(activeRolls[0].finishedAt).toBeNull();
    });
  });

  describe("deleteRoll", () => {
    it("removes roll from database and state", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Ektar 100",
        iso: 100,
        camera: "Nikon F3",
      });

      await useRollStore.getState().deleteRoll("test-id-1");

      const { activeRolls, finishedRolls } = useRollStore.getState();
      expect(activeRolls).toHaveLength(0);
      expect(finishedRolls).toHaveLength(0);
    });

    it("removes finished roll", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Tri-X 400",
        iso: 400,
        camera: "Hasselblad 500",
      });
      await useRollStore.getState().markFinished("test-id-1");
      await useRollStore.getState().deleteRoll("test-id-1");

      const { activeRolls, finishedRolls } = useRollStore.getState();
      expect(activeRolls).toHaveLength(0);
      expect(finishedRolls).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("sets error state when database query fails", async () => {
      // Close the database to force an error
      testDb.close();

      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().loadRolls();

      expect(useRollStore.getState().error).toBeInstanceOf(Error);
      expect(useRollStore.getState().isLoading).toBe(false);
    });
  });

  describe("loading state", () => {
    it("sets isLoading during loadRolls", async () => {
      const { useRollStore } = await import("./rollStore");

      // Start loading but don't await
      const loadPromise = useRollStore.getState().loadRolls();

      // Check loading state is true during operation
      expect(useRollStore.getState().isLoading).toBe(true);

      await loadPromise;

      // Check loading state is false after completion
      expect(useRollStore.getState().isLoading).toBe(false);
    });
  });

  describe("getRollById", () => {
    it("finds roll in activeRolls", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "Portra 400",
        iso: 400,
        camera: "Leica M6",
      });

      const roll = useRollStore.getState().getRollById("test-id-1");
      expect(roll).toBeDefined();
      expect(roll?.filmStock).toBe("Portra 400");
    });

    it("finds roll in finishedRolls", async () => {
      const { useRollStore } = await import("./rollStore");

      await useRollStore.getState().addRoll({
        filmStock: "HP5",
        iso: 400,
        camera: "Canon AE-1",
      });
      await useRollStore.getState().markFinished("test-id-1");

      const roll = useRollStore.getState().getRollById("test-id-1");
      expect(roll).toBeDefined();
      expect(roll?.filmStock).toBe("HP5");
    });

    it("returns undefined for non-existent roll", async () => {
      const { useRollStore } = await import("./rollStore");

      const roll = useRollStore.getState().getRollById("non-existent");
      expect(roll).toBeUndefined();
    });
  });
});
