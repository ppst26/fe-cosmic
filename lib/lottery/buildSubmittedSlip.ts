import type { SubmitLotteryBetRequest } from "@/app/types/lotteryBetApi";
import type { LotterySubmittedSlip, LotterySlipLine } from "@/app/types/lotterySlip";

/**
 * สร้าง record โพยจาก payload ส่งแทง — ใช้ใน POST /api/lottery/bets
 */
export function buildSubmittedSlip(
  body: SubmitLotteryBetRequest,
  ids: { slipId: string; reference: string; purchasedAt: string },
): LotterySubmittedSlip {
  const lines: LotterySlipLine[] = body.lines.map((line) => {
    const payoutRate = Number(line.payoutRate) > 0 ? Number(line.payoutRate) : 1;
    const amount = Number(line.amount);
    return {
      typeKey: line.typeKey,
      typeLabel: line.typeLabel?.trim() || line.typeKey,
      number: line.number,
      amount,
      payoutRate,
      potentialWin: Math.round(amount * payoutRate),
    };
  });

  const totalStake = lines.reduce((sum, line) => sum + line.amount, 0);
  const drawAt = body.drawCloseAt?.trim() || ids.purchasedAt;

  return {
    id: ids.slipId,
    shortId: ids.slipId.slice(0, 8).toLowerCase(),
    reference: ids.reference,
    market: body.market,
    roundId: body.roundId,
    drawLabel: body.drawLabel?.trim() || "งวดปัจจุบัน",
    drawAt,
    purchasedAt: ids.purchasedAt,
    status: "submitted",
    note: body.note ?? null,
    lines,
    totalStake,
    winLoss: null,
    continuePlayHref: body.continuePlayHref?.trim() || "/lottery",
  };
}
