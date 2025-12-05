const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatRelativeDate(
  date: Date,
  prefix: "Loaded" | "Finished",
): string {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  return `${prefix} ${month} ${day}`;
}
