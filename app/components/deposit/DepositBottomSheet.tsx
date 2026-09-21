"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
  formatDepositAmount,
  formatDepositTransferAmount,
  type DepositMethodId,
} from "@/app/data/depositMockData";
import { ChevronRightIcon, CopyIcon } from "../ui/Icons";
import { ResponsiveSheetHeader } from "../ui/ResponsiveSheetHeader";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import {
  COSMIC_CHOICE_BTN,
  COSMIC_SHEET_FIELD_AMOUNT,
  COSMIC_SHEET_FIELD_ROW,
  COSMIC_SHEET_SOFT_GLASS,
  COSMIC_SHEET_SOFT_GLASS_INTERACTIVE,
  COSMIC_SHEET_SUBMIT,
} from "../ui/cosmicButtonClasses";

type DepositSheetStep = "methods" | "bank" | "confirm";

interface DepositBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (amount: number) => void;
}

/**
 * Bottom sheet ฝากเงิน — step 1 ช่องทาง · step 2 ยอด · step 3 ยืนยัน
 */
export function DepositBottomSheet({ isOpen, onClose, onCompleted }: DepositBottomSheetProps) {
  const [step, setStep] = useState<DepositSheetStep>("methods");
  const [amount, setAmount] = useState(DEPOSIT_DEFAULT_AMOUNT);
  const [amountInput, setAmountInput] = useState(String(DEPOSIT_DEFAULT_AMOUNT));
  const [copied, setCopied] = useState(false);
  const [slipFileName, setSlipFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const slipInputRef = useRef<HTMLInputElement>(null);

  const resetFlow = () => {
    setStep("methods");
    setAmount(DEPOSIT_DEFAULT_AMOUNT);
    setAmountInput(String(DEPOSIT_DEFAULT_AMOUNT));
    setCopied(false);
    setSlipFileName(null);
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

  const handleSelectMethod = (methodId: DepositMethodId) => {
    if (methodId === "bank") {
      setStep("bank");
      return;
    }
    /* gateway / truemoney — step ถัดไปยังไม่ implement */
  };

  const handleBackToMethods = () => {
    setStep("methods");
    setCopied(false);
  };

  const handleBackToBank = () => {
    setStep("bank");
    setCopied(false);
    setSubmitMessage(null);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value);
    setAmountInput(String(value));
  };

  const handleAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setAmountInput(digits);
    const parsed = digits ? Number.parseInt(digits, 10) : 0;
    setAmount(parsed);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(DEPOSIT_BANK_ACCOUNT_MOCK.accountNumberCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  const handleEdit = () => {
    setAmountInput("");
    setAmount(0);
  };

  const handleNext = () => {
    if (amount <= 0) return;
    setStep("confirm");
    setSubmitMessage(null);
  };

  const handleSlipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSlipFileName(file?.name ?? null);
  };

  const handleConfirmDeposit = () => {
    if (amount <= 0) return;
    setSubmitting(true);
    setSubmitMessage(null);
    window.setTimeout(() => {
      setSubmitting(false);
      onCompleted?.(amount);
      onClose();
    }, 500);
  };

  const isTallStep = step === "bank" || step === "confirm";

  const ariaDescribedBy =
    step === "methods" ? "deposit-sheet-desc" : step === "bank" ? "deposit-bank-desc" : "deposit-confirm-desc";

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass()} />
        <Dialog.Content
          aria-describedby={ariaDescribedBy}
          className={responsiveSheetContentClass(
            isTallStep
              ? step === "confirm"
                ? "max-h-[min(92dvh,720px)] min-h-[min(78dvh,560px)] lg:min-h-0"
                : "max-h-[min(88dvh,680px)] min-h-[min(72dvh,520px)] lg:min-h-0"
              : "max-h-[min(70dvh,520px)] min-h-[min(58dvh,440px)] lg:min-h-0",
            { variant: "default" },
          )}
        >
          <div className={RESPONSIVE_SHEET_HANDLE_CLASS} aria-hidden="true" />

          {step === "methods" && <DepositMethodsStep onSelectMethod={handleSelectMethod} />}
          {step === "bank" && (
            <DepositBankStep
              amount={amount}
              amountInput={amountInput}
              copied={copied}
              onBack={handleBackToMethods}
              onQuickAmount={handleQuickAmount}
              onAmountChange={handleAmountChange}
              onCopyAccount={handleCopyAccount}
              onEdit={handleEdit}
              onNext={handleNext}
            />
          )}
          {step === "confirm" && (
            <DepositConfirmStep
              amount={amount}
              copied={copied}
              slipFileName={slipFileName}
              slipInputRef={slipInputRef}
              submitting={submitting}
              submitMessage={submitMessage}
              onBack={handleBackToBank}
              onCopyAccount={handleCopyAccount}
              onSlipChange={handleSlipChange}
              onPickSlip={() => slipInputRef.current?.click()}
              onConfirm={handleConfirmDeposit}
            />
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DepositMethodsStep({ onSelectMethod }: { onSelectMethod: (id: DepositMethodId) => void }) {
  return (
    <>
      <ResponsiveSheetHeader
        closeAriaLabel="ปิดหน้าฝากเงิน"
        title={<Dialog.Title className="text-xl font-medium sm:text-2xl">ฝากเงิน</Dialog.Title>}
        subtitle={
          <p id="deposit-sheet-desc" className="mt-1 text-sm text-[var(--text-secondary)]">
            เลือกช่องทางการฝากเงิน
          </p>
        }
      />

      <ul className="mt-6 flex flex-col gap-3 overflow-y-auto pb-2" aria-label="ช่องทางฝากเงิน">
        {DEPOSIT_METHOD_OPTIONS.map((method) => (
          <li key={method.id}>
            <button
              type="button"
              className={`${COSMIC_SHEET_SOFT_GLASS_INTERACTIVE} flex w-full items-center gap-3 px-3 py-3.5 sm:px-4 sm:py-4`}
              onClick={() => onSelectMethod(method.id)}
            >
              <DepositMethodIcon methodId={method.id} className="h-12 w-12 shrink-0 sm:h-[52px] sm:w-[52px]" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-[var(--text-primary)] sm:text-base">
                  {method.title}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">{method.subtitle}</span>
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--icon-default)]" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function DepositBankStep({
  amount,
  amountInput,
  copied,
  onBack,
  onQuickAmount,
  onAmountChange,
  onCopyAccount,
  onEdit,
  onNext,
}: {
  amount: number;
  amountInput: string;
  copied: boolean;
  onBack: () => void;
  onQuickAmount: (value: number) => void;
  onAmountChange: (raw: string) => void;
  onCopyAccount: () => void;
  onEdit: () => void;
  onNext: () => void;
}) {
  const bank = DEPOSIT_BANK_ACCOUNT_MOCK;
  const canProceed = amount > 0;

  return (
    <>
      <ResponsiveSheetHeader
        closeAriaLabel="ปิดหน้าฝากเงิน"
        onBack={onBack}
        backAriaLabel="กลับเลือกช่องทางฝาก"
        title={
          <Dialog.Title className="text-base font-medium sm:text-lg">ฝากผ่านบัญชีธนาคาร</Dialog.Title>
        }
      />

      <div
        id="deposit-bank-desc"
        className="min-h-0 flex-1 overflow-y-auto pb-3"
      >
        <section className={`${COSMIC_SHEET_SOFT_GLASS} px-3 py-3.5 sm:px-4 sm:py-4`}>
          <div className="flex items-start gap-3">
            <KbankLogoGraphic className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)] sm:text-base">{bank.bankName}</p>
              <span className="mt-1 inline-flex rounded-full bg-[#5b21b6]/80 px-2 py-0.5 text-[10px] font-medium text-[#e9d5ff]">
                {bank.sampleBadgeLabel}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-[var(--text-muted)]">เลขบัญชี</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="min-w-0 flex-1 text-lg font-medium tracking-wide text-[var(--text-primary)] sm:text-xl">
                  {bank.accountNumberDisplay}
                </p>
                <button
                  type="button"
                  onClick={onCopyAccount}
                  className="glass-control glass-icon-btn !h-9 !w-9 shrink-0 text-[var(--icon-default)]"
                  aria-label="คัดลอกเลขบัญชี"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
              {copied && (
                <p className="mt-1 text-[11px] text-[var(--success)]" role="status">
                  คัดลอกแล้ว
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">ชื่อบัญชี</p>
              <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{bank.accountName}</p>
            </div>
          </div>
        </section>

        <div className="mt-4">
          <label htmlFor="deposit-amount" className="text-xs font-medium text-[var(--text-secondary)]">
            จำนวนเงินที่ต้องการฝาก
          </label>
          <div className={`${COSMIC_SHEET_FIELD_AMOUNT} mt-2`}>
            <span className="cosmic-sheet-field__addon px-3 text-lg font-medium text-[var(--text-secondary)]">
              ฿
            </span>
            <input
              id="deposit-amount"
              type="text"
              inputMode="numeric"
              value={amountInput}
              onChange={(event) => onAmountChange(event.target.value)}
              className="min-w-0 flex-1 bg-transparent px-3 text-2xl font-medium text-[var(--text-primary)] outline-none"
              aria-label="จำนวนเงินที่ต้องการฝาก"
            />
            <span className="shrink-0 px-3 text-sm text-[var(--text-muted)]">บาท</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-[var(--text-secondary)]">เลือกยอดเงินด่วน</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {DEPOSIT_QUICK_AMOUNTS.map((value) => {
              const active = amount === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onQuickAmount(value)}
                  className={`${COSMIC_CHOICE_BTN} py-2.5 text-sm ${active ? "is-active" : ""}`}
                >
                  {formatDepositAmount(value)}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">
            เลือกยอดเงินหรือกรอกจำนวนที่ต้องการ
          </p>
        </div>
      </div>

      <div className="mt-auto shrink-0 pt-3">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 px-1 py-2.5 text-sm font-medium text-[var(--text-primary)] underline-offset-2 hover:underline"
          >
            แก้ไข
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={onNext}
            className={`${COSMIC_SHEET_SUBMIT} min-w-0 flex-1 !w-auto`}
          >
            ถัดไป
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function DepositConfirmStep({
  amount,
  copied,
  slipFileName,
  slipInputRef,
  submitting,
  submitMessage,
  onBack,
  onCopyAccount,
  onSlipChange,
  onPickSlip,
  onConfirm,
}: {
  amount: number;
  copied: boolean;
  slipFileName: string | null;
  slipInputRef: React.RefObject<HTMLInputElement | null>;
  submitting: boolean;
  submitMessage: string | null;
  onBack: () => void;
  onCopyAccount: () => void;
  onSlipChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPickSlip: () => void;
  onConfirm: () => void;
}) {
  const bank = DEPOSIT_BANK_ACCOUNT_MOCK;

  return (
    <>
      <ResponsiveSheetHeader
        closeAriaLabel="ปิดหน้าฝากเงิน"
        onBack={onBack}
        backAriaLabel="กลับแก้ไขยอดฝาก"
        title={<Dialog.Title className="text-base font-medium sm:text-lg">ยืนยันการฝากเงิน</Dialog.Title>}
        subtitle={<p className="mt-0.5 text-xs text-[var(--text-muted)]">ขั้นตอน 3 จาก 3</p>}
      />

      <div
        id="deposit-confirm-desc"
        className="min-h-0 flex-1 overflow-y-auto pb-3"
      >
        <section className={`${COSMIC_SHEET_SOFT_GLASS} px-3 py-3.5 text-center sm:px-4`}>
          <p className="text-xs text-[var(--text-secondary)]">ยอดเงินที่ต้องโอน</p>
          <p className="mt-1 text-3xl font-medium text-[var(--accent-muted)] sm:text-4xl">
            ฿ {formatDepositTransferAmount(amount)}
          </p>
        </section>

        <section className={`${COSMIC_SHEET_SOFT_GLASS} mt-3 px-3 py-3 sm:px-4 sm:py-3.5`}>
          <div className="flex items-start gap-3">
            <KbankLogoGraphic className="h-10 w-10 shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5 text-sm">
              <p className="font-medium text-[var(--text-primary)]">{bank.bankName}</p>
              <p className="text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">ชื่อบัญชี: </span>
                {bank.accountName}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[var(--text-secondary)]">
                  <span className="text-[var(--text-muted)]">เลขบัญชี: </span>
                  <span className="font-medium text-[var(--text-primary)]">{bank.accountNumberDisplay}</span>
                </p>
                <button
                  type="button"
                  onClick={onCopyAccount}
                  className="glass-control glass-icon-btn !h-8 !w-8 text-[var(--icon-default)]"
                  aria-label="คัดลอกเลขบัญชี"
                >
                  <CopyIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-[var(--success)]" role="status">
                  คัดลอกแล้ว
                </p>
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-[var(--text-muted)]">ข้อมูลบัญชีเป็นตัวอย่าง</p>
        </section>

        <section className="mt-4">
          <p className="text-sm font-medium text-[var(--text-primary)]">แนบสลิปการโอน</p>
          <input
            ref={slipInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onSlipChange}
          />
          <button
            type="button"
            onClick={onPickSlip}
            className={`${COSMIC_SHEET_SOFT_GLASS_INTERACTIVE} mt-2 flex w-full items-center gap-3 px-3 py-3.5 sm:px-4`}
          >
            <SlipPlaceholderIcon className="h-10 w-10 shrink-0 text-[var(--icon-default)]" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-[var(--text-primary)]">
                {slipFileName ?? "แตะเพื่อแนบสลิป"}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                {slipFileName ? "เปลี่ยนรูปได้โดยแตะอีกครั้ง" : "เลือกรูปภาพจากอุปกรณ์"}
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)]/60 text-lg font-medium text-[var(--text-primary)]">
              +
            </span>
          </button>
          <p className="mt-2 text-[11px] text-[var(--text-muted)]">แนบสลิปหลังโอนเงินเรียบร้อยแล้ว</p>
        </section>

        {submitMessage && (
          <p
            className="mt-3 rounded-[var(--radius-control)] bg-[#0f3d2e]/80 px-3 py-2 text-xs text-[var(--success)] sm:text-sm"
            role="status"
          >
            {submitMessage}
          </p>
        )}
      </div>

      <div className="mt-auto shrink-0 border-t border-[var(--border-subtle)]/40 pt-3">
        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className={COSMIC_SHEET_SUBMIT}
        >
          {submitting ? "กำลังส่ง..." : "ยืนยันการฝากเงิน"}
        </button>
      </div>
    </>
  );
}

function SlipPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="6" y="8" width="28" height="24" rx="3" fill="currentColor" opacity="0.2" />
      <circle cx="14" cy="16" r="3" fill="currentColor" opacity="0.45" />
      <path d="M6 26l8-6 6 4 8-10 6 8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
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

function DepositMethodIcon({ methodId, className }: { methodId: DepositMethodId; className?: string }) {
  const frame =
    "cosmic-sheet-icon-well cosmic-inset-card flex shrink-0 items-center justify-center rounded-[var(--radius-panel)]";

  const iconClass = "h-7 w-7 sm:h-8 sm:w-8 text-white";

  if (methodId === "bank") {
    return (
      <span className={`${frame} ${className ?? ""}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M3 10h18" strokeLinecap="round" />
          <path d="M5 10V18M9 10V18M15 10V18M19 10V18" strokeLinecap="round" />
          <path d="M4 18h16" strokeLinecap="round" />
          <path d="M12 4 3 10h18L12 4Z" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  if (methodId === "gateway") {
    return (
      <span className={`${frame} ${className ?? ""}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h4" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  return (
    <span className={`${frame} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="4" y="7" width="16" height="11" rx="2" />
        <path d="M4 11h16" />
        <circle cx="16" cy="14" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}
