import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";

/** ดึงโพยที่ส่งแล้วจาก mock API */
export async function fetchLotterySlip(slipId: string): Promise<LotterySubmittedSlip | null> {
  const res = await fetch(`/api/lottery/slips/${encodeURIComponent(slipId)}`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return (await res.json()) as LotterySubmittedSlip;
}

/** รายการโพยทั้งหมด (mock) */
export async function fetchLotterySlips(): Promise<LotterySubmittedSlip[]> {
  const res = await fetch("/api/lottery/slips", { credentials: "include" });
  if (!res.ok) return [];
  const data = (await res.json()) as { slips: LotterySubmittedSlip[] };
  return data.slips ?? [];
}
