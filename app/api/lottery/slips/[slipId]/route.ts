import { NextResponse } from "next/server";
import { getLotterySlipById } from "@/lib/lottery/mockSlipStore";

/**
 * GET /api/lottery/slips/[slipId] — อ่านโพยที่ส่งแล้ว (mock)
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slipId: string }> },
) {
  const { slipId } = await context.params;
  const slip = getLotterySlipById(slipId);
  if (!slip) {
    return NextResponse.json({ error: "ไม่พบโพย" }, { status: 404 });
  }
  return NextResponse.json(slip);
}
