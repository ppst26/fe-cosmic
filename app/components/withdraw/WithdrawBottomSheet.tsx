"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import { MONEY_AMOUNT_MAX_DIGITS, sanitizeMoneyAmount } from "@/lib/fieldInput";
import { submitWithdraw } from "@/lib/api/withdraw";
import {
  useWithdrawAccount,
  useWithdrawBalance,
  useWithdrawQuickAmounts,
} from "@/app/hooks/api/money";
import { ResourceGate } from "../ui/ResourceGate";
import { ChevronRightIcon } from "../ui/Icons";
import { ResponsiveSheetHeader } from "../ui/ResponsiveSheetHeader";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { CosmicConfirmDialog } from "../ui/CosmicConfirmDialog";
import {
  COSMIC_CHOICE_BTN,
  COSMIC_SHEET_SOFT_GLASS_INTERACTIVE,
  COSMIC_BTN_PRIMARY,
} from "../ui/cosmicButtonClasses";
import { formatWithdrawAmount, formatWithdrawMoney } from "@/lib/format";
import { useWallet } from "@/app/hooks/api/account";
import { valueClass } from "@/lib/semanticValue";

interface WithdrawBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (amount: number) => void;
}

/**
 * Bottom sheet ถอนเงิน step 1 — เลือกบัญชี + กรอกยอด (mock)
 */
export function WithdrawBottomSheet({ isOpen, onClose, onCompleted }: WithdrawBottomSheetProps) {
  /** โหลดตั้งแต่ mount (sheet ถูก mount ไว้ใน WithdrawProvider) */
  const quick = useWithdrawQuickAmounts();
  const account = useWithdrawAccount();
  const balance = useWithdrawBalance();
  const wallet = useWallet();
  /** ยังโหลดยอดถอนได้ไม่เสร็จ = 0 → ปุ่มยืนยันกดไม่ได้ */
  const available = balance.data ?? 0;
  const defaultAmount = quick.data?.defaultAmount ?? 0;

  const [amount, setAmount] = useState(defaultAmount);
  const [amountInput, setAmountInput] = useState(defaultAmount ? String(defaultAmount) : "");

  /** ยอดเริ่มต้นมาถึงหลัง mount — ตั้งค่าฟอร์มครั้งเดียวต่อค่า (ปรับระหว่าง render) */
  const [seededDefault, setSeededDefault] = useState(defaultAmount);
  if (seededDefault !== defaultAmount) {
    setSeededDefault(defaultAmount);
    setAmount(defaultAmount);
    setAmountInput(String(defaultAmount));
  }
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const resetFlow = () => {
    setAmount(defaultAmount);
    setAmountInput(defaultAmount ? String(defaultAmount) : "");
    setSubmitting(false);
    setSubmitMessage(null);
    setConfirmOpen(false);
  };

  /** ปิดจากภายนอก (isOpen → false) — รีเซ็ตฟอร์มระหว่าง render แทน effect */
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) resetFlow();
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetFlow();
      onClose();
    }
  };

  const applyAmount = (value: number) => {
    const capped = Math.min(Math.max(0, value), available);
    setAmount(capped);
    setAmountInput(capped > 0 ? String(capped) : "");
  };

  const handleAmountChange = (raw: string) => {
    const digits = sanitizeMoneyAmount(raw);
    setAmountInput(digits);
    const parsed = digits ? Number.parseInt(digits, 10) : 0;
    applyAmount(parsed);
  };

  const handleWithdrawAll = () => {
    applyAmount(available);
  };

  const canConfirm = amount > 0 && amount <= available;

  const handleConfirm = async () => {
    if (amount <= 0 || amount > available) return;
    setSubmitting(true);
    setSubmitMessage(null);
    const result = await submitWithdraw({ amount });
    setSubmitting(false);
    setConfirmOpen(false);
    if (!result.ok) {
      setSubmitMessage(result.error);
      return;
    }
    wallet.refresh();
    balance.refresh();
    onCompleted?.(amount);
    onClose();
  };

  const handleRequestConfirm = () => {
    if (!canConfirm) return;
    setConfirmOpen(true);
  };

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
            titleIconSrc="/assets/deposit/Wallet2.avif"
            titleIconDesktopOnly
            title={<Dialog.Title className="text-xl font-medium sm:text-2xl">ถอนเงิน</Dialog.Title>}
          />

          <div
            id="withdraw-sheet-desc"
            className="min-h-0 flex-1 overflow-y-auto pb-3"
          >
            <ResourceGate resource={account} loadingLabel="กำลังโหลดบัญชีรับเงิน…" errorTitle="โหลดบัญชีรับเงินไม่สำเร็จ">
              {(bank) => (
            <button
              type="button"
              className={`${COSMIC_SHEET_SOFT_GLASS_INTERACTIVE} flex w-full items-center gap-3 px-3 py-3.5 sm:px-4 sm:py-4`}
              aria-label="เปลี่ยนบัญชีรับเงิน"
            >
              <KbankLogoGraphic className="h-11 w-11 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="cosmic-type-sheet-desc block">โอนเข้าบัญชีของคุณ</span>
                <span className="mt-0.5 block text-sm font-medium text-[var(--text-primary)] sm:text-base">
                  {bank.bankShortName}
                </span>
                <span className="cosmic-type-sheet-meta mt-0.5 block font-medium tracking-wide">
                  {bank.accountNumberDisplay}
                </span>
                <span className="cosmic-type-sheet-desc mt-0.5 block">{bank.holderLabel}</span>
              </span>
              <span className="glass-control glass-icon-btn !h-9 !w-9 shrink-0 text-[var(--icon-default)]">
                <ChevronRightIcon className="h-4 w-4" />
              </span>
            </button>
              )}
            </ResourceGate>

            <div className="mt-5">
              <p className="cosmic-type-sheet-label text-center">จำนวนเงินที่ต้องการถอน</p>
              <div className="mt-4 pb-3">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span
                    className={valueClass("emphasis", "shrink-0 text-5xl leading-none sm:text-6xl")}
                    aria-hidden="true"
                  >
                    ฿
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountInput}
                    maxLength={MONEY_AMOUNT_MAX_DIGITS}
                    onChange={(event) => handleAmountChange(event.target.value)}
                    className="input-keep-size min-w-[2ch] max-w-[min(72vw,320px)] bg-transparent text-5xl font-medium leading-none tracking-tight text-[var(--text-primary)] outline-none sm:text-6xl"
                    style={{ width: `${Math.max(2, amountInput.length || 1)}.5ch` }}
                    aria-label="จำนวนเงินที่ต้องการถอน"
                  />
                </div>
              </div>
              <div className="cosmic-type-sheet-desc mt-2 flex flex-wrap items-center justify-between gap-2">
                <p>
                  ถอนได้ ฿{formatWithdrawMoney(available)}
                </p>
                <button
                  type="button"
                  onClick={handleWithdrawAll}
                  className="font-medium text-[var(--accent-muted)] underline-offset-2 hover:underline"
                >
                  ถอนทั้งหมด
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-center gap-2 px-1 pb-1">
                {(quick.data?.amounts ?? []).map((value) => {
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
              <p className="cosmic-type-sheet-desc mt-2 text-center">แตะยอดเงินเพื่อแก้ไข</p>
            </div>

            {submitMessage && (
              <p
                className="mt-4 rounded-[var(--radius-control)] bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] px-3 py-2 text-xs text-[var(--destructive)] sm:text-sm"
                role="alert"
              >
                {submitMessage}
              </p>
            )}
          </div>

          <div className="mt-auto shrink-0 pt-3">
            <button
              type="button"
              disabled={!canConfirm || submitting}
              onClick={handleRequestConfirm}
              className={COSMIC_BTN_PRIMARY}
            >
              {submitting ? "กำลังส่ง..." : "ยืนยันถอนเงิน"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      <CosmicConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="warning"
        title="ยืนยันส่งคำขอถอนเงิน?"
        description={
          account.data
            ? `โอนเข้า ${account.data.bankShortName} ${account.data.accountNumberDisplay}`
            : undefined
        }
        confirmLabel="ยืนยันถอน"
        loading={submitting}
        summary={
          <p className="text-center text-sm font-medium text-[var(--text-primary)]">
            ยอดถอน{" "}
            <span className={valueClass("emphasis")}>฿ {formatWithdrawAmount(amount)}</span>
          </p>
        }
        onConfirm={handleConfirm}
      />
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
