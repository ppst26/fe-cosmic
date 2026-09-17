import type { TransactionItem, TransactionKindTab } from "../types/transaction";

/** แท็บเลือกประเภท — มีแค่ฝาก / ถอน */
export const TRANSACTION_KIND_TABS: TransactionKindTab[] = [
  { id: "deposit", label: "ฝากเงิน" },
  { id: "withdraw", label: "ถอนเงิน" },
];

/** Mock รายการฝาก */
export const MOCK_DEPOSIT_TRANSACTIONS: TransactionItem[] = [
  {
    id: "dep-001",
    kind: "deposit",
    title: "ฝากผ่านบัญชีธนาคาร",
    amount: 500,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-14T18:32:00+07:00",
    reference: "DP240914832",
  },
  {
    id: "dep-002",
    kind: "deposit",
    title: "ฝากผ่านบัญชีธนาคาร",
    amount: 1000,
    currency: "THB",
    status: "pending",
    createdAt: "2026-09-13T09:15:00+07:00",
    reference: "DP240913915",
  },
  {
    id: "dep-003",
    kind: "deposit",
    title: "ฝากผ่านบัญชีธนาคาร",
    amount: 300,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-10T21:08:00+07:00",
    reference: "DP240910108",
  },
];

/** Mock รายการถอน */
export const MOCK_WITHDRAW_TRANSACTIONS: TransactionItem[] = [
  {
    id: "wd-001",
    kind: "withdraw",
    title: "ถอนเข้าบัญชีธนาคาร",
    amount: 200,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-12T14:20:00+07:00",
    reference: "WD240912420",
  },
  {
    id: "wd-002",
    kind: "withdraw",
    title: "ถอนเข้าบัญชีธนาคาร",
    amount: 1500,
    currency: "THB",
    status: "failed",
    createdAt: "2026-09-11T11:05:00+07:00",
    reference: "WD240911105",
  },
];

export function getTransactionsByKind(kind: "deposit" | "withdraw"): TransactionItem[] {
  return kind === "deposit" ? MOCK_DEPOSIT_TRANSACTIONS : MOCK_WITHDRAW_TRANSACTIONS;
}
