/** ข้อมูล mock หน้าเช็คอินรายวัน (ธีมเพชรและทองคำหรูหรา) */

import type { DailyCheckInDayReward, CumulativeCheckInMilestone } from "@/app/types/checkIn";

export const CUMULATIVE_CHECKIN_MILESTONES: CumulativeCheckInMilestone[] = [
  { milestoneDay: 7, gemsReward: 20, isUnlocked: true },
  { milestoneDay: 14, gemsReward: 30, isUnlocked: false },
  { milestoneDay: 21, gemsReward: 40, isUnlocked: false },
  { milestoneDay: 28, gemsReward: 70, isUnlocked: false },
];

export const DAILY_CHECKIN_TERMS: string[] = [
  "เช็คอิน 1 ครั้งต่อวันตามเวลาระบบ (00:00–23:59)",
  "พลาดวันใดวันหนึ่งอาจรีเซ็ตสตรีคหรือเริ่มรอบใหม่ตามเงื่อนไข",
  "รางวัลวันที่ 7 จะปลดล็อกเมื่อเช็คอินครบ 6 วันก่อนหน้า",
  "ข้อมูลและรางวัลในหน้านี้เป็นตัวอย่างสำหรับการออกแบบ",
];

export const DAILY_CHECKIN_INITIAL: DailyCheckInDayReward[] = [
  { day: 1, label: "จ.", credits: 5, status: "claimed" },
  { day: 2, label: "อ.", credits: 5, status: "today" },
  { day: 3, label: "พ.", credits: 5, status: "locked" },
  { day: 4, label: "พฤ.", credits: 5, status: "locked" },
  { day: 5, label: "ศ.", credits: 5, status: "locked" },
  { day: 6, label: "ส.", credits: 5, status: "locked" },
  { day: 7, label: "อา.", credits: 20, status: "locked", isBigReward: true },
];

