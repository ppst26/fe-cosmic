/** ช่วงวันที่สำหรับกรองรายการธุรกรรม */

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** ค่าเริ่มต้น — 45 วันที่ผ่านมาถึงวันนี้ */
export function getDefaultTransactionDateRange(): { from: Date; to: Date } {
  const to = startOfDay(new Date());
  const from = new Date(to);
  from.setDate(from.getDate() - 44);
  return { from, to };
}

export function formatTransactionDateShort(date: Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatTransactionDateRangeLabel(from: Date, to: Date): string {
  return `${formatTransactionDateShort(from)} - ${formatTransactionDateShort(to)}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isDateInRange(date: Date, from: Date, to: Date): boolean {
  const t = date.getTime();
  return t >= startOfDay(from).getTime() && t <= endOfDay(to).getTime();
}

/** วันในเดือนที่แสดงในปฏิทิน (รวม padding สัปดาห์) */
export function getCalendarMonthCells(viewMonth: Date): { date: Date; inMonth: boolean }[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const cells: { date: Date; inMonth: boolean }[] = [];
  const start = new Date(year, month, 1 - startOffset);

  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    cells.push({ date, inMonth: date.getMonth() === month });
  }

  return cells;
}

export const THAI_WEEKDAY_SHORT = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"] as const;

export const THAI_MONTH_OPTIONS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
] as const;
