/**
 * class แถวตาราง zebra — คู่กับ .cosmic-data-table
 */
export function cosmicDataTableRowClass(index: number): string {
  return index % 2 === 1
    ? "cosmic-data-table__row--alt border-0 hover:bg-[var(--inner-card-fill-hover)]"
    : "border-0 hover:bg-[var(--inner-card-fill-hover)]";
}
