/**
 * Aperture calculation utilities for lens configuration.
 *
 * F-stop values follow a geometric progression where each full stop
 * represents a doubling/halving of light. The sequence is based on
 * powers of sqrt(2) ≈ 1.414.
 */

export type StopIncrement = "whole" | "half" | "third";

/** Default aperture set for new lenses (empty - user must configure) */
export const DEFAULT_APERTURES: number[] = [];

/** Bounds for aperture selection */
export const APERTURE_BOUNDS = {
  min: 0.5, // Widest (smallest f-number)
  max: 64, // Narrowest (largest f-number)
} as const;

/** Epsilon for comparing aperture values (handles floating point imprecision) */
const APERTURE_EPSILON = 0.01;

/**
 * Check if an aperture value is a whole stop.
 */
export function isWholeStop(aperture: number): boolean {
  return APERTURE_STOPS.whole.some(
    (stop) => Math.abs(stop - aperture) < APERTURE_EPSILON,
  );
}

/**
 * Standard f-stop values at different increments.
 * Values are the f-numbers (denominator in f/X notation).
 */
export const APERTURE_STOPS: Record<
  StopIncrement | "nonStandard",
  readonly number[]
> = {
  whole: [0.5, 0.7, 1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, 45, 64] as const,
  half: [
    0.5, 0.6, 0.7, 0.8, 1, 1.2, 1.4, 1.7, 2, 2.4, 2.8, 3.5, 4, 4.5, 5.6, 6.7, 8,
    9.5, 11, 13, 16, 19, 22, 27, 32, 38, 45, 54, 64,
  ] as const,
  third: [
    0.5, 0.56, 0.63, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5,
    2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20,
    22, 25, 29, 32, 36, 40, 45, 51, 57, 64,
  ] as const,
  nonStandard: [1.5] as const,
} as const;

/**
 * Find the nearest standard f-stop to a given aperture value.
 *
 * @param aperture - The aperture value to match
 * @param increment - The stop increment to use
 * @returns The nearest standard f-stop value
 */
export function nearestStandardStop(
  aperture: number,
  increment: StopIncrement,
): number {
  const stops = APERTURE_STOPS[increment];
  return stops.reduce((nearest, stop) =>
    Math.abs(aperture - stop) < Math.abs(aperture - nearest) ? stop : nearest,
  );
}

/**
 * Generate a sequence of aperture values from max (widest) to min (narrowest).
 *
 * For non-standard max apertures (like f/1.5), the sequence starts with the
 * exact max value, then continues from the nearest standard stop.
 *
 * @param maxAperture - Maximum aperture (widest, smallest f-number)
 * @param minAperture - Minimum aperture (narrowest, largest f-number)
 * @param increment - Stop increment (whole, half, or third)
 * @returns Array of aperture values from widest to narrowest
 */
export function generateApertureSequence(
  maxAperture: number,
  minAperture: number,
  increment: StopIncrement,
): number[] {
  if (maxAperture >= minAperture) {
    return [];
  }

  const stops = APERTURE_STOPS[increment];
  const result: number[] = [];

  // Check if max aperture is a standard stop
  const nearestMax = nearestStandardStop(maxAperture, increment);
  const isStandardMax = Math.abs(maxAperture - nearestMax) < APERTURE_EPSILON;

  if (!isStandardMax) {
    // Non-standard max: include exact value first
    result.push(maxAperture);
  }

  // Find starting index in standard stops
  const startStop = isStandardMax ? maxAperture : nearestMax;
  const baseIndex = stops.findIndex(
    (s) => Math.abs(s - startStop) < APERTURE_EPSILON,
  );
  // If the nearest standard stop is wider than our max, start from next
  const startIndex =
    !isStandardMax && nearestMax < maxAperture ? baseIndex + 1 : baseIndex;

  // Add standard stops from start to min
  const standardStops = stops
    .slice(startIndex)
    .filter((stop) => stop <= minAperture)
    .filter((stop, idx) => {
      // Skip if this is essentially the same as our non-standard max
      // Use larger threshold (0.1) here to avoid near-duplicates like f/1.5 and f/1.4
      if (!isStandardMax && idx === 0 && Math.abs(stop - maxAperture) < 0.1) {
        return false;
      }
      return true;
    });

  return [...result, ...standardStops];
}

/**
 * Format a numeric aperture value as an f-stop string.
 *
 * @param value - Numeric aperture value
 * @returns Formatted string like "f/2.8"
 */
export function formatAperture(value: number): string {
  // Use one decimal place for values that need it, none for whole numbers
  const formatted = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
  // Remove trailing .0
  const cleaned = formatted.replace(/\.0$/, "");
  return `f/${cleaned}`;
}

/**
 * Parse an f-stop string to a numeric value.
 *
 * @param str - String like "f/2.8" or "2.8"
 * @returns Numeric aperture value, or null if invalid
 */
export function parseAperture(str: string): number | null {
  const trimmed = str.trim();
  const cleaned = trimmed.replace(/^f\/\s*/, "");
  const value = parseFloat(cleaned);
  if (isNaN(value) || value <= 0) {
    return null;
  }
  return value;
}

/**
 * Validate that min aperture is narrower than max aperture.
 * In f-stop terms, min should be a larger number than max.
 *
 * @param maxAperture - Maximum aperture (widest)
 * @param minAperture - Minimum aperture (narrowest)
 * @returns true if valid, false if min is wider than max
 */
export function isValidApertureRange(
  maxAperture: number,
  minAperture: number,
): boolean {
  return maxAperture < minAperture;
}

/**
 * Get all available aperture options for a picker, within bounds.
 * Combines all three increment scales for maximum flexibility.
 * Results are memoized for performance.
 */
export const getAllApertureOptions = (() => {
  const cache: { value: number[] | null } = { value: null };
  return (): number[] => {
    if (cache.value) return cache.value;

    const allValues = new Set<number>(
      Object.values(APERTURE_STOPS)
        .flatMap((stops) => [...stops])
        .filter(
          (stop) => stop >= APERTURE_BOUNDS.min && stop <= APERTURE_BOUNDS.max,
        ),
    );

    cache.value = Array.from(allValues).sort((a, b) => a - b);
    return cache.value;
  };
})();
