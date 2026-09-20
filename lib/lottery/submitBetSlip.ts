import type {
  SubmitLotteryBetRequest,
  SubmitLotteryBetResponse,
} from "@/app/types/lotteryBetApi";

/**
 * เรียก mock API ส่งโพยหวย — ใช้จากหน้าแทง step 3
 */
export async function submitLotteryBetSlip(
  body: SubmitLotteryBetRequest,
): Promise<SubmitLotteryBetResponse> {
  const res = await fetch("/api/lottery/bets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  try {
    return (await res.json()) as SubmitLotteryBetResponse;
  } catch {
    return { ok: false, error: "ไม่สามารถอ่านผลจากเซิร์ฟเวอร์" };
  }
}
