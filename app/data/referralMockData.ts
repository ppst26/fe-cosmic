/** ข้อมูล mock หน้าแนะนำเพื่อน */
export interface ReferralStatsMock {
  friendsCount: number;
  totalTurnoverThb: number;
  totalEarningsThb: number;
}

export interface ReferralCommissionTier {
  id: string;
  title: string;
  subtitle: string;
  rateLabel: string;
  rateHint: string;
}

export const REFERRAL_MOCK_REF_CODE = "COSMIC88";

export const REFERRAL_STATS_MOCK: ReferralStatsMock = {
  friendsCount: 24,
  totalTurnoverThb: 128_500,
  totalEarningsThb: 642.5,
};

export const REFERRAL_COMMISSION_TIERS: ReferralCommissionTier[] = [
  {
    id: "tier-1",
    title: "ชั้น 1 — เพื่อนตรง",
    subtitle: "เพื่อนที่สมัครผ่านลิงก์ของคุณ",
    rateLabel: "0.5%",
    rateHint: "จากยอดเทิร์น",
  },
  {
    id: "tier-2",
    title: "ชั้น 2 — เพื่อนชวนต่อ",
    subtitle: "เพื่อนของเพื่อนที่คุณชวน",
    rateLabel: "0.05%",
    rateHint: "จากยอดเทิร์น",
  },
];

export const REFERRAL_FEATURE_CHECKS = [
  "คำนวณแบบเรียลไทม์",
  "รับค่าคอมตลอดชีพ",
  "ถอนขั้นต่ำ ฿50.00",
] as const;

export const REFERRAL_STEPS = [
  { id: "copy", label: "คัดลอกลิงก์" },
  { id: "share", label: "แชร์ให้เพื่อน" },
  { id: "earn", label: "รับส่วนแบ่ง" },
] as const;

export function buildReferralLink(refCode: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/?ref=${refCode}`;
  }
  return `https://cosmicbet.example/?ref=${refCode}`;
}

export function formatReferralCurrency(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatReferralCount(value: number): string {
  return `${new Intl.NumberFormat("th-TH").format(value)} คน`;
}

/** แถวรายชื่อเพื่อนที่สมัครผ่านลิงก์ — ใช้ในแท็บ Referral users */
export interface ReferralUserRow {
  id: string;
  username: string;
  /** ISO 8601 */
  registeredAt: string;
}

export const REFERRAL_USERS_PAGE_SIZE = 10;

/** จำนวนแถว mock ให้ตรงกับ stats.friendsCount */
function buildReferralUsersMock(count: number): ReferralUserRow[] {
  const base = new Date("2026-09-14T18:42:00+07:00");
  return Array.from({ length: count }, (_, index) => {
    const userNum = String(count - index).padStart(3, "0");
    const registeredAt = new Date(base.getTime() - index * 5 * 60 * 60 * 1000);
    return {
      id: `ref-user-${userNum}`,
      username: `cosmic_${userNum}`,
      registeredAt: registeredAt.toISOString(),
    };
  });
}

export const REFERRAL_USERS_MOCK: ReferralUserRow[] = buildReferralUsersMock(
  REFERRAL_STATS_MOCK.friendsCount,
);

/** จัดรูปแบบวันที่สมัครในตาราง — dd/mm/yyyy · HH:mm */
export function formatReferralRegisteredAt(iso: string): string {
  const date = new Date(iso);
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${datePart} · ${timePart}`;
}

/** สรุปโบนัสแท็บ Earning */
export interface ReferralEarningSummaryMock {
  bonusReceivedThb: number;
  bonusClaimableThb: number;
}

export interface ReferralEarningHistoryRow {
  id: string;
  amountThb: number;
  occurredAt: string;
}

export const REFERRAL_EARNING_PAGE_SIZE = 10;

export const REFERRAL_EARNING_SUMMARY_MOCK: ReferralEarningSummaryMock = {
  bonusReceivedThb: 500,
  bonusClaimableThb: 142.5,
};

function buildReferralEarningHistoryMock(): ReferralEarningHistoryRow[] {
  const amounts = [120, 80, 65, 50, 45, 40, 35, 30, 25, 20, 18, 15, 12, 10];
  const base = new Date("2026-09-14T18:42:00+07:00");
  return amounts.map((amountThb, index) => ({
    id: `ref-earn-${index + 1}`,
    amountThb,
    occurredAt: new Date(base.getTime() - index * 6 * 60 * 60 * 1000).toISOString(),
  }));
}

export const REFERRAL_EARNING_HISTORY_MOCK: ReferralEarningHistoryRow[] =
  buildReferralEarningHistoryMock();

/** จัดรูปแบบวันที่ในตาราง Earning — dd/mm/yyyy • HH:mm */
export function formatReferralEarningDateTime(iso: string): string {
  return formatReferralRegisteredAt(iso).replace(" · ", " • ");
}

export function formatReferralRecordCount(value: number): string {
  return `${new Intl.NumberFormat("th-TH").format(value)} รายการ`;
}
