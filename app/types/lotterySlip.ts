import type { LotteryBetMarketId } from "./lotteryBetApi";

export type LotterySlipStatus = "submitted" | "won" | "lost" | "void";

export interface LotterySlipLine {
  typeKey: string;
  typeLabel: string;
  number: string;
  amount: number;
  payoutRate: number;
  potentialWin: number;
}

export interface LotterySubmittedSlip {
  id: string;
  shortId: string;
  reference: string;
  market: LotteryBetMarketId;
  roundId: string;
  drawLabel: string;
  /** ISO — วันเวลาปิดรับ / ออกรางวัล (แสดงเป็นงวด) */
  drawAt: string;
  purchasedAt: string;
  status: LotterySlipStatus;
  note: string | null;
  lines: LotterySlipLine[];
  totalStake: number;
  winLoss: number | null;
  continuePlayHref: string;
}
