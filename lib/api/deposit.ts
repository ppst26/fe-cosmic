import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
} from "@/app/data/depositMockData";
import type { DepositMethodId } from "@/app/types/wallet";

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

/** ผลส่งรายการฝาก/ถอน — ok:false พร้อมข้อความพร้อมแสดงผู้ใช้ */
export type MoneySubmitResult = { ok: true } | { ok: false; error: string };

/**
 * ยืนยันฝาก — mock หน่วง 500ms แล้วสำเร็จเสมอ · ชื่อสลิปยังไม่เข้าฟังก์ชันนี้
 * ต่อ backend: apiFetch POST /api/deposit (FormData พร้อมไฟล์สลิป) แล้ว map เป็น MoneySubmitResult
 */
export function submitDeposit(_input: { amount: number; methodId: DepositMethodId }) {
  return new Promise<MoneySubmitResult>((resolve) => {
    setTimeout(() => resolve({ ok: true }), 500);
  });
}
