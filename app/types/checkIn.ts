/* ── จาก app/data/dailyCheckInMockData.ts ── */

export type DailyCheckInDayStatus = "claimed" | "today" | "locked";

export interface DailyCheckInDayReward {
  day: number;
  label: string;
  credits: number;
  status: DailyCheckInDayStatus;
  isBigReward?: boolean;
}

export interface CumulativeCheckInMilestone {
  milestoneDay: number;
  gemsReward: number;
  isUnlocked: boolean;
}
