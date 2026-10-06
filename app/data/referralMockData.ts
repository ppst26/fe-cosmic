import type {
  ReferralStatsMock,
  ReferralCommissionTier,
  ReferralUserRow,
  ReferralEarningSummaryMock,
  ReferralEarningHistoryRow,
  ReferralEarningPeriodId,
} from "@/app/types/referral";

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

export const REFERRAL_EARNING_PERIOD_OPTIONS: { id: ReferralEarningPeriodId; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "today", label: "วันนี้" },
  { id: "week", label: "สัปดาห์ที่แล้ว" },
  { id: "month", label: "เดือนที่แล้ว" },
];

