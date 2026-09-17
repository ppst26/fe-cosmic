/** ข้อมูล mock ถอนเงิน — step 1 */

export interface WithdrawUserBankMock {
  bankShortName: string;
  accountNumberDisplay: string;
  holderLabel: string;
}

export const WITHDRAW_USER_BANK_MOCK: WithdrawUserBankMock = {
  bankShortName: "กสิกรไทย",
  accountNumberDisplay: "XXX-X-XXXXX-X",
  holderLabel: "ผู้ใช้ ตัวอย่าง",
};

export const WITHDRAW_AVAILABLE_BALANCE = 12450;

export const WITHDRAW_DEFAULT_AMOUNT = 500;

export const WITHDRAW_QUICK_AMOUNTS: number[] = [100, 300, 500, 1000, 5000];

export function formatWithdrawAmount(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

export function formatWithdrawMoney(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
