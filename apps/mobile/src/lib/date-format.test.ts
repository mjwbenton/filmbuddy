import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatRelativeDate } from "./date-format";

describe("formatRelativeDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-11-30"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats date as 'Loaded Nov 28' style", () => {
    const date = new Date("2024-11-28");
    expect(formatRelativeDate(date, "Loaded")).toBe("Loaded Nov 28");
  });

  it("formats finished date", () => {
    const date = new Date("2024-11-25");
    expect(formatRelativeDate(date, "Finished")).toBe("Finished Nov 25");
  });

  it("handles different months", () => {
    const date = new Date("2024-10-15");
    expect(formatRelativeDate(date, "Loaded")).toBe("Loaded Oct 15");
  });

  it("handles single-digit days", () => {
    const date = new Date("2024-11-05");
    expect(formatRelativeDate(date, "Loaded")).toBe("Loaded Nov 5");
  });
});
