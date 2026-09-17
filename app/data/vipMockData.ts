import type {
  VipBenefitComparisonRow,
  VipMaintainState,
  VipMission,
  VipPlayerState,
  VipRankId,
  VipRankTier,
} from "@/app/types/vip";

/** ลำดับแรงค์ VIP */
export const VIP_RANK_TIERS: VipRankTier[] = [
  { id: "silver", label: "SILVER", expRequired: 0, accent: "#b8c0cc" },
  { id: "gold", label: "GOLD", expRequired: 10_000, accent: "#f5c542" },
  { id: "platinum", label: "PLATINUM", expRequired: 25_000, accent: "#9fd4ff" },
  { id: "emerald", label: "EMERALD", expRequired: 50_000, accent: "#5ee4a0" },
  { id: "diamond", label: "DIAMOND", expRequired: 100_000, accent: "#b794ff" },
];

/** วิดีโอตราแรงค์ VIP — ไฟล์ใน public/rank */
export const VIP_RANK_VIDEO: Record<VipRankId, string> = {
  silver: "/rank/silver-tier.C7ZBg7E2.webm",
  gold: "/rank/gold-tier.CiYu19wS.webm",
  platinum: "/rank/platinum-tier.X7LpQ2-P.webm",
  emerald: "/rank/emerald-tier.B5fMjduG.webm",
  diamond: "/rank/diamond-tier.CTp40fMd.webm",
};

export function getVipRankVideoSrc(rankId: VipRankId): string | null {
  return VIP_RANK_VIDEO[rankId] ?? null;
}

/** เป้าฐาน — ทวีคูณ 2^ลำดับแรงค์ */
export const VIP_TURNOVER_BASE = 500;

export const VIP_MISSION_BASE = {
  loginDays: 7,
  depositCount: 5,
  playCount: 10,
} as const;

export const VIP_PLAYER_MOCK: VipPlayerState = {
  currentRankId: "gold",
  nextRankId: "platinum",
  turnoverProgress: 0,
  missions: [
    { id: "login", label: "ล็อกอิน", progress: 5, target: 28, unit: "วัน", icon: "login" },
    { id: "deposit", label: "ฝากเงิน", progress: 3, target: 20, unit: "ครั้ง", icon: "deposit" },
    { id: "play", label: "เข้าเล่น", progress: 8, target: 40, unit: "ครั้ง", icon: "play" },
  ],
};

/** mock รักษาระดับ — แสดงเฉพาะแรงค์ที่ผู้เล่นถืออยู่ */
export const VIP_MAINTAIN_BY_RANK: Partial<Record<VipRankId, VipMaintainState>> = {
  gold: {
    daysRemaining: 7,
    depositProgress: 6_400,
    depositTarget: 10_000,
    turnoverProgress: 12_898,
    turnoverTarget: 10_000,
  },
};

/** แถวชื่อสิทธิ — คอลัมน์แรกของตารางสิทธิประโยชน์ */
export const VIP_BENEFIT_COMPARISON_ROWS: VipBenefitComparisonRow[] = [
  { id: "cashback", label: "Cashback พิเศษ" },
  { id: "rolling", label: "Rolling พิเศษ" },
  { id: "diamond-deposit", label: "Diamond จากฝาก" },
  { id: "fast-withdraw", label: "ถอนด่วน" },
  { id: "vip-manager", label: "VIP Manager" },
  { id: "upgrade-bonus", label: "โบนัสอัปเกรด" },
  { id: "deposit-condition", label: "เงื่อนไขฝาก" },
  { id: "turnover-condition", label: "เงื่อนไขเทิร์น" },
];

/** ค่า mock ต่อช่อง [rowId][rankId] */
export const VIP_BENEFIT_COMPARISON_VALUES: Record<
  string,
  Partial<Record<VipRankId, string>>
> = {
  cashback: {
    silver: "0.3%",
    gold: "0.5%",
    platinum: "0.8%",
    emerald: "1.0%",
    diamond: "1.2%",
  },
  rolling: {
    silver: "—",
    gold: "0.2%",
    platinum: "0.35%",
    emerald: "0.5%",
    diamond: "0.65%",
  },
  "diamond-deposit": {
    silver: "—",
    gold: "+5%",
    platinum: "+8%",
    emerald: "+12%",
    diamond: "+15%",
  },
  "fast-withdraw": {
    silver: "—",
    gold: "✓",
    platinum: "✓",
    emerald: "✓ เร็วขึ้น",
    diamond: "✓ สูงสุด",
  },
  "vip-manager": {
    silver: "—",
    gold: "—",
    platinum: "✓",
    emerald: "✓",
    diamond: "✓",
  },
  "upgrade-bonus": {
    silver: "—",
    gold: "100",
    platinum: "250",
    emerald: "500",
    diamond: "1,000",
  },
  "deposit-condition": {
    silver: "ไม่กำหนด",
    gold: "500+",
    platinum: "1,000+",
    emerald: "2,500+",
    diamond: "5,000+",
  },
};

export function getVipBenefitCellValue(rowId: string, rankId: VipRankId): string {
  if (rowId === "turnover-condition") {
    return formatVipAmount(getVipTurnoverTarget(rankId));
  }
  return VIP_BENEFIT_COMPARISON_VALUES[rowId]?.[rankId] ?? "—";
}

export interface VipRankRequirements {
  turnoverTarget: number;
  loginDays: number;
  depositCount: number;
  playCount: number;
}

export function getVipRankIndex(rankId: VipRankId): number {
  const index = VIP_RANK_TIERS.findIndex((t) => t.id === rankId);
  return index >= 0 ? index : 0;
}

/** ตัวคูณสะสมต่อแรงค์ (Silver ×1, Gold ×2, …) */
export function getVipRankMultiplier(rankId: VipRankId): number {
  return 2 ** getVipRankIndex(rankId);
}

export function getVipRankTier(id: VipRankId): VipRankTier {
  return VIP_RANK_TIERS.find((t) => t.id === id) ?? VIP_RANK_TIERS[0];
}

export function formatVipAmount(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

export const formatVipExp = formatVipAmount;

/** เป้าเทิร์นตามแรงค์ */
export function getVipTurnoverTarget(rankId: VipRankId): number {
  return VIP_TURNOVER_BASE * getVipRankMultiplier(rankId);
}

/** เป้าสะสมครบชุดตามแรงค์ (เทิร์น + ภารกิจ) */
export function getVipRequirementsForRank(rankId: VipRankId): VipRankRequirements {
  const mult = getVipRankMultiplier(rankId);
  return {
    turnoverTarget: VIP_TURNOVER_BASE * mult,
    loginDays: VIP_MISSION_BASE.loginDays * mult,
    depositCount: VIP_MISSION_BASE.depositCount * mult,
    playCount: VIP_MISSION_BASE.playCount * mult,
  };
}

export type VipRankViewStatus = "active" | "cleared" | "locked";

export function getVipRankViewStatus(
  focusedRankId: VipRankId,
  playerRankId: VipRankId,
): VipRankViewStatus {
  const focused = getVipRankIndex(focusedRankId);
  const current = getVipRankIndex(playerRankId);
  if (focused < current) return "cleared";
  if (focused > current) return "locked";
  return "active";
}

/** แรงค์ที่ใช้คำนวณเป้าเมื่อโฟกัสแรงค์ใน carousel */
export function getVipRequirementRankForFocus(
  focusedRankId: VipRankId,
  player: VipPlayerState,
): VipRankId {
  const status = getVipRankViewStatus(focusedRankId, player.currentRankId);
  if (status === "active" && player.nextRankId) {
    return player.nextRankId;
  }
  return focusedRankId;
}

export function getVipScaledMissions(
  player: VipPlayerState,
  requirementRankId: VipRankId,
): VipMission[] {
  const req = getVipRequirementsForRank(requirementRankId);
  const byId = Object.fromEntries(player.missions.map((m) => [m.id, m]));

  return [
    {
      id: "login",
      label: "ล็อกอิน",
      progress: byId.login?.progress ?? 0,
      target: req.loginDays,
      unit: "วัน",
      icon: "login",
    },
    {
      id: "deposit",
      label: "ฝากเงิน",
      progress: byId.deposit?.progress ?? 0,
      target: req.depositCount,
      unit: "ครั้ง",
      icon: "deposit",
    },
    {
      id: "play",
      label: "เข้าเล่น",
      progress: byId.play?.progress ?? 0,
      target: req.playCount,
      unit: "ครั้ง",
      icon: "play",
    },
  ];
}

export function formatVipMissionStatus(mission: VipMission): string {
  return `${formatVipAmount(mission.progress)} / ${formatVipAmount(mission.target)} ${mission.unit}`;
}

/** ข้อมูลรักษาระดับของแรงค์ปัจจุบัน (ถ้ามี) */
export function getVipMaintainState(rankId: VipRankId): VipMaintainState | null {
  return VIP_MAINTAIN_BY_RANK[rankId] ?? null;
}
