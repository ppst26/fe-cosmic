import {
  VIP_BENEFIT_COMPARISON_ROWS,
  VIP_BENEFIT_COMPARISON_VALUES,
  VIP_PLAYER_MOCK,
  VIP_RANK_TIERS,
  VIP_RANK_VIDEO,
} from "@/app/data/vipMockData";

export function fetchVipPlayer() {
  return VIP_PLAYER_MOCK;
}

export function fetchVipRanks() {
  return { tiers: VIP_RANK_TIERS, videos: VIP_RANK_VIDEO };
}

export function fetchVipBenefits() {
  return { rows: VIP_BENEFIT_COMPARISON_ROWS, values: VIP_BENEFIT_COMPARISON_VALUES };
}
