/** ข้อมูล mock หน้าวงล้อจักรวาล (/wheel) */

export type WheelPrizeKind = "credit" | "gems";

export interface WheelSegment {
  id: string;
  label: string;
  kind: WheelPrizeKind;
}

export interface WheelHistoryEntry {
  id: string;
  label: string;
  kind: WheelPrizeKind;
  timeLabel: string;
}

export const LUCKY_WHEEL_INITIAL_SPINS = 3;

export const LUCKY_WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "w1", label: "5 เครดิต", kind: "credit" },
  { id: "w2", label: "10 เครดิต", kind: "credit" },
  { id: "w3", label: "20 เครดิต", kind: "credit" },
  { id: "w4", label: "50 เครดิต", kind: "credit" },
  { id: "w5", label: "100 เครดิต", kind: "credit" },
  { id: "w6", label: "50 Gems", kind: "gems" },
  { id: "w7", label: "100 Gems", kind: "gems" },
  { id: "w8", label: "200 Gems", kind: "gems" },
];

export const LUCKY_WHEEL_HISTORY: WheelHistoryEntry[] = [
  { id: "h1", label: "10 เครดิต", kind: "credit", timeLabel: "วันนี้ · 14:30" },
  { id: "h2", label: "50 Gems", kind: "gems", timeLabel: "12 ก.ย. · 09:15" },
];

export const LUCKY_WHEEL_TERMS: string[] = [
  "ใช้ 1 สิทธิ์ต่อการหมุน 1 ครั้ง",
  "รางวัลเครดิตและ Gems เป็นตัวอย่าง — ยอดจริงขึ้นกับระบบหลังบ้าน",
  "สิทธิ์หมุนอาจรีเซ็ตหรือเพิ่มตามเงื่อนไขโปรโมชัน",
  "ทีมงานขอสงวนสิทธิ์ในการเปลี่ยนแปลงรางวัลและกติกาโดยไม่แจ้งล่วงหน้า",
];
