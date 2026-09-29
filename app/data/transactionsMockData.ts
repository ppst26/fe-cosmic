import type { TransactionItem, TransactionKind, TransactionKindTab } from "../types/transaction";
import { endOfDay, isDateInRange, startOfDay } from "@/app/lib/transactionDateUtils";

/** แท็บเลือกประเภท */
export const TRANSACTION_KIND_TABS: TransactionKindTab[] = [
  { id: "deposit", label: "ฝาก" },
  { id: "withdraw", label: "ถอน" },
  { id: "promotion", label: "โปรโมชัน" },
  { id: "bet", label: "เดิมพัน" },
];

export const TRANSACTION_BET_PAGE_SIZE = 10;

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
    completedAt: "2026-09-14T18:35:00+07:00",
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
    completedAt: null,
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
    completedAt: "2026-09-10T21:12:00+07:00",
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
    channel: "ธนาคาร",
    accountLabel: "091-0-17077-8",
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
    channel: "ธนาคาร",
    accountLabel: "091-0-17077-8",
  },
];

/** Mock โปรโมชัน — ว่างตามสกรีนตัวอย่าง */
export const MOCK_PROMOTION_TRANSACTIONS: TransactionItem[] = [];

/** Mock เดิมพัน — ตัวอย่าง Treasures of Aztec */
export const MOCK_BET_TRANSACTIONS: TransactionItem[] = [
  {
    id: "bet-001",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "result",
    amount: 5,
    openingBalance: 842.5,
    closingBalance: 847.5,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:18:08+07:00",
    reference: "BT9171808",
  },
  {
    id: "bet-002",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "bet",
    amount: 5,
    openingBalance: 847.5,
    closingBalance: 842.5,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:18:05+07:00",
    reference: "BT9171805",
  },
  {
    id: "bet-003",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "result",
    amount: 0,
    openingBalance: 842.5,
    closingBalance: 842.5,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:17:58+07:00",
    reference: "BT9171758",
  },
  {
    id: "bet-004",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "bet",
    amount: 22,
    openingBalance: 864.5,
    closingBalance: 842.5,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:17:55+07:00",
    reference: "BT9171755",
  },
  {
    id: "bet-005",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "result",
    amount: 2.5,
    openingBalance: 840,
    closingBalance: 842.5,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:17:48+07:00",
    reference: "BT9171748",
  },
  {
    id: "bet-006",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "bet",
    amount: 2.5,
    openingBalance: 842.5,
    closingBalance: 840,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:17:45+07:00",
    reference: "BT9171745",
  },
  {
    id: "bet-007",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "bet",
    amount: 10,
    openingBalance: 850,
    closingBalance: 840,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:16:30+07:00",
    reference: "BT9171630",
  },
  {
    id: "bet-008",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "result",
    amount: 0,
    openingBalance: 850,
    closingBalance: 850,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:16:28+07:00",
    reference: "BT9171628",
  },
  {
    id: "bet-009",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "bet",
    amount: 50,
    openingBalance: 900,
    closingBalance: 850,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:15:10+07:00",
    reference: "BT9171510",
  },
  {
    id: "bet-010",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "result",
    amount: 12,
    openingBalance: 838,
    closingBalance: 850,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-17T18:15:08+07:00",
    reference: "BT9171508",
  },
  {
    id: "bet-011",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "bet",
    amount: 100,
    openingBalance: 950,
    closingBalance: 850,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-16T20:42:00+07:00",
    reference: "BT9164200",
  },
  {
    id: "bet-012",
    kind: "bet",
    title: "Treasures of Aztec",
    gameName: "Treasures of Aztec",
    betRowType: "result",
    amount: -30,
    openingBalance: 880,
    closingBalance: 850,
    currency: "THB",
    status: "completed",
    createdAt: "2026-09-16T20:41:55+07:00",
    reference: "BT9164155",
  },
];

export function getTransactionsByKind(kind: TransactionKind): TransactionItem[] {
  switch (kind) {
    case "deposit":
      return MOCK_DEPOSIT_TRANSACTIONS;
    case "withdraw":
      return MOCK_WITHDRAW_TRANSACTIONS;
    case "promotion":
      return MOCK_PROMOTION_TRANSACTIONS;
    case "bet":
      return MOCK_BET_TRANSACTIONS;
    default:
      return [];
  }
}

export function filterTransactionsByDateRange(
  items: TransactionItem[],
  from: Date,
  to: Date,
): TransactionItem[] {
  const start = startOfDay(from);
  const end = endOfDay(to);
  return items.filter((item) => {
    const created = new Date(item.createdAt);
    return isDateInRange(created, start, end);
  });
}

export function sumCompletedDepositAmount(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "deposit" && item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0);
}

export function sumCompletedWithdrawAmount(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "withdraw" && item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0);
}

/** จำนวนครั้งที่รับโปรในช่วงที่กรอง */
export function countPromotionClaims(items: TransactionItem[]): number {
  return items.filter((item) => item.kind === "promotion").length;
}

/** ยอดวิน/ลอสรวม — กำไรจากผลลัพธ์ลบยอดเดิมพัน */
export function sumBetWinLossTotal(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "bet")
    .reduce((sum, item) => {
      if (item.betRowType === "result") return sum + item.amount;
      if (item.betRowType === "bet") return sum - Math.abs(item.amount);
      return sum;
    }, 0);
}

/** ยอดเดิมพันรวม (เฉพาะแถวประเภทเดิมพัน) */
export function sumBetStakeTotal(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "bet" && item.betRowType === "bet")
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
}
