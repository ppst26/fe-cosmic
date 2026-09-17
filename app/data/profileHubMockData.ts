/** สถิติ mock บนการ์ดโปรไฟล์ hub */
export interface ProfileHubStats {
  vipLevel: number;
  vipLabel: string;
  diamonds: number;
  lossBonusThb: number;
  affiliateBalanceThb: number;
  activePromotionLabel: string;
}

export const PROFILE_HUB_STATS_MOCK: ProfileHubStats = {
  vipLevel: 3,
  vipLabel: "VIP 3",
  diamonds: 1250,
  lossBonusThb: 350,
  affiliateBalanceThb: 2450,
  activePromotionLabel: "โบนัสสมาชิกใหม่",
};
