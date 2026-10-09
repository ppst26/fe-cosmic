import type { LotteryBetMarketId } from "./lotteryBetApi";
import type { LotteryMessageKey } from "./lottery";

export type LotterySlipStatus = "submitted" | "won" | "lost" | "void";

export interface LotterySlipLine {
  typeKey: string;
  /** key ชื่อประเภทแทงใน namespace lottery — แปลตอน render */
  typeLabelKey: LotteryMessageKey;
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
  /** ป้ายงวดที่ client ส่งมาตอนแทง · ว่าง = ไม่ระบุ (แสดง "งวดปัจจุบัน") */
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
