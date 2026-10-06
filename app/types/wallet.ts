/* ── จาก app/data/depositMockData.ts ── */

export type DepositMethodId = "bank" | "gateway" | "truemoney";

export interface DepositMethodOption {
  id: DepositMethodId;
  title: string;
  subtitle: string;
}

/** บัญชีรับโอน mock — step 2 ฝากธนาคาร */
export interface DepositBankAccountMock {
  bankName: string;
  accountNumberDisplay: string;
  accountNumberCopy: string;
  accountName: string;
  sampleBadgeLabel: string;
}

/* ── จาก app/data/withdrawMockData.ts ── */

export interface WithdrawUserBankMock {
  bankShortName: string;
  accountNumberDisplay: string;
  holderLabel: string;
}
