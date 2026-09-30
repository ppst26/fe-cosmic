import {
  MOCK_BET_TRANSACTIONS,
  MOCK_DEPOSIT_TRANSACTIONS,
  MOCK_PROMOTION_TRANSACTIONS,
  MOCK_WITHDRAW_TRANSACTIONS,
  TRANSACTION_KIND_TABS,
} from "@/app/data/transactionsMockData";
import {
  buildPendingDepositPayload,
  buildPendingWithdrawPayload,
} from "@/app/data/pendingTransactionMockData";

export function fetchTransactions() {
  return {
    tabs: TRANSACTION_KIND_TABS,
    deposit: MOCK_DEPOSIT_TRANSACTIONS,
    withdraw: MOCK_WITHDRAW_TRANSACTIONS,
    promotion: MOCK_PROMOTION_TRANSACTIONS,
    bet: MOCK_BET_TRANSACTIONS,
  };
}

export function fetchPendingTransaction() {
  return { buildPendingDepositPayload, buildPendingWithdrawPayload };
}
