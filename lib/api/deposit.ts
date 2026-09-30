import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
  type DepositMethodId,
} from "@/app/data/depositMockData";

/** ช่องทางฝาก — คืนรายการ mock ทันที */
export function fetchDepositMethods() {
  return DEPOSIT_METHOD_OPTIONS;
}

/** บัญชีรับโอน — คืนการ์ดบัญชี mock ทันที */
export function fetchDepositBankAccount() {
  return DEPOSIT_BANK_ACCOUNT_MOCK;
}

/** ยอดด่วนและยอดเริ่มต้นของแผงฝาก */
export function fetchDepositQuickAmounts() {
  return {
    amounts: DEPOSIT_QUICK_AMOUNTS,
    defaultAmount: DEPOSIT_DEFAULT_AMOUNT,
  };
}

/** ยืนยันฝาก — หน่วง 500ms เท่าแผงเดิม ชื่อสลิปไม่เข้าฟังก์ชันนี้ */
export function submitDeposit(_input: { amount: number; methodId: DepositMethodId }) {
  return new Promise<{ ok: true }>((resolve) => {
    setTimeout(() => resolve({ ok: true }), 500);
  });
}
