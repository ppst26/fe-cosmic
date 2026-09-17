/** ข้อมูล mock หน้าเช็คอินรายวัน */

export type DailyCheckInDayStatus = "claimed" | "today" | "locked";

export interface DailyCheckInDayReward {
  day: number;
  credits: number;
  status: DailyCheckInDayStatus;
}

export const DAILY_CHECKIN_TERMS: string[] = [
  "เช็คอิน 1 ครั้งต่อวันตามเวลาระบบ (00:00–23:59)",
  "พลาดวันใดวันหนึ่งอาจรีเซ็ตสตรีคหรือเริ่มรอบใหม่ตามเงื่อนไข",
  "รางวัลวันที่ 7 จะปลดล็อกเมื่อเช็คอินครบ 6 วันก่อนหน้า",
  "ข้อมูลและรางวัลในหน้านี้เป็นตัวอย่างสำหรับการออกแบบ",
];

export const DAILY_CHECKIN_INITIAL: DailyCheckInDayReward[] = [
  { day: 1, credits: 5, status: "claimed" },
  { day: 2, credits: 5, status: "claimed" },
  { day: 3, credits: 15, status: "today" },
  { day: 4, credits: 10, status: "locked" },
  { day: 5, credits: 15, status: "locked" },
  { day: 6, credits: 20, status: "locked" },
  { day: 7, credits: 50, status: "locked" },
];

export function formatCheckInCredits(value: number): string {
  return `${new Intl.NumberFormat("th-TH").format(value)} เครดิต`;
}

export function countCheckedInDays(days: DailyCheckInDayReward[]): number {
  return days.filter((d) => d.status === "claimed").length;
}

export function getTodayReward(days: DailyCheckInDayReward[]): DailyCheckInDayReward | undefined {
  return days.find((d) => d.status === "today");
}
