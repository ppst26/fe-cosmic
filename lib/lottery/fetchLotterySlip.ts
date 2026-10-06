import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { apiFetch } from "@/lib/api/http";

/** ดึงโพยที่ส่งแล้ว — null เมื่อไม่พบหรือโหลดไม่ได้ (หน้า /lottery/slips/[slipId]) */
export async function fetchLotterySlip(slipId: string): Promise<LotterySubmittedSlip | null> {
  const res = await apiFetch<LotterySubmittedSlip>(
    `/api/lottery/slips/${encodeURIComponent(slipId)}`,
  );
  return res.ok ? res.data : null;
}

/** รายการโพยของผู้ใช้ — [] เมื่อโหลดไม่ได้ (หน้า /lottery/slips) */
export async function fetchLotterySlips(): Promise<LotterySubmittedSlip[]> {
  const res = await apiFetch<{ slips: LotterySubmittedSlip[] }>("/api/lottery/slips");
  return res.ok ? (res.data?.slips ?? []) : [];
}
