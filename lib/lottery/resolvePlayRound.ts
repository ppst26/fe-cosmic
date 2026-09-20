import { getLotteryPlayRoundById } from "@/app/data/lotteryRoundsMockData";
import type { LotteryFlagTone } from "@/app/types/lottery";
import { getLotteryMarketBySlug } from "@/app/data/lotteryMarketsMockData";

export interface LotteryPlayRoundView {
  id: string;
  label: string;
  closeAt: string;
  minBet: number;
  maxBet: number;
}

const YIKI_MARKET_TITLES: Record<string, string> = {
  "yiki-5": "หวยยี่กี 5 นาที",
  "yiki-15": "หวยยี่กี 15 นาที",
  "yiki-30": "หวยยี่กี 30 นาที",
};

/**
 * โหลดรอบแทงจาก slug + roundId — ใช้ทุกหน้า .../[roundId]
 */
export function resolveLotteryPlayRound(
  marketSlug: string,
  roundId: string,
): LotteryPlayRoundView | null {
  const playRound = getLotteryPlayRoundById(marketSlug, roundId);
  if (!playRound) return null;
  return {
    id: playRound.id,
    label: playRound.drawLabel,
    closeAt: playRound.closeAt,
    minBet: playRound.minBet,
    maxBet: playRound.maxBet,
  };
}

/** ชื่อ + ธงสำหรับการ์ดหัวงวด */
export function lotteryPlayMarketMeta(marketSlug: string): {
  title: string;
  flagLabel: string;
  flagTone: LotteryFlagTone;
} {
  if (marketSlug === "thai-government") {
    return { title: "หวยรัฐบาลไทย", flagLabel: "TH", flagTone: "th" };
  }
  const yikiTitle = YIKI_MARKET_TITLES[marketSlug];
  if (yikiTitle) {
    return { title: yikiTitle, flagLabel: "YK", flagTone: "gold" };
  }
  const market = getLotteryMarketBySlug(marketSlug);
  if (market) {
    return { title: market.title, flagLabel: market.flagLabel, flagTone: market.flagTone };
  }
  return { title: "แทงหวย", flagLabel: "TH", flagTone: "th" };
}
