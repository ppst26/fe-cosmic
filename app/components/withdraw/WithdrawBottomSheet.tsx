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
import { ChevronRightIcon } from "../ui/Icons";
import { ResponsiveSheetHeader } from "../ui/ResponsiveSheetHeader";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import {
  COSMIC_CHOICE_BTN,
  COSMIC_SHEET_SOFT_GLASS_INTERACTIVE,
  COSMIC_SHEET_SUBMIT,
} from "../ui/cosmicButtonClasses";

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
        <Dialog.Overlay className={responsiveSheetOverlayClass()} />
        <Dialog.Content
          aria-describedby="withdraw-sheet-desc"
          className={responsiveSheetContentClass(
            "max-h-[min(88dvh,680px)] min-h-[min(70dvh,520px)] lg:min-h-0",
          )}
        >
          <div className={RESPONSIVE_SHEET_HANDLE_CLASS} aria-hidden="true" />

          <ResponsiveSheetHeader
            closeAriaLabel="ปิดหน้าถอนเงิน"
            title={<Dialog.Title className="text-xl font-extrabold sm:text-2xl">ถอนเงิน</Dialog.Title>}
          />

          <div
            id="withdraw-sheet-desc"
            className="min-h-0 flex-1 overflow-y-auto pb-3 [scrollbar-width:thin] [scrollbar-color:rgba(124,58,237,0.35)_transparent]"
          >
            <button
              type="button"
              className={`${COSMIC_SHEET_SOFT_GLASS_INTERACTIVE} flex w-full items-center gap-3 px-3 py-3.5 sm:px-4 sm:py-4`}
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
              <span className="glass-control glass-icon-btn !h-9 !w-9 shrink-0 text-[var(--icon-default)]">
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
              <div className="flex flex-wrap items-center justify-center gap-2 px-1 pb-1">
                {WITHDRAW_QUICK_AMOUNTS.map((value) => {
                  const active = amount === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => applyAmount(value)}
                      className={`${COSMIC_CHOICE_BTN} shrink-0 px-4 py-2 text-sm ${active ? "is-active" : ""}`}
                    >
                      {formatWithdrawAmount(value)}
                    </button>
                  );
                })}
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
              className={COSMIC_SHEET_SUBMIT}
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
