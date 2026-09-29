/** ประเภทรายการธุรกรรมใน tab */
export type TransactionKind = "deposit" | "withdraw" | "promotion" | "bet";

/** สถานะรายการ (mock) */
export type TransactionStatus = "completed" | "pending" | "failed";

/** ประเภทแถวเดิมพัน */
export type BetRowType = "bet" | "result";

/** รายการฝาก/ถอน/โปร/เดิมพัน */
export interface TransactionItem {
  id: string;
  kind: TransactionKind;
  /** รายละเอียด / ชื่อรายการ */
  title: string;
  amount: number;
  currency: "THB";
  status: TransactionStatus;
  createdAt: string;
  /** วันที่ทำรายการสำเร็จ (ฝาก) */
  completedAt?: string | null;
  reference: string;
  /** ช่องทาง (ถอน) */
  channel?: string;
  /** บัญชีที่ทำรายการ (ถอน) */
  accountLabel?: string;
  /** โปรโมชัน — ชื่อโปร */
  promotionName?: string;
  /** โปรโมชัน — วันเริ่ม/สิ้นสุดเล่น */
  playStartAt?: string;
  playEndAt?: string;
  freeSpins?: number;
  amountPerRound?: number;
  gameProvider?: string;
  gameName?: string;
  expiresWithinLabel?: string;
  /** เดิมพัน */
  betRowType?: BetRowType;
  openingBalance?: number;
  closingBalance?: number;
}

export interface TransactionKindTab {
  id: TransactionKind;
  label: string;
}
