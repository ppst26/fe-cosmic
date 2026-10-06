import { NextResponse } from "next/server";
import { listLotterySlips } from "@/lib/lottery/mockSlipStore";
import { getSessionUserId } from "@/lib/auth/session";

/**
 * GET /api/lottery/slips — โพยล่าสุดของผู้ใช้ที่ login (mock)
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }
  return NextResponse.json({ slips: listLotterySlips(userId) });
}
