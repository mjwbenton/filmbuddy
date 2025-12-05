import { describe, it, expect } from "vitest";
import {
  isValidRoll,
  getValidationErrors,
  RollFormData,
} from "./roll-validation";

describe("isValidRoll", () => {
  it("returns true when all fields are filled", () => {
    const data: RollFormData = {
      filmStock: "Portra 400",
      iso: 400,
      camera: "Leica M6",
    };
    expect(isValidRoll(data)).toBe(true);
  });

  it("returns false when filmStock is empty", () => {
    const data: RollFormData = {
      filmStock: "",
      iso: 400,
      camera: "Leica M6",
    };
    expect(isValidRoll(data)).toBe(false);
  });

  it("returns false when filmStock is only whitespace", () => {
    const data: RollFormData = {
      filmStock: "   ",
      iso: 400,
      camera: "Leica M6",
    };
    expect(isValidRoll(data)).toBe(false);
  });

  it("returns false when iso is null", () => {
    const data: RollFormData = {
      filmStock: "Portra 400",
      iso: null,
      camera: "Leica M6",
    };
    expect(isValidRoll(data)).toBe(false);
  });

  it("returns false when camera is empty", () => {
    const data: RollFormData = {
      filmStock: "Portra 400",
      iso: 400,
      camera: "",
    };
    expect(isValidRoll(data)).toBe(false);
  });

  it("returns false when camera is only whitespace", () => {
    const data: RollFormData = {
      filmStock: "Portra 400",
      iso: 400,
      camera: "   ",
    };
    expect(isValidRoll(data)).toBe(false);
  });
});

describe("getValidationErrors", () => {
  it("returns empty object when all fields are valid", () => {
    const data: RollFormData = {
      filmStock: "Portra 400",
      iso: 400,
      camera: "Leica M6",
    };
    expect(getValidationErrors(data)).toEqual({});
  });

  it("returns error for empty filmStock", () => {
    const data: RollFormData = {
      filmStock: "",
      iso: 400,
      camera: "Leica M6",
    };
    const errors = getValidationErrors(data);
    expect(errors.filmStock).toBe("Film stock is required");
  });

  it("returns error for null iso", () => {
    const data: RollFormData = {
      filmStock: "Portra 400",
      iso: null,
      camera: "Leica M6",
    };
    const errors = getValidationErrors(data);
    expect(errors.iso).toBe("ISO is required");
  });

  it("returns error for empty camera", () => {
    const data: RollFormData = {
      filmStock: "Portra 400",
      iso: 400,
      camera: "",
    };
    const errors = getValidationErrors(data);
    expect(errors.camera).toBe("Camera is required");
  });

  it("returns multiple errors when multiple fields are invalid", () => {
    const data: RollFormData = {
      filmStock: "",
      iso: null,
      camera: "",
    };
    const errors = getValidationErrors(data);
    expect(errors.filmStock).toBeDefined();
    expect(errors.iso).toBeDefined();
    expect(errors.camera).toBeDefined();
  });
});
