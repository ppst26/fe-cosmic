"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import {
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_DEFAULT_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_USER_BANK_MOCK,
  formatWithdrawAmount,
  formatWithdrawMoney,
} from "@/app/data/withdrawMockData";
import { ChevronRightIcon, CloseIcon } from "../ui/Icons";

interface WithdrawBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (amount: number) => void;
}

/**
 * Bottom sheet ถอนเงิน step 1 — เลือกบัญชี + กรอกยอด (mock)
 */
export function WithdrawBottomSheet({ isOpen, onClose, onCompleted }: WithdrawBottomSheetProps) {
  const [amount, setAmount] = useState(WITHDRAW_DEFAULT_AMOUNT);
  const [amountInput, setAmountInput] = useState(String(WITHDRAW_DEFAULT_AMOUNT));
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const resetFlow = () => {
    setAmount(WITHDRAW_DEFAULT_AMOUNT);
    setAmountInput(String(WITHDRAW_DEFAULT_AMOUNT));
    setSubmitting(false);
    setSubmitMessage(null);
  };

  useEffect(() => {
    if (!isOpen) resetFlow();
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetFlow();
      onClose();
    }
  };

  const applyAmount = (value: number) => {
    const capped = Math.min(Math.max(0, value), WITHDRAW_AVAILABLE_BALANCE);
    setAmount(capped);
    setAmountInput(capped > 0 ? String(capped) : "");
  };

  const handleAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setAmountInput(digits);
    const parsed = digits ? Number.parseInt(digits, 10) : 0;
    applyAmount(parsed);
  };

  const handleWithdrawAll = () => {
    applyAmount(WITHDRAW_AVAILABLE_BALANCE);
  };

  const handleConfirm = () => {
    if (amount <= 0 || amount > WITHDRAW_AVAILABLE_BALANCE) return;
    setSubmitting(true);
    setSubmitMessage(null);
    window.setTimeout(() => {
      setSubmitting(false);
      onCompleted?.(amount);
      onClose();
    }, 500);
  };

  const bank = WITHDRAW_USER_BANK_MOCK;
  const canConfirm = amount > 0 && amount <= WITHDRAW_AVAILABLE_BALANCE;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[var(--surface-end)]/85 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="withdraw-sheet-desc"
          className="cosmic-sheet-shell fixed inset-x-0 bottom-0 z-[70] flex max-h-[min(88dvh,680px)] min-h-[min(70dvh,520px)] flex-col bg-[#121127] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-[var(--text-primary)] shadow-[0_-16px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom duration-300 sm:px-5"
        >
          <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-white/20" aria-hidden="true" />

          <div className="relative flex shrink-0 items-center justify-center px-12 pt-1 pb-2">
            <WithdrawSheetMarkIcon className="absolute left-0 top-1 h-9 w-9 text-[var(--icon-default)]" />
            <Dialog.Title className="text-xl font-extrabold sm:text-2xl">ถอนเงิน</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-hover)]/90 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-selected)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-label="ปิดหน้าถอนเงิน"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div
            id="withdraw-sheet-desc"
            className="min-h-0 flex-1 overflow-y-auto pb-3 [scrollbar-width:thin] [scrollbar-color:rgba(124,58,237,0.35)_transparent]"
          >
            <button
              type="button"
              className="cosmic-inset-card flex w-full items-center gap-3 bg-[var(--surface-hover)]/35 px-3 py-3.5 text-left transition-colors hover:bg-[var(--surface-selected)]/20 sm:px-4 sm:py-4"
              aria-label="เปลี่ยนบัญชีรับเงิน"
            >
              <KbankLogoGraphic className="h-11 w-11 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] text-[var(--text-muted)]">โอนเข้าบัญชีของคุณ</span>
                <span className="mt-0.5 block text-sm font-extrabold text-[var(--text-primary)] sm:text-base">
                  {bank.bankShortName}
                </span>
                <span className="mt-0.5 block text-xs font-semibold tracking-wide text-[var(--text-secondary)]">
                  {bank.accountNumberDisplay}
                </span>
                <span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">{bank.holderLabel}</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)]/50 text-[var(--icon-default)]">
                <ChevronRightIcon className="h-4 w-4" />
              </span>
            </button>

            <div className="mt-5">
              <p className="text-center text-xs font-medium text-[var(--text-secondary)]">จำนวนเงินที่ต้องการถอน</p>
              <div className="mt-4 pb-3">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span
                    className="shrink-0 text-5xl font-extrabold leading-none text-[#a78bfa] sm:text-6xl"
                    aria-hidden="true"
                  >
                    ฿
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountInput}
                    onChange={(event) => handleAmountChange(event.target.value)}
                    className="min-w-[2ch] max-w-[min(72vw,320px)] bg-transparent text-5xl font-extrabold leading-none tracking-tight text-[var(--text-primary)] outline-none sm:text-6xl"
                    style={{ width: `${Math.max(2, amountInput.length || 1)}.5ch` }}
                    aria-label="จำนวนเงินที่ต้องการถอน"
                  />
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <p className="text-[var(--text-secondary)]">
                  ถอนได้ ฿{formatWithdrawMoney(WITHDRAW_AVAILABLE_BALANCE)}
                </p>
                <button
                  type="button"
                  onClick={handleWithdrawAll}
                  className="font-bold text-[#a78bfa] underline-offset-2 hover:underline"
                >
                  ถอนทั้งหมด
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {WITHDRAW_QUICK_AMOUNTS.map((value) => {
                  const active = amount === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => applyAmount(value)}
                      className={`shrink-0 rounded-[var(--radius-control)] px-4 py-2 text-sm font-extrabold transition-colors ${
                        active
                          ? "bg-[#ddd6fe] text-[#1e1035]"
                          : "bg-[var(--surface-hover)]/35 text-[var(--text-secondary)] hover:bg-[var(--surface-selected)]/25"
                      }`}
                    >
                      {formatWithdrawAmount(value)}
                    </button>
                  );
                })}
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--icon-default)] opacity-60" aria-hidden="true" />
              </div>
              <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">แตะยอดเงินเพื่อแก้ไข</p>
            </div>

            {submitMessage && (
              <p
                className="mt-4 rounded-[var(--radius-control)] bg-[#0f3d2e]/80 px-3 py-2 text-xs text-[var(--success)] sm:text-sm"
                role="status"
              >
                {submitMessage}
              </p>
            )}
          </div>

          <div className="mt-auto shrink-0 pt-3">
            <button
              type="button"
              disabled={!canConfirm || submitting}
              onClick={handleConfirm}
              className="cosmic-action-btn flex h-12 w-full items-center justify-center gap-2 text-base disabled:opacity-45"
            >
              <WithdrawConfirmIcon className="h-5 w-5" />
              {submitting ? "กำลังส่ง..." : "ยืนยันถอนเงิน"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function KbankLogoGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <path d="M24 8c-6 4-10 10-10 16 0 8 6 14 10 16 4-2 10-8 10-16 0-6-4-12-10-16Z" fill="#138f4a" />
      <path d="M24 12c-4 3-7 8-7 12 0 5 4 9 7 11 3-2 7-6 7-11 0-4-3-9-7-12Z" fill="#e11d48" opacity="0.85" />
    </svg>
  );
}

function WithdrawSheetMarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <rect x="6" y="6" width="24" height="24" rx="6" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 22 22 14M22 14h-6M22 14v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WithdrawConfirmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M7 17 17 7M17 7h-6M17 7v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
