/** ช่องทางฝากเงิน — step 1 ของ flow ฝาก (mock) */

export type DepositMethodId = "bank" | "gateway" | "truemoney";

export interface DepositMethodOption {
  id: DepositMethodId;
  title: string;
  subtitle: string;
}

export const DEPOSIT_METHOD_OPTIONS: DepositMethodOption[] = [
  {
    id: "bank",
    title: "บัญชีธนาคาร",
    subtitle: "โอนเงินผ่านบัญชีธนาคาร",
  },
  {
    id: "gateway",
    title: "Payment Gateway",
    subtitle: "ฝากเงินผ่านระบบชำระเงิน",
  },
  {
    id: "truemoney",
    title: "ทรูวอลเล็ท",
    subtitle: "ฝากเงินผ่าน TrueMoney Wallet",
  },
];

/** บัญชีรับโอน mock — step 2 ฝากธนาคาร */
export interface DepositBankAccountMock {
  bankName: string;
  accountNumberDisplay: string;
  accountNumberCopy: string;
  accountName: string;
  sampleBadgeLabel: string;
}

export const DEPOSIT_BANK_ACCOUNT_MOCK: DepositBankAccountMock = {
  bankName: "ธนาคารกสิกรไทย",
  accountNumberDisplay: "XXX-X-XXXXX-X",
  accountNumberCopy: "1234567890",
  accountName: "บริษัท ตัวอย่าง จำกัด",
  sampleBadgeLabel: "บัญชีตัวอย่าง",
};

export const DEPOSIT_QUICK_AMOUNTS: number[] = [100, 300, 500, 1000, 3000, 5000];

export const DEPOSIT_DEFAULT_AMOUNT = 500;

