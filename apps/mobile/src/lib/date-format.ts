export function formatRelativeDate(
  date: Date,
  prefix: "Loaded" | "Finished",
): string {
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${prefix} ${formatted}`;
}
