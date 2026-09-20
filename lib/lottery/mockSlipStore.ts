import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";

type SlipStore = Map<string, LotterySubmittedSlip>;

const globalForSlips = globalThis as typeof globalThis & { __cosmicLotterySlips?: SlipStore };

function getStore(): SlipStore {
  if (!globalForSlips.__cosmicLotterySlips) {
    globalForSlips.__cosmicLotterySlips = new Map();
  }
  return globalForSlips.__cosmicLotterySlips;
}

/** บันทึกโพย mock หลังส่งสำเร็จ */
export function saveLotterySlip(slip: LotterySubmittedSlip): void {
  getStore().set(slip.id, slip);
}

/** อ่านโพยตาม id */
export function getLotterySlipById(id: string): LotterySubmittedSlip | null {
  return getStore().get(id) ?? null;
}

/** รายการโพยล่าสุด (สำหรับหน้าโพยทั้งหมด) */
export function listLotterySlips(limit = 30): LotterySubmittedSlip[] {
  return [...getStore().values()]
    .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
    .slice(0, limit);
}
