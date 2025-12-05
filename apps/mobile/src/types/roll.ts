export const ISO_VALUES = [
  25, 50, 80, 100, 160, 200, 400, 800, 1600, 3200,
] as const;
export type ISOValue = (typeof ISO_VALUES)[number];
