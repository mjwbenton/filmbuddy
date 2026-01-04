import { describe, it, expect } from "vitest";
import {
  nearestStandardStop,
  generateApertureSequence,
  formatAperture,
  parseAperture,
  isValidApertureRange,
  getAllApertureOptions,
  APERTURE_STOPS,
  APERTURE_BOUNDS,
  DEFAULT_APERTURES,
} from "./aperture";

describe("nearestStandardStop", () => {
  it("returns exact match for standard whole stop", () => {
    expect(nearestStandardStop(2.8, "whole")).toBe(2.8);
    expect(nearestStandardStop(4, "whole")).toBe(4);
    expect(nearestStandardStop(8, "whole")).toBe(8);
  });

  it("returns nearest whole stop for non-standard value", () => {
    expect(nearestStandardStop(1.5, "whole")).toBe(1.4);
    expect(nearestStandardStop(3, "whole")).toBe(2.8);
    expect(nearestStandardStop(6, "whole")).toBe(5.6);
  });

  it("returns exact match for standard half stop", () => {
    expect(nearestStandardStop(3.5, "half")).toBe(3.5);
    expect(nearestStandardStop(4.5, "half")).toBe(4.5);
  });

  it("returns nearest half stop for non-standard value", () => {
    expect(nearestStandardStop(1.5, "half")).toBe(1.4);
    expect(nearestStandardStop(3.7, "half")).toBe(3.5);
    expect(nearestStandardStop(3.8, "half")).toBe(4); // 3.8 is closer to 4 than 3.5
  });

  it("returns nearest third stop", () => {
    expect(nearestStandardStop(3.2, "third")).toBe(3.2);
    expect(nearestStandardStop(3.3, "third")).toBe(3.2);
  });
});

describe("generateApertureSequence", () => {
  it("generates whole stop sequence", () => {
    const result = generateApertureSequence(2.8, 16, "whole");
    expect(result).toEqual([2.8, 4, 5.6, 8, 11, 16]);
  });

  it("generates half stop sequence", () => {
    const result = generateApertureSequence(2.8, 8, "half");
    expect(result).toEqual([2.8, 3.5, 4, 4.5, 5.6, 6.7, 8]);
  });

  it("generates third stop sequence", () => {
    const result = generateApertureSequence(2.8, 4, "third");
    expect(result).toEqual([2.8, 3.2, 3.5, 4]);
  });

  it("handles non-standard max aperture", () => {
    const result = generateApertureSequence(1.5, 16, "half");
    // Should start with exact 1.5, then continue from nearest standard (1.4 -> next is 1.7)
    expect(result[0]).toBe(1.5);
    expect(result).toContain(2);
    expect(result).toContain(2.8);
    expect(result).toContain(16);
  });

  it("preserves non-standard max and skips near-duplicate", () => {
    const result = generateApertureSequence(1.5, 4, "half");
    // Should have 1.5 exactly once at the start
    expect(result.filter((v) => v === 1.5)).toHaveLength(1);
    expect(result[0]).toBe(1.5);
  });

  it("returns empty array when min is wider than max", () => {
    expect(generateApertureSequence(4, 2, "whole")).toEqual([]);
  });

  it("returns empty array when min equals max", () => {
    expect(generateApertureSequence(4, 4, "whole")).toEqual([]);
  });

  it("handles boundary values", () => {
    const result = generateApertureSequence(0.5, 64, "whole");
    expect(result[0]).toBe(0.5);
    expect(result[result.length - 1]).toBe(64);
  });
});

describe("formatAperture", () => {
  it("formats whole numbers without decimal", () => {
    expect(formatAperture(2)).toBe("f/2");
    expect(formatAperture(4)).toBe("f/4");
    expect(formatAperture(8)).toBe("f/8");
    expect(formatAperture(16)).toBe("f/16");
  });

  it("formats decimals with one place", () => {
    expect(formatAperture(1.4)).toBe("f/1.4");
    expect(formatAperture(2.8)).toBe("f/2.8");
    expect(formatAperture(5.6)).toBe("f/5.6");
  });

  it("formats sub-1 values", () => {
    expect(formatAperture(0.5)).toBe("f/0.5");
    expect(formatAperture(0.7)).toBe("f/0.7");
  });
});

describe("parseAperture", () => {
  it("parses f/ prefixed strings", () => {
    expect(parseAperture("f/2.8")).toBe(2.8);
    expect(parseAperture("f/4")).toBe(4);
    expect(parseAperture("f/16")).toBe(16);
  });

  it("parses plain number strings", () => {
    expect(parseAperture("2.8")).toBe(2.8);
    expect(parseAperture("4")).toBe(4);
  });

  it("handles whitespace", () => {
    expect(parseAperture("  f/2.8  ")).toBe(2.8);
    expect(parseAperture("f/ 2.8")).toBe(2.8);
  });

  it("returns null for invalid input", () => {
    expect(parseAperture("")).toBe(null);
    expect(parseAperture("f/")).toBe(null);
    expect(parseAperture("abc")).toBe(null);
    expect(parseAperture("f/0")).toBe(null);
    expect(parseAperture("f/-1")).toBe(null);
  });
});

describe("isValidApertureRange", () => {
  it("returns true for valid range", () => {
    expect(isValidApertureRange(2.8, 16)).toBe(true);
    expect(isValidApertureRange(1.4, 22)).toBe(true);
    expect(isValidApertureRange(0.5, 64)).toBe(true);
  });

  it("returns false when min is wider than max", () => {
    expect(isValidApertureRange(16, 2.8)).toBe(false);
    expect(isValidApertureRange(4, 2)).toBe(false);
  });

  it("returns false when min equals max", () => {
    expect(isValidApertureRange(4, 4)).toBe(false);
  });
});

describe("getAllApertureOptions", () => {
  it("returns sorted unique values", () => {
    const options = getAllApertureOptions();
    expect(options[0]).toBe(APERTURE_BOUNDS.min);
    expect(options[options.length - 1]).toBe(APERTURE_BOUNDS.max);

    // Check sorted
    options.slice(1).forEach((val, idx) => {
      expect(val).toBeGreaterThan(options[idx]);
    });
  });

  it("includes all whole stops", () => {
    const options = getAllApertureOptions();
    APERTURE_STOPS.whole.forEach((stop) => {
      expect(options).toContain(stop);
    });
  });
});

describe("DEFAULT_APERTURES", () => {
  it("is a valid non-empty array of numbers", () => {
    expect(Array.isArray(DEFAULT_APERTURES)).toBe(true);
    expect(DEFAULT_APERTURES.length).toBeGreaterThan(0);
    DEFAULT_APERTURES.forEach((val) => {
      expect(typeof val).toBe("number");
    });
  });
});
