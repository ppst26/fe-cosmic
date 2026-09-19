/** สถานะตลาดหวย — เปิดรับ / ปิดรับ */
export type LotteryMarketStatus = "open" | "closed";

/** โทนสีไอคอนธงของตลาดหวย — map กับ class .lottery-flag--{tone} ใน globals.css */
export type LotteryFlagTone =
  | "th" | "la" | "vn" | "my" | "us" | "cn" | "de" | "ru" | "kr"
  | "jp" | "gb" | "hk" | "tw" | "sg" | "in" | "eg" | "gold";

/** การ์ด feature แถวบน (หวยไทย · ยี่กี) */
export interface LotteryFeaturedItem {
  id: string;
  title: string;
  countdownLabel: string;
  href: string;
  visual: "thai-gov" | "yiki";
  yikiMinutes?: 5 | 15 | 30;
}

/** รายการหวยในกริด */
export interface LotteryGridItem {
  id: string;
  title: string;
  status: LotteryMarketStatus;
  countdownLabel?: string;
  flagLabel: string;
  flagTone: LotteryFlagTone;
  href: string;
}

/** แถวผลหวยล่าสุด */
export interface LotteryResultRow {
  id: string;
  title: string;
  top3: string;
  bottom2: string;
  dateLabel: string;
  flagLabel: string;
  flagTone: LotteryFlagTone;
}

/* ---------- หวยรัฐบาลไทย (/lottery/thai-government) ---------- */

/** กลุ่มจำนวนหลัก — ใช้เป็นแท็บเลือกชุดประเภทการแทง */
export type ThaiLottoDigitGroup = "three" | "two" | "run";

/** ประเภทการแทงหวยรัฐบาลไทย */
export type ThaiLottoBetTypeId =
  | "three_top"
  | "three_tod"
  | "three_front"
  | "three_back"
  | "two_top"
  | "two_bottom"
  | "run_top"
  | "run_bottom";

export interface ThaiLottoBetType {
  id: ThaiLottoBetTypeId;
  label: string;
  group: ThaiLottoDigitGroup;
  digits: 1 | 2 | 3;
  /** อัตราจ่ายต่อ 1 บาท */
  payoutRate: number;
}

/** ข้อมูลงวดที่เปิดรับแทง */
export interface ThaiLottoDraw {
  id: string;
  drawLabel: string;
  /** ISO datetime เวลาปิดรับแทง */
  closeAt: string;
  minBet: number;
  maxBet: number;
}

/** ผลรางวัลงวดก่อน */
export interface ThaiLottoResult {
  drawLabel: string;
  firstPrize: string;
  front3: string[];
  back3: string[];
  bottom2: string;
}

/** รายการในโพยแทง */
export interface ThaiLottoBetEntry {
  id: string;
  typeId: ThaiLottoBetTypeId;
  number: string;
  amount: number;
}

/* ---------- เลือกรอบเล่น (step 2) ---------- */

/** รายการใน sidebar เลือกประเภทหวย */
export interface LotteryCatalogEntry {
  slug: string;
  title: string;
  flagLabel: string;
  flagTone: LotteryFlagTone;
  /** path หน้ารายการรอบ เช่น /lottery/thai-government */
  roundsHref: string;
  status: LotteryMarketStatus;
  /** ข้อความใต้ชื่อใน sidebar — countdown หรือสถานะ */
  statusLabel: string;
}

/** รอบการเล่น — mock จากตารางจริง (หวยไทย 1/16 · ยี่กี · หวยรายวัน) */
export type LotteryPlayRoundStatus = "open" | "upcoming" | "closed";

export interface LotteryPlayRound {
  id: string;
  drawLabel: string;
  /** ข้อความยาวบนการ์ดรอบ */
  scheduleLabel: string;
  drawAt: string;
  closeAt: string;
  openAt: string;
  status: LotteryPlayRoundStatus;
  minBet: number;
  maxBet: number;
}
