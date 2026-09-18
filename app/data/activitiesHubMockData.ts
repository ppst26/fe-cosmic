/** ข้อมูล mock หน้ากิจกรรม (/activities) — รายการซ้าย + รายละเอียดขวา (desktop) */

export type ActivityHubCategoryTab = "slots" | "casino";

export type ActivityTierClaimState = "locked" | "claimable" | "claimed";

export interface ActivityTierRow {
  rank: number;
  turnRequired: number;
  bonus: number;
  claimState: ActivityTierClaimState;
}

export type ActivityThumbTone =
  | "turn"
  | "xl-win"
  | "check-in"
  | "football"
  | "mascot"
  | "cashback";

export type ActivityDetailKind = "turn-tier" | "info";

export interface ActivityHubItem {
  id: string;
  title: string;
  thumbTone: ActivityThumbTone;
  detailKind: ActivityDetailKind;
  /** ข้อความใต้ชื่อในรายการ */
  listMeta?: string;
  /** ป้ายทับรูป (เช่น ยังไม่เปิด) */
  statusOverlay?: string;
  categoryTabs?: ActivityHubCategoryTab[];
  progress?: {
    currentTurn: number;
    rank1Target: number;
    bonusEarned: number;
    bonusCap: number;
  };
  tiersByCategory?: Partial<Record<ActivityHubCategoryTab, ActivityTierRow[]>>;
  infoSummary?: string;
  infoBullets?: string[];
}

export const ACTIVITY_HUB_CATEGORY_TABS: { id: ActivityHubCategoryTab; label: string }[] = [
  { id: "slots", label: "สล็อต" },
  { id: "casino", label: "คาสิโน" },
];

const TURN_TIERS_SLOTS: ActivityTierRow[] = [
  { rank: 1, turnRequired: 5_000, bonus: 49, claimState: "locked" },
  { rank: 2, turnRequired: 30_000, bonus: 69, claimState: "locked" },
  { rank: 3, turnRequired: 100_000, bonus: 89, claimState: "locked" },
  { rank: 4, turnRequired: 700_000, bonus: 129, claimState: "locked" },
  { rank: 5, turnRequired: 5_000_000, bonus: 289, claimState: "locked" },
  { rank: 6, turnRequired: 10_000_000, bonus: 589, claimState: "locked" },
  { rank: 7, turnRequired: 20_000_000, bonus: 999, claimState: "locked" },
  { rank: 8, turnRequired: 30_000_000, bonus: 1_999, claimState: "locked" },
  { rank: 9, turnRequired: 40_000_000, bonus: 4_999, claimState: "locked" },
  { rank: 10, turnRequired: 50_000_000, bonus: 19_999, claimState: "locked" },
];

const TURN_TIERS_CASINO: ActivityTierRow[] = TURN_TIERS_SLOTS.map((row) => ({
  ...row,
  bonus: Math.round(row.bonus * 1.15),
}));

export const ACTIVITIES_HUB_ITEMS: ActivityHubItem[] = [
  {
    id: "act-turn-rewards",
    title: "ทำยอด Turn รับรางวัลจุใจ",
    thumbTone: "turn",
    detailKind: "turn-tier",
    listMeta: "สะสมเทิร์นรับโบนัสตามลำดับ",
    categoryTabs: ["slots", "casino"],
    progress: {
      currentTurn: 0,
      rank1Target: 5_000,
      bonusEarned: 0,
      bonusCap: 39_000,
    },
    tiersByCategory: {
      slots: TURN_TIERS_SLOTS,
      casino: TURN_TIERS_CASINO,
    },
  },
  {
    id: "act-xl-win",
    title: "ถูกรางวัล XL รับโบนัส",
    thumbTone: "xl-win",
    detailKind: "info",
    listMeta: "หมดเขต : 2026-09-08 ~ 2026-09-12",
    infoSummary: "เมื่อถูกรางวัลระดับ XL ในสล็อตที่ร่วมรายการ รับโบนัสเพิ่มตามเงื่อนไข",
    infoBullets: [
      "นับเฉพาะเกมที่แสดงป้ายร่วมรายการ",
      "โบนัสจ่ายเป็นเครดิต ไม่สามารถถอนได้ทันที",
      "จำกัด 1 สิทธิ์ต่อรอบกิจกรรม",
    ],
  },
  {
    id: "act-daily-check-in",
    title: "กิจกรรมเช็คอินรายวัน",
    thumbTone: "check-in",
    detailKind: "info",
    listMeta: "เช็คอินต่อเนื่องรับของรางวัล",
    infoSummary: "เช็คอินทุกวันเพื่อปลดล็อกรางวัลสะสม — ไปที่หน้าเช็คอินเพื่อรับสิทธิ์วันนี้",
    infoBullets: ["รีเซ็ตเวลา 00:00 น.", "ขาดวันจะเริ่มสะสมใหม่ตามกติกา"],
  },
  {
    id: "act-football-predict",
    title: "ทายผลบอล",
    thumbTone: "football",
    detailKind: "info",
    statusOverlay: "ยังไม่เปิดให้ทายผล",
    listMeta: "รอบถัดไปจะเปิดเร็ว ๆ นี้",
    infoSummary: "กิจกรรมทายผลบอลยังไม่เปิดในขณะนี้ — กลับมาตรวจสอบอีกครั้งภายหลัง",
    infoBullets: ["แจ้งเตือนผ่าน LINE/Telegram เมื่อเปิดรอบ"],
  },
  {
    id: "act-mascot",
    title: "กิจกรรม Mascot",
    thumbTone: "mascot",
    detailKind: "info",
    listMeta: "หมดเขต : 2026-09-08 ~ 2026-09-12",
    infoSummary: "ร่วมสนุกกับ mascot สุดคิ้วท์ สะสมแต้มแลกของรางวัล",
    infoBullets: ["เล่นเกมที่กำหนดเพื่อสะสมแต้ม", "ของรางวัลจำกัดตามจำนวน"],
  },
  {
    id: "act-loss-rebate",
    title: "คืนยอดเสีย",
    thumbTone: "cashback",
    detailKind: "info",
    listMeta: "หมดเขต : 2026-09-08 ~ 2026-09-12",
    infoSummary: "รับคืนยอดเสียสะสมตามระดับสมาชิก — ตรวจสอบยอดคืนได้ที่เมนูคืนยอด",
    infoBullets: ["คำนวณรายสัปดาห์", "กดรับภายในเวลาที่กำหนด"],
  },
];

export function formatActivityCredits(value: number): string {
  return `${value.toLocaleString("th-TH")} เครดิต`;
}

export function formatActivityNumber(value: number): string {
  return value.toLocaleString("th-TH");
}
