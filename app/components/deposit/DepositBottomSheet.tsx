"use client";

import React, { useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";
import { MONEY_AMOUNT_MAX_DIGITS, sanitizeMoneyAmount } from "@/lib/fieldInput";
import {
  type DepositMethodId,
} from "@/app/data/depositMockData";
import {
  fetchDepositBankAccount,
  fetchDepositMethods,
  fetchDepositQuickAmounts,
  submitDeposit,
} from "@/lib/api/deposit";
import { ChevronRightIcon, CopyIcon } from "../ui/Icons";
import { ResponsiveSheetHeader } from "../ui/ResponsiveSheetHeader";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { CosmicConfirmDialog } from "../ui/CosmicConfirmDialog";
import {
  COSMIC_CHOICE_BTN,
  COSMIC_SHEET_FIELD_AMOUNT,
  COSMIC_SHEET_FIELD_ROW,
  COSMIC_SHEET_SOFT_GLASS,
  COSMIC_SHEET_SOFT_GLASS_INTERACTIVE,
  COSMIC_BTN_CONFIRM_TEXT,
  COSMIC_SHEET_SUBMIT,
} from "../ui/cosmicButtonClasses";
import { formatDepositAmount, formatDepositTransferAmount } from "@/lib/format";

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
  const quick = fetchDepositQuickAmounts();
  const [step, setStep] = useState<DepositSheetStep>("methods");
  const [amount, setAmount] = useState(quick.defaultAmount);
  const [amountInput, setAmountInput] = useState(String(quick.defaultAmount));
  const [copied, setCopied] = useState(false);
  const [slipFileName, setSlipFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [finalConfirmOpen, setFinalConfirmOpen] = useState(false);
  const slipInputRef = useRef<HTMLInputElement>(null);

  const resetFlow = () => {
    setStep("methods");
    setAmount(quick.defaultAmount);
    setAmountInput(String(quick.defaultAmount));
    setCopied(false);
    setSlipFileName(null);
    setSubmitting(false);
    setSubmitMessage(null);
    setFinalConfirmOpen(false);
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
    const digits = sanitizeMoneyAmount(raw);
    setAmountInput(digits);
    const parsed = digits ? Number.parseInt(digits, 10) : 0;
    setAmount(parsed);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(fetchDepositBankAccount().accountNumberCopy);
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

  const handleConfirmDeposit = async () => {
    if (amount <= 0) return;
    setSubmitting(true);
    setSubmitMessage(null);
    await submitDeposit({ amount, methodId: "bank" });
    setSubmitting(false);
    setFinalConfirmOpen(false);
    onCompleted?.(amount);
    onClose();
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
              onConfirm={() => setFinalConfirmOpen(true)}
            />
          )}

        </Dialog.Content>
      </Dialog.Portal>

      <CosmicConfirmDialog
        open={finalConfirmOpen}
        onOpenChange={setFinalConfirmOpen}
        variant="neutral"
        title="ยืนยันส่งคำขอฝากเงิน?"
        description="ตรวจสอบยอดและสลิปก่อนส่งคำขอให้ระบบตรวจสอบ"
        confirmLabel="ส่งคำขอฝาก"
        loading={submitting}
        summary={
          <p className="text-center text-sm font-medium text-[var(--text-primary)]">
            ยอดฝาก{" "}
            <span className="text-[var(--accent-muted)]">฿ {formatDepositTransferAmount(amount)}</span>
          </p>
        }
        onConfirm={handleConfirmDeposit}
      />
    </Dialog.Root>
  );
}

function DepositMethodsStep({ onSelectMethod }: { onSelectMethod: (id: DepositMethodId) => void }) {
  const methods = fetchDepositMethods();
  return (
    <>
      <ResponsiveSheetHeader
        closeAriaLabel="ปิดหน้าฝากเงิน"
        titleIconSrc="/assets/deposit/Wallet2.avif"
        titleIconDesktopOnly={false}
        title={<Dialog.Title className="text-xl font-medium sm:text-2xl">ฝากเงิน</Dialog.Title>}
        subtitle={
          <p id="deposit-sheet-desc" className="mt-1 text-sm text-[var(--text-secondary)]">
            เลือกช่องทางการฝากเงิน
          </p>
        }
      />

      <ul className="mt-6 flex flex-col gap-3 overflow-y-auto pb-2" aria-label="ช่องทางฝากเงิน">
        {methods.map((method) => (
          <li key={method.id}>
            <button
              type="button"
              className={`${COSMIC_SHEET_SOFT_GLASS_INTERACTIVE} flex w-full items-center gap-3.5 px-3.5 py-3.5 text-left sm:gap-4 sm:px-4 sm:py-4`}
              onClick={() => onSelectMethod(method.id)}
            >
              <DepositMethodIcon methodId={method.id} className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
              <span className="min-w-0 flex-1 text-sm font-medium text-[var(--text-primary)] sm:text-base">
                {method.title}
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
  const bank = fetchDepositBankAccount();
  const canProceed = amount > 0;

  return (
    <>
      <ResponsiveSheetHeader
        closeAriaLabel="ปิดหน้าฝากเงิน"
        onBack={onBack}
        backAriaLabel="กลับเลือกช่องทางฝาก"
        title={
          <Dialog.Title className="cosmic-type-sheet-title">ฝากผ่านบัญชีธนาคาร</Dialog.Title>
        }
      />

      <div
        id="deposit-bank-desc"
        className="min-h-0 flex-1 overflow-y-auto pb-3"
      >
        <section className={`${COSMIC_SHEET_SOFT_GLASS} p-3.5 sm:p-4`}>
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="shrink-0 flex items-center justify-center">
              <img
                src="/assets/bank-logo/KBANK.webp"
                alt={bank.bankName}
                className="h-16 w-16 sm:h-[72px] sm:w-[72px] object-contain rounded-xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
              />
            </div>

            <div className="min-w-0 flex-1 flex flex-col justify-center gap-2.5">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="cosmic-type-sheet-meta shrink-0">ธนาคาร</span>
                  <span className="text-sm font-medium text-[var(--text-primary)] sm:text-base truncate">
                    {bank.bankName}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="cosmic-type-sheet-meta shrink-0">ชื่อบัญชี</span>
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {bank.accountName}
                  </span>
                </div>
              </div>

              <div>
                <span className="cosmic-type-sheet-meta">เลขที่บัญชี</span>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="min-w-0 text-base font-medium tracking-wider text-[var(--text-primary)] sm:text-lg select-all">
                    {bank.accountNumberDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={onCopyAccount}
                    className="glass-control glass-icon-btn !h-8 !w-8 shrink-0 text-[var(--icon-default)] hover:text-white cursor-pointer active:scale-95 transition-all"
                    aria-label="คัดลอกเลขบัญชี"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-xs text-[var(--success)]" role="status">
                    คัดลอกแล้ว
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4">
          <label htmlFor="deposit-amount" className="cosmic-type-sheet-label">
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
              maxLength={MONEY_AMOUNT_MAX_DIGITS}
              onChange={(event) => onAmountChange(event.target.value)}
              className="input-keep-size min-w-0 flex-1 bg-transparent px-3 text-2xl font-medium text-[var(--text-primary)] outline-none"
              aria-label="จำนวนเงินที่ต้องการฝาก"
            />
            <span className="shrink-0 px-3 text-sm text-[var(--text-muted)]">บาท</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="cosmic-type-sheet-label">เลือกยอดเงินด่วน</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {fetchDepositQuickAmounts().amounts.map((value) => {
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
          <p className="cosmic-type-sheet-desc mt-2 text-center">
            เลือกยอดเงินหรือกรอกจำนวนที่ต้องการ
          </p>
        </div>
      </div>

      <div className="mt-auto shrink-0 pt-3">
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className={COSMIC_SHEET_SUBMIT}
        >
          <span className={COSMIC_BTN_CONFIRM_TEXT}>ถัดไป</span>
        </button>
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
  const bank = fetchDepositBankAccount();

  return (
    <>
      <ResponsiveSheetHeader
        closeAriaLabel="ปิดหน้าฝากเงิน"
        onBack={onBack}
        backAriaLabel="กลับแก้ไขยอดฝาก"
        title={<Dialog.Title className="cosmic-type-sheet-title">ยืนยันการฝากเงิน</Dialog.Title>}
        subtitle={<p className="cosmic-type-sheet-meta mt-0.5">ขั้นตอน 3 จาก 3</p>}
      />

      <div
        id="deposit-confirm-desc"
        className="min-h-0 flex-1 overflow-y-auto pb-3"
      >
        <section className={`${COSMIC_SHEET_SOFT_GLASS} px-3 py-3.5 text-center sm:px-4`}>
          <p className="cosmic-type-sheet-desc">ยอดเงินที่ต้องโอน</p>
          <p className="mt-1 text-3xl font-medium text-[var(--accent-muted)] sm:text-4xl">
            ฿ {formatDepositTransferAmount(amount)}
          </p>
        </section>

        <section className={`${COSMIC_SHEET_SOFT_GLASS} mt-3 px-3 py-3 sm:px-4 sm:py-3.5`}>
          <div className="flex items-start gap-3">
            <img
              src="/assets/bank-logo/KBANK.webp"
              alt={bank.bankName}
              className="h-10 w-10 shrink-0 object-contain rounded-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            />
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
                <p className="text-xs text-[var(--success)]" role="status">
                  คัดลอกแล้ว
                </p>
              )}
            </div>
          </div>
          <p className="cosmic-type-sheet-desc mt-3 text-center">ข้อมูลบัญชีเป็นตัวอย่าง</p>
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
              <span className="cosmic-type-sheet-meta mt-0.5 block">
                {slipFileName ? "เปลี่ยนรูปได้โดยแตะอีกครั้ง" : "เลือกรูปภาพจากอุปกรณ์"}
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)]/60 text-lg font-medium text-[var(--text-primary)]">
              +
            </span>
          </button>
          <p className="cosmic-type-sheet-desc mt-2">แนบสลิปหลังโอนเงินเรียบร้อยแล้ว</p>
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
          <span className={COSMIC_BTN_CONFIRM_TEXT}>
            {submitting ? "กำลังส่ง..." : "ยืนยันการฝากเงิน"}
          </span>
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



const DEPOSIT_METHOD_ASSETS: Record<DepositMethodId, { src: string; alt: string }> = {
  bank: {
    src: "/assets/deposit/bank.avif",
    alt: "บัญชีธนาคาร",
  },
  gateway: {
    src: "/assets/deposit/payment.avif",
    alt: "Payment Gateway",
  },
  truemoney: {
    src: "/assets/deposit/trueWallet.avif",
    alt: "ทรูวอลเล็ท",
  },
};

function DepositMethodIcon({ methodId, className }: { methodId: DepositMethodId; className?: string }) {
  const asset = DEPOSIT_METHOD_ASSETS[methodId];
  if (!asset) return null;

  return (
    <img
      src={asset.src}
      alt={asset.alt}
      className={cn(
        "h-8 w-8 shrink-0 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:h-9 sm:w-9",
        className,
      )}
    />
  );
}
