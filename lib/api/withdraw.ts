import {
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_DEFAULT_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_USER_BANK_MOCK,
} from "@/app/data/withdrawMockData";
import type { MoneySubmitResult } from "./deposit";

/** บัญชีรับเงินถอน */
export function fetchWithdrawAccount() {
  return WITHDRAW_USER_BANK_MOCK;
}

/** ยอดที่ถอนได้ */
export function fetchWithdrawBalance() {
  return WITHDRAW_AVAILABLE_BALANCE;
}

/** ยอดด่วนและยอดเริ่มต้นของแผงถอน */
export function fetchWithdrawQuickAmounts() {
  return {
    amounts: WITHDRAW_QUICK_AMOUNTS,
    defaultAmount: WITHDRAW_DEFAULT_AMOUNT,
  };
}

/**
 * ยืนยันถอน — mock หน่วง 500ms แล้วสำเร็จเสมอ
 * ต่อ backend: apiFetch POST /api/withdraw แล้ว map เป็น MoneySubmitResult
 */
export function submitWithdraw(_input: { amount: number }) {
  return new Promise<MoneySubmitResult>((resolve) => {
    setTimeout(() => resolve({ ok: true }), 500);
  });
}
