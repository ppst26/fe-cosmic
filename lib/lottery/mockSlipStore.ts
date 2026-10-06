import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";

/** โพย + เจ้าของ (ownerId ไม่ส่งกลับ client) */
interface StoredSlip {
  ownerId: string;
  slip: LotterySubmittedSlip;
}

type SlipStore = Map<string, StoredSlip>;

/** เก็บโพยสูงสุดต่อ instance — mock ในหน่วยความจำ (หายเมื่อ restart · backend จริงต้องใช้ DB) */
const MAX_STORED_SLIPS = 2_000;

const globalForSlips = globalThis as typeof globalThis & { __cosmicLotterySlips?: SlipStore };

function getStore(): SlipStore {
  if (!globalForSlips.__cosmicLotterySlips) {
    globalForSlips.__cosmicLotterySlips = new Map();
  }
  return globalForSlips.__cosmicLotterySlips;
}

/** บันทึกโพยหลังส่งสำเร็จ — ผูกกับผู้ใช้ที่ส่ง */
export function saveLotterySlip(ownerId: string, slip: LotterySubmittedSlip): void {
  const store = getStore();
  store.set(slip.id, { ownerId, slip });
  if (store.size > MAX_STORED_SLIPS) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
}

/** อ่านโพยตาม id — เฉพาะเจ้าของ (คนอื่นได้ null เหมือนไม่มีโพยนี้) */
export function getLotterySlipById(ownerId: string, id: string): LotterySubmittedSlip | null {
  const stored = getStore().get(id);
  return stored && stored.ownerId === ownerId ? stored.slip : null;
}

/** โพยล่าสุดของผู้ใช้ (หน้าโพยทั้งหมด) */
export function listLotterySlips(ownerId: string, limit = 30): LotterySubmittedSlip[] {
  return [...getStore().values()]
    .filter((stored) => stored.ownerId === ownerId)
    .map((stored) => stored.slip)
    .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
    .slice(0, limit);
}
