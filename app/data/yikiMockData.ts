import type {
  YikiBetType,
  YikiDigitGroup,
  YikiRound,
  YikiSettlementType,
  YikiSettlementTypeId,
} from "@/app/types/yiki";

/** แท็บกลุ่มจำนวนหลัก — ตามที่ผู้ใช้ระบุ ไม่มี "อื่นๆ" */
export const YIKI_GROUPS: { id: YikiDigitGroup; label: string }[] = [
  { id: "three", label: "3 ตัว" },
  { id: "two", label: "2 ตัว" },
  { id: "run", label: "วิ่ง" },
];

/** ผลการจ่ายจริง — ใช้จัดกลุ่มหัวข้อในโพยและคำนวณเงินรางวัล (mock — รอค่าจริงจาก API) */
export const YIKI_SETTLEMENT_TYPES: Record<YikiSettlementTypeId, YikiSettlementType> = {
  three_top: { id: "three_top", label: "3 ตัวบน", payoutRate: 1000 },
  three_top_tod: { id: "three_top_tod", label: "3 ตัวบนโต๊ด", payoutRate: 150 },
  two_top: { id: "two_top", label: "2 ตัวบน", payoutRate: 90 },
  two_bottom: { id: "two_bottom", label: "2 ตัวล่าง", payoutRate: 90 },
  run_top: { id: "run_top", label: "วิ่งบน", payoutRate: 3.2 },
  run_bottom: { id: "run_bottom", label: "วิ่งล่าง", payoutRate: 4.2 },
};

/**
 * ปุ่มเลือกประเภทการแทง — เลือกได้ทีละปุ่มต่อกลุ่ม (single-select ต่างจากหวยรัฐบาลไทยที่เลือกได้หลายปุ่ม)
 * ปุ่ม "กลับ" และปุ่มรวม (+ โต๊ด, บน/ล่าง) ยุบตัวเลือกเดิม (กลับเลข/หลายประเภทพร้อมกัน) ไว้ในปุ่มเดียวตามดีไซน์อ้างอิง
 */
export const YIKI_BET_TYPES: YikiBetType[] = [
  { id: "three_top", label: "3 ตัวบน", group: "three", digits: 3, settlementTypeIds: ["three_top"] },
  {
    id: "three_top_reverse",
    label: "3 ตัวบนกลับ",
    group: "three",
    digits: 3,
    settlementTypeIds: ["three_top"],
    reverse: true,
  },
  { id: "three_top_tod", label: "3 ตัวบนโต๊ด", group: "three", digits: 3, settlementTypeIds: ["three_top_tod"] },
  {
    id: "three_top_combo_tod",
    label: "3 ตัวบน + โต๊ด",
    group: "three",
    digits: 3,
    settlementTypeIds: ["three_top", "three_top_tod"],
  },
  { id: "two_top", label: "2 ตัวบน", group: "two", digits: 2, settlementTypeIds: ["two_top"] },
  {
    id: "two_top_reverse",
    label: "2 ตัวบนกลับ",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_top"],
    reverse: true,
  },
  { id: "two_bottom", label: "2 ตัวล่าง", group: "two", digits: 2, settlementTypeIds: ["two_bottom"] },
  {
    id: "two_bottom_reverse",
    label: "2 ตัวล่างกลับ",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_bottom"],
    reverse: true,
  },
  {
    id: "two_top_bottom",
    label: "2 ตัวบน/ล่าง",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_top", "two_bottom"],
  },
  {
    id: "two_top_bottom_reverse",
    label: "2 ตัวบน/ล่างกลับ",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_top", "two_bottom"],
    reverse: true,
  },
  { id: "run_top", label: "วิ่งบน", group: "run", digits: 1, settlementTypeIds: ["run_top"] },
  { id: "run_bottom", label: "วิ่งล่าง", group: "run", digits: 1, settlementTypeIds: ["run_bottom"] },
];

/** ปิดรับก่อนงวดออกผล — mock */
const CLOSE_BEFORE_DRAW_MS = 2 * 60 * 1000;

/**
 * สร้างรายการงวดถัดไปจากเวลาปัจจุบัน — ใช้ในหน้ารายการรอบ /lottery/yiki-15 และ /lottery/yiki-30 (ส่ง intervalMin ต่างกัน)
 * เรียกฝั่ง client เท่านั้น (ใช้ Date.now()) เพื่อไม่ให้ markup server/client ไม่ตรงกัน
 */
export function generateYikiRounds(count = 8, intervalMin = 15, from = new Date()): YikiRound[] {
  const intervalMs = intervalMin * 60 * 1000;
  const base = new Date(from);
  base.setSeconds(0, 0);
  const remainder = base.getMinutes() % intervalMin;
  base.setMinutes(base.getMinutes() - remainder + intervalMin);

  return Array.from({ length: count }, (_, index) => {
    const drawAt = new Date(base.getTime() + index * intervalMs);
    const closeAt = new Date(drawAt.getTime() - CLOSE_BEFORE_DRAW_MS);
    const hh = String(drawAt.getHours()).padStart(2, "0");
    const mm = String(drawAt.getMinutes()).padStart(2, "0");
    return {
      id: `${drawAt.getFullYear()}${String(drawAt.getMonth() + 1).padStart(2, "0")}${String(drawAt.getDate()).padStart(2, "0")}${hh}${mm}`,
      label: `รอบ ${hh}:${mm} น.`,
      closeAt: closeAt.toISOString(),
    };
  });
}

const ROUND_ID_PATTERN = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/;

/**
 * ถอด roundId (yyyyMMddHHmm) กลับเป็นข้อมูลงวดโดยตรง — ไม่พึ่งเวลา ณ ตอนเรียก
 * ใช้ในหน้าแทง /lottery/yiki-15/[roundId] กัน mismatch กับรายการที่สร้างไว้ในหน้าก่อนหน้า
 */
export function getYikiRoundById(roundId: string): YikiRound | null {
  const match = ROUND_ID_PATTERN.exec(roundId);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const drawAt = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  if (Number.isNaN(drawAt.getTime())) return null;
  const closeAt = new Date(drawAt.getTime() - CLOSE_BEFORE_DRAW_MS);
  return {
    id: roundId,
    label: `รอบ ${hour}:${minute} น.`,
    closeAt: closeAt.toISOString(),
  };
}
