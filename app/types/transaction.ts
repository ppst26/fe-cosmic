/** ประเภทรายการธุรกรรมใน tab */
export type TransactionKind = "deposit" | "withdraw";

/** สถานะรายการ (mock) */
export type TransactionStatus = "completed" | "pending" | "failed";

/** รายการฝาก/ถอน */
export interface TransactionItem {
  id: string;
  kind: TransactionKind;
  title: string;
  amount: number;
  currency: "THB";
  status: TransactionStatus;
  createdAt: string;
  reference: string;
}

export interface TransactionKindTab {
  id: TransactionKind;
  label: string;
}
