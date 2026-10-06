/** ข้อมูล mock dialog รายการรอดำเนินการ (ฝาก/ถอน) */

import { WITHDRAW_USER_BANK_MOCK } from "@/app/data/withdrawMockData";
import { formatDepositTransferAmount } from "@/lib/format";

export type PendingTransactionKind = "deposit" | "withdraw";

export interface PendingTransactionDetailRow {
  label: string;
  value: string;
}

export interface PendingTransactionPayload {
  kind: PendingTransactionKind;
  amount: number;
  title: string;
  subtitle: string;
  amountDisplay: string;
  referenceId: string;
  referenceCopyValue: string;
  transactionAtLabel: string;
  rows: PendingTransactionDetailRow[];
  historyHref: string;
}

const PENDING_TRANSACTION_AT_DEPOSIT = "15 ก.ย. 2569 • 14:30";
const PENDING_TRANSACTION_AT_WITHDRAW = "15 ก.ย. 2569 • 14:35";

export function buildPendingDepositPayload(amount: number): PendingTransactionPayload {
  return {
    kind: "deposit",
    amount,
    title: "ฝากเงินรอดำเนินการ",
    subtitle: "รอจับคู่ยอดทำรายการ",
    amountDisplay: formatDepositTransferAmount(amount),
    referenceId: "DEP-DEMO-001",
    referenceCopyValue: "DEP-DEMO-001",
    transactionAtLabel: PENDING_TRANSACTION_AT_DEPOSIT,
    rows: [
      { label: "ช่องทาง", value: "บัญชีธนาคาร" },
      { label: "เลขอ้างอิง", value: "DEP-DEMO-001" },
      { label: "วันที่ทำรายการ", value: PENDING_TRANSACTION_AT_DEPOSIT },
    ],
    historyHref: "/transactions",
  };
}

export function buildPendingWithdrawPayload(amount: number): PendingTransactionPayload {
  const accountLabel = `${WITHDRAW_USER_BANK_MOCK.bankShortName} ••••7890`;
  return {
    kind: "withdraw",
    amount,
    title: "ถอนเงินรอดำเนินการ",
    subtitle: "ระบบกำลังรอทำรายการ",
    amountDisplay: formatDepositTransferAmount(amount),
    referenceId: "WTH-DEMO-001",
    referenceCopyValue: "WTH-DEMO-001",
    transactionAtLabel: PENDING_TRANSACTION_AT_WITHDRAW,
    rows: [
      { label: "บัญชีรับเงิน", value: accountLabel },
      { label: "เลขอ้างอิง", value: "WTH-DEMO-001" },
      { label: "วันที่ทำรายการ", value: PENDING_TRANSACTION_AT_WITHDRAW },
    ],
    historyHref: "/transactions?kind=withdraw",
  };
}
