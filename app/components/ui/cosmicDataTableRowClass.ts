/**
 * class แถวตาราง zebra — คู่กับ .cosmic-data-table
 */
export function cosmicDataTableRowClass(
  index: number,
  variant: "solid" | "outline" = "solid",
): string {
  if (variant === "outline") {
    return index % 2 === 1
      ? "cosmic-data-table__row--alt border-0"
      : "border-0";
  }

  return index % 2 === 1
    ? "cosmic-data-table__row--alt border-0 hover:bg-[var(--inner-card-fill-hover)]"
    : "border-0 hover:bg-[var(--inner-card-fill-hover)]";
}
