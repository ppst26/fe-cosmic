import { NextResponse } from "next/server";
import { listLotterySlips } from "@/lib/lottery/mockSlipStore";

/**
 * GET /api/lottery/slips — รายการโพยล่าสุด (mock)
 */
export async function GET() {
  return NextResponse.json({ slips: listLotterySlips() });
}
