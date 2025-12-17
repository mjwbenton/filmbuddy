import { describe, it, expect } from "vitest";
import { rollFormSchema } from "./roll";

describe("rollFormSchema", () => {
  describe("valid data", () => {
    it("passes when all fields are filled", () => {
      const data = {
        filmStock: "Portra 400",
        iso: 400,
        camera: "Leica M6",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it.each([25, 50, 80, 100, 160, 200, 400, 800, 1600, 3200])(
      "passes with ISO %i",
      (iso) => {
        const data = {
          filmStock: "Test Film",
          iso,
          camera: "Test Camera",
        };
        const result = rollFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      },
    );

    it("trims whitespace from filmStock", () => {
      const data = {
        filmStock: "  Portra 400  ",
        iso: 400,
        camera: "Leica M6",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.filmStock).toBe("Portra 400");
      }
    });
  });

  describe("filmStock validation", () => {
    it("fails when filmStock is empty", () => {
      const data = {
        filmStock: "",
        iso: 400,
        camera: "Leica M6",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const filmStockError = result.error.issues.find(
          (i) => i.path[0] === "filmStock",
        );
        expect(filmStockError?.message).toBe("Film stock is required");
      }
    });

    it("fails when filmStock is only whitespace", () => {
      const data = {
        filmStock: "   ",
        iso: 400,
        camera: "Leica M6",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("iso validation", () => {
    it("fails when iso is an invalid value", () => {
      const data = {
        filmStock: "Portra 400",
        iso: 999,
        camera: "Leica M6",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("camera validation", () => {
    it("fails when camera is empty", () => {
      const data = {
        filmStock: "Portra 400",
        iso: 400,
        camera: "",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        const cameraError = result.error.issues.find(
          (i) => i.path[0] === "camera",
        );
        expect(cameraError?.message).toBe("Camera is required");
      }
    });

    it("fails when camera is only whitespace", () => {
      const data = {
        filmStock: "Portra 400",
        iso: 400,
        camera: "   ",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("multiple errors", () => {
    it("returns multiple errors when multiple fields are invalid", () => {
      const data = {
        filmStock: "",
        iso: 999,
        camera: "",
      };
      const result = rollFormSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });
  });
});
