/** ชื่อแรงค์ VIP ตามสเปก */
export type VipRankId = "silver" | "gold" | "platinum" | "emerald" | "diamond";

export type VipModalTabId = "my-level" | "rank" | "benefits";

export type VipMissionIconKind = "login" | "deposit" | "play";

/** ภารกิจเลื่อนระดับ */
export interface VipMission {
  id: string;
  label: string;
  progress: number;
  target: number;
  unit: string;
  icon: VipMissionIconKind;
}

/** แรงค์ในลadder */
export interface VipRankTier {
  id: VipRankId;
  label: string;
  expRequired: number;
  accent: string;
}

/** แถวในตารางเปรียบเทียบสิทธิประโยชน์ */
export interface VipBenefitComparisonRow {
  id: string;
  label: string;
}

/** @deprecated ใช้ตาราง VIP_BENEFIT_COMPARISON_* แทน */
export interface VipBenefitRow {
  rankId: VipRankId;
  items: string[];
}

/** สถานะ VIP ของผู้เล่น (mock) */
export interface VipPlayerState {
  currentRankId: VipRankId;
  nextRankId: VipRankId | null;
  /** ยอดเทิร์นโอเวอร์สะสม — ใช้กับแถบ progress หลัก */
  turnoverProgress: number;
  missions: VipMission[];
}

/** เงื่อนไขรักษาระดับ VIP รอบปัจจุบัน */
export interface VipMaintainState {
  daysRemaining: number;
  depositProgress: number;
  depositTarget: number;
  turnoverProgress: number;
  turnoverTarget: number;
}
