"use client";

import React, { useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";
import { MONEY_AMOUNT_MAX_DIGITS, sanitizeMoneyAmount } from "@/lib/fieldInput";
import { submitDeposit } from "@/lib/api/deposit";
import {
  useDepositBankAccount,
  useDepositMethods,
  useDepositQuickAmounts,
} from "@/app/hooks/api/money";
import { ResourceGate } from "../ui/ResourceGate";
import type { DepositBankAccountMock } from "@/app/types/wallet";
import { ChevronRightIcon, CopyIcon } from "../ui/Icons";
import { ResponsiveSheetHeader, ResponsiveSheetTitleNotch } from "../ui/ResponsiveSheetHeader";
import {
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
  COSMIC_BTN_PRIMARY,
} from "../ui/cosmicButtonClasses";
import { formatDepositAmount, formatDepositTransferAmount } from "@/lib/format";
import type { DepositMethodId } from "@/app/types/wallet";
import { useWallet } from "@/app/hooks/api/account";
import { valueClass } from "@/lib/semanticValue";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

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
  const t = useT("wallet");
  /** โหลดตั้งแต่ mount (sheet ถูก mount ไว้ใน DepositProvider) — ถึง step บัญชีข้อมูลพร้อมแล้ว */
  const quick = useDepositQuickAmounts();
  const bankAccount = useDepositBankAccount();
  const wallet = useWallet();
  const defaultAmount = quick.data?.defaultAmount ?? 0;
  const [step, setStep] = useState<DepositSheetStep>("methods");
  const [amount, setAmount] = useState(defaultAmount);
  const [amountInput, setAmountInput] = useState(defaultAmount ? String(defaultAmount) : "");

  /** ยอดเริ่มต้นมาถึงหลัง mount — ตั้งค่าฟอร์มครั้งเดียวต่อค่า (ปรับระหว่าง render) */
  const [seededDefault, setSeededDefault] = useState(defaultAmount);
  if (seededDefault !== defaultAmount) {
    setSeededDefault(defaultAmount);
    setAmount(defaultAmount);
    setAmountInput(String(defaultAmount));
  }
  const [copied, setCopied] = useState(false);
  const [slipFileName, setSlipFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [finalConfirmOpen, setFinalConfirmOpen] = useState(false);
  const slipInputRef = useRef<HTMLInputElement>(null);

  const resetFlow = () => {
    setStep("methods");
    setAmount(defaultAmount);
    setAmountInput(defaultAmount ? String(defaultAmount) : "");
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
      if (!bankAccount.data) return;
      await navigator.clipboard.writeText(bankAccount.data.accountNumberCopy);
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
    const result = await submitDeposit({ amount, methodId: "bank" });
    setSubmitting(false);
    if (!result.ok) {
      setFinalConfirmOpen(false);
      setSubmitMessage(result.error);
      return;
    }
    setFinalConfirmOpen(false);
    wallet.refresh();
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
          {step === "methods" && <DepositMethodsStep onSelectMethod={handleSelectMethod} />}
          {step === "bank" && (
            <ResourceGate resource={bankAccount} loadingLabel={t("deposit.bankAccountLoading")} errorTitle={t("deposit.bankAccountError")}>
              {(bank) => (
            <DepositBankStep
              bank={bank}
              quickAmounts={quick.data?.amounts ?? []}
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
            </ResourceGate>
          )}
          {step === "confirm" && (
            <ResourceGate resource={bankAccount} loadingLabel={t("deposit.bankAccountLoading")} errorTitle={t("deposit.bankAccountError")}>
              {(bank) => (
            <DepositConfirmStep
              bank={bank}
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
            </ResourceGate>
          )}

        </Dialog.Content>
      </Dialog.Portal>

      <CosmicConfirmDialog
        open={finalConfirmOpen}
        onOpenChange={setFinalConfirmOpen}
        variant="neutral"
        title={t("deposit.finalConfirm.title")}
        description={t("deposit.finalConfirm.description")}
        confirmLabel={t("deposit.finalConfirm.confirm")}
        loading={submitting}
        summary={
          <p className="text-center text-sm font-medium text-[var(--text-primary)]">
            {t("deposit.finalConfirm.amountLabel")}{" "}
            <span className={valueClass("emphasis")}>฿ {formatDepositTransferAmount(amount)}</span>
          </p>
        }
        onConfirm={handleConfirmDeposit}
      />
    </Dialog.Root>
  );
}

function DepositMethodsStep({ onSelectMethod }: { onSelectMethod: (id: DepositMethodId) => void }) {
  const t = useT("wallet");
  const methods = useDepositMethods();
  return (
    <>
      <ResponsiveSheetTitleNotch>
        <ResponsiveSheetHeader
          closeAriaLabel={t("deposit.close")}
          titleIconSrc="/assets/deposit/Wallet2.avif"
          titleIconDesktopOnly={false}
          title={<Dialog.Title className="text-xl font-medium sm:text-2xl">{t("deposit.title")}</Dialog.Title>}
          subtitle={
            <p id="deposit-sheet-desc" className="mt-1 text-sm text-[var(--text-secondary)]">
              {t("deposit.selectMethod")}
            </p>
          }
        />
      </ResponsiveSheetTitleNotch>

      <ResourceGate resource={methods} loadingLabel={t("deposit.methodsLoading")} errorTitle={t("deposit.methodsError")}>
        {(methodList) => (
      <ul className="mt-6 flex flex-col gap-3 overflow-y-auto pb-2" aria-label={t("deposit.methodsAria")}>
        {methodList.map((method) => (
          <li key={method.id}>
            <button
              type="button"
              className={`${COSMIC_SHEET_SOFT_GLASS_INTERACTIVE} flex w-full items-center gap-3.5 px-3.5 py-3.5 text-left sm:gap-4 sm:px-4 sm:py-4`}
              onClick={() => onSelectMethod(method.id)}
            >
              <DepositMethodIcon methodId={method.id} className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
              <span className="min-w-0 flex-1 text-sm font-medium text-[var(--text-primary)] sm:text-base">
                {t(method.titleKey)}
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--icon-default)]" />
            </button>
          </li>
        ))}
      </ul>
        )}
      </ResourceGate>
    </>
  );
}

function DepositBankStep({
  bank,
  quickAmounts,
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
  bank: DepositBankAccountMock;
  quickAmounts: number[];
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
  const t = useT("wallet");
  const canProceed = amount > 0;

  return (
    <>
      <ResponsiveSheetTitleNotch>
        <ResponsiveSheetHeader
          closeAriaLabel={t("deposit.close")}
          onBack={onBack}
          backAriaLabel={t("deposit.bank.back")}
          title={
            <Dialog.Title className="cosmic-type-sheet-title">{t("deposit.bank.title")}</Dialog.Title>
          }
        />
      </ResponsiveSheetTitleNotch>

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
                  <span className="cosmic-type-sheet-meta shrink-0">{t("deposit.bank.bankLabel")}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)] sm:text-base truncate">
                    {bank.bankName}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="cosmic-type-sheet-meta shrink-0">{t("deposit.bank.accountName")}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {bank.accountName}
                  </span>
                </div>
              </div>

              <div>
                <span className="cosmic-type-sheet-meta">{t("deposit.bank.accountNumber")}</span>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="min-w-0 text-base font-medium tracking-wider text-[var(--text-primary)] sm:text-lg select-all">
                    {bank.accountNumberDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={onCopyAccount}
                    className="glass-control glass-icon-btn !h-8 !w-8 shrink-0 text-[var(--icon-default)] hover:text-white cursor-pointer active:scale-95 transition-all"
                    aria-label={t("shared.copyAccountNumber")}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-xs text-[var(--success)]" role="status">
                    {t("shared.copied")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4">
          <label htmlFor="deposit-amount" className="cosmic-type-sheet-label">
            {t("deposit.bank.amountLabel")}
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
              aria-label={t("deposit.bank.amountLabel")}
            />
            <span className="shrink-0 px-3 text-sm text-[var(--text-muted)]">{t("shared.currencyUnit")}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="cosmic-type-sheet-label">{t("deposit.bank.quickAmount")}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {quickAmounts.map((value) => {
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
            {t("deposit.bank.quickAmountHint")}
          </p>
        </div>
      </div>

      <div className="mt-auto shrink-0 pt-3">
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className={COSMIC_BTN_PRIMARY}
        >
          {t("deposit.bank.next")}
        </button>
      </div>
    </>
  );
}

function DepositConfirmStep({
  bank,
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
  bank: DepositBankAccountMock;
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
  const t = useT("wallet");
  return (
    <>
      <ResponsiveSheetTitleNotch>
        <ResponsiveSheetHeader
          closeAriaLabel={t("deposit.close")}
          onBack={onBack}
          backAriaLabel={t("deposit.confirm.back")}
          title={<Dialog.Title className="cosmic-type-sheet-title">{t("deposit.confirm.title")}</Dialog.Title>}
          subtitle={<p className="cosmic-type-sheet-meta mt-0.5">{t("deposit.confirm.step", { current: 3, total: 3 })}</p>}
        />
      </ResponsiveSheetTitleNotch>

      <div
        id="deposit-confirm-desc"
        className="min-h-0 flex-1 overflow-y-auto pb-3"
      >
        <section className={`${COSMIC_SHEET_SOFT_GLASS} px-3 py-3.5 text-center sm:px-4`}>
          <p className="cosmic-type-sheet-desc">{t("deposit.confirm.transferAmount")}</p>
          <p className={valueClass("emphasis", "mt-1 text-3xl sm:text-4xl")}>
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
                <span className="text-[var(--text-muted)]">{t("deposit.confirm.accountNameLabel")}</span>
                {bank.accountName}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[var(--text-secondary)]">
                  <span className="text-[var(--text-muted)]">{t("deposit.confirm.accountNumberLabel")}</span>
                  <span className="font-medium text-[var(--text-primary)]">{bank.accountNumberDisplay}</span>
                </p>
                <button
                  type="button"
                  onClick={onCopyAccount}
                  className="glass-control glass-icon-btn !h-8 !w-8 text-[var(--icon-default)]"
                  aria-label={t("shared.copyAccountNumber")}
                >
                  <CopyIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-[var(--success)]" role="status">
                  {t("shared.copied")}
                </p>
              )}
            </div>
          </div>
          <p className="cosmic-type-sheet-desc mt-3 text-center">{t("deposit.confirm.sampleNote")}</p>
        </section>

        <section className="mt-4">
          <p className="text-sm font-medium text-[var(--text-primary)]">{t("deposit.confirm.slipTitle")}</p>
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
                {slipFileName ?? t("deposit.confirm.slipPick")}
              </span>
              <span className="cosmic-type-sheet-meta mt-0.5 block">
                {slipFileName ? t("deposit.confirm.slipChange") : t("deposit.confirm.slipFromDevice")}
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)]/60 text-lg font-medium text-[var(--text-primary)]">
              +
            </span>
          </button>
          <p className="cosmic-type-sheet-desc mt-2">{t("deposit.confirm.slipHint")}</p>
        </section>

        {submitMessage && (
          <p
            className="mt-3 rounded-[var(--radius-control)] bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] px-3 py-2 text-xs text-[var(--destructive)] sm:text-sm"
            role="alert"
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
          className={COSMIC_BTN_PRIMARY}
        >
          {submitting ? t("shared.submitting") : t("deposit.confirm.submit")}
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

const DEPOSIT_METHOD_ASSETS: Record<DepositMethodId, { src: string; altKey: MessageKey<"wallet"> }> = {
  bank: {
    src: "/assets/deposit/bank.avif",
    altKey: "deposit.methods.bank.title",
  },
  gateway: {
    src: "/assets/deposit/payment.avif",
    altKey: "deposit.methods.gateway.title",
  },
  truemoney: {
    src: "/assets/deposit/trueWallet.avif",
    altKey: "deposit.methods.truemoney.title",
  },
};

function DepositMethodIcon({ methodId, className }: { methodId: DepositMethodId; className?: string }) {
  const t = useT("wallet");
  const asset = DEPOSIT_METHOD_ASSETS[methodId];
  if (!asset) return null;

  return (
    <img
      src={asset.src}
      alt={t(asset.altKey)}
      className={cn(
        "h-8 w-8 shrink-0 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:h-9 sm:w-9",
        className,
      )}
    />
  );
}
