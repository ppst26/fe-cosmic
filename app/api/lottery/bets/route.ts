import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { buildSubmittedSlip } from "@/lib/lottery/buildSubmittedSlip";
import { saveLotterySlip } from "@/lib/lottery/mockSlipStore";
import type {
  SubmitLotteryBetRequest,
  SubmitLotteryBetResponse,
} from "@/app/types/lotteryBetApi";

/**
 * POST /api/lottery/bets — รับโพยหวย (mock) คืนเลขอ้างอิง
 */
export async function POST(request: Request) {
  let body: SubmitLotteryBetRequest;
  try {
    body = (await request.json()) as SubmitLotteryBetRequest;
  } catch {
    return NextResponse.json<SubmitLotteryBetResponse>(
      { ok: false, error: "ข้อมูลไม่ถูกต้อง" },
      { status: 400 },
    );
  }

  const market = body.market?.trim() ?? "";
  const roundId = body.roundId?.trim() ?? "";
  const lines = Array.isArray(body.lines) ? body.lines : [];

  if (!market || !roundId) {
    return NextResponse.json<SubmitLotteryBetResponse>(
      { ok: false, error: "กรุณาระบุตลาดและรอบ" },
      { status: 400 },
    );
  }

  if (lines.length === 0) {
    return NextResponse.json<SubmitLotteryBetResponse>(
      { ok: false, error: "โพยว่าง — ไม่มีรายการแทง" },
      { status: 400 },
    );
  }

  for (const line of lines) {
    const amount = Number(line.amount);
    if (!line.typeKey || !line.number || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json<SubmitLotteryBetResponse>(
        { ok: false, error: "มีรายการที่ยังไม่ใส่ราคาหรือข้อมูลไม่ครบ" },
        { status: 400 },
      );
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 480));

  const totalAmount = lines.reduce((sum, line) => sum + Number(line.amount), 0);
  const purchasedAt = new Date().toISOString();
  const slipId = randomBytes(16).toString("hex");
  const reference = `LY-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;

  const slip = buildSubmittedSlip(body, { slipId, reference, purchasedAt });
  saveLotterySlip(slip);

  return NextResponse.json<SubmitLotteryBetResponse>({
    ok: true,
    slipId,
    reference,
    totalAmount,
    lineCount: lines.length,
    submittedAt: purchasedAt,
  });
}
