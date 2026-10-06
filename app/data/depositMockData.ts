/** ช่องทางฝากเงิน — step 1 ของ flow ฝาก (mock) */

import type { DepositMethodOption, DepositBankAccountMock } from "@/app/types/wallet";

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

export const DEPOSIT_BANK_ACCOUNT_MOCK: DepositBankAccountMock = {
  bankName: "ธนาคารกสิกรไทย",
  accountNumberDisplay: "XXX-X-XXXXX-X",
  accountNumberCopy: "1234567890",
  accountName: "บริษัท ตัวอย่าง จำกัด",
  sampleBadgeLabel: "บัญชีตัวอย่าง",
};

export const DEPOSIT_QUICK_AMOUNTS: number[] = [100, 300, 500, 1000, 3000, 5000];

export const DEPOSIT_DEFAULT_AMOUNT = 500;

