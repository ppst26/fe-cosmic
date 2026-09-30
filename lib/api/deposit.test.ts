import assert from "node:assert/strict";
import test from "node:test";
import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
} from "@/app/data/depositMockData";
import {
  fetchDepositBankAccount,
  fetchDepositMethods,
  fetchDepositQuickAmounts,
  submitDeposit,
} from "./deposit";

test("deposit reads return the current mock", () => {
  assert.deepEqual(fetchDepositMethods(), DEPOSIT_METHOD_OPTIONS);
  assert.deepEqual(fetchDepositBankAccount(), DEPOSIT_BANK_ACCOUNT_MOCK);
  assert.deepEqual(fetchDepositQuickAmounts(), {
    amounts: DEPOSIT_QUICK_AMOUNTS,
    defaultAmount: DEPOSIT_DEFAULT_AMOUNT,
  });
});

test("submitDeposit resolves ok after the existing delay", async () => {
  const started = Date.now();
  const result = await submitDeposit({ amount: 500, methodId: "bank" });
  assert.deepEqual(result, { ok: true });
  assert.ok(Date.now() - started >= 500);
});
