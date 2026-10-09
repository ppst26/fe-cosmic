"use client";

import React from "react";
import { Dialog } from "radix-ui";
import {
  BankBuildingIcon,
  BroadcastChannelIcon,
  ChevronRightIcon,
} from "../ui/Icons";
import { SignUpStepTwoData } from "../../types/signup";
import {
  getSignUpBankById,
  getSignUpChannelById,
} from "../../data/signupMockData";
import {
  COSMIC_BTN_PRIMARY,
  COSMIC_SHEET_FIELD_ROW,
  COSMIC_SHEET_SOFT_GLASS_INTERACTIVE,
} from "../ui/cosmicButtonClasses";
import { ModalDesktopTitleBlock } from "../ui/ModalTitleLeadingIcon";
import {
  BANK_ACCOUNT_MAX_DIGITS,
  PERSON_NAME_MAX_LENGTH,
  sanitizeBankAccount,
  sanitizePersonName,
} from "@/lib/fieldInput";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * ช่องกรอกแบบไม่มีไอคอน — ชื่อ / เลขบัญชี
 */
function SignUpPlainInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <div className={COSMIC_SHEET_FIELD_ROW}>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
        />
      </div>
    </div>
  );
}

/**
 * ปุ่มเปิด picker — ธนาคาร / ช่องทาง
 */
function SignUpPickerTrigger({
  id,
  label,
  placeholder,
  valueLabel,
  icon,
  onClick,
}: {
  id: string;
  label: string;
  placeholder: string;
  valueLabel?: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  const hasValue = Boolean(valueLabel);

  return (
    <div className="space-y-1.5">
      <span id={`${id}-label`} className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </span>
      <button
        type="button"
        id={id}
        aria-labelledby={`${id}-label`}
        onClick={onClick}
        className={`${COSMIC_SHEET_SOFT_GLASS_INTERACTIVE} flex h-12 w-full items-center gap-2.5 px-3 text-left outline-none focus-visible:outline-none`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)] text-[var(--icon-default)]">
          {icon}
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-sm ${
            hasValue ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
          }`}
        >
          {hasValue ? valueLabel : placeholder}
        </span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--icon-default)]" />
      </button>
    </div>
  );
}

interface SignUpStepTwoProps {
  formId: string;
  data: SignUpStepTwoData;
  onChange: (patch: Partial<SignUpStepTwoData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  onOpenBankPicker: () => void;
  onOpenChannelPicker: () => void;
  isSubmitting?: boolean;
}

/**
 * Step 2 — ชื่อ-นามสกุล, บัญชีธนาคาร, เลือกธนาคารและช่องทาง
 * ถูกเรียกจาก SignUpBottomDrawer
 */
export function SignUpStepTwo({
  formId,
  data,
  onChange,
  onBack,
  onSubmit,
  onOpenBankPicker,
  onOpenChannelPicker,
  isSubmitting = false,
}: SignUpStepTwoProps) {
  const t = useT("auth");
  const tCommon = useT("common");
  const selectedBank = getSignUpBankById(data.bankId);
  const selectedChannel = getSignUpChannelById(data.channelId);

  return (
    <form
        id={formId}
        className="flex flex-col gap-4 pb-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ModalDesktopTitleBlock
          titleIconId="profile"
          title={
            <Dialog.Title className="text-2xl font-medium text-[var(--text-primary)]">
              {t("signUp")}
            </Dialog.Title>
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <SignUpPlainInput
            id="signup-first-name"
            label={t("fields.firstName")}
            value={data.firstName}
            onChange={(firstName) => onChange({ firstName: sanitizePersonName(firstName) })}
            placeholder={t("fields.firstName")}
            autoComplete="given-name"
            maxLength={PERSON_NAME_MAX_LENGTH}
          />
          <SignUpPlainInput
            id="signup-last-name"
            label={t("fields.lastName")}
            value={data.lastName}
            onChange={(lastName) => onChange({ lastName: sanitizePersonName(lastName) })}
            placeholder={t("fields.lastName")}
            autoComplete="family-name"
            maxLength={PERSON_NAME_MAX_LENGTH}
          />
        </div>

        <SignUpPlainInput
          id="signup-bank-account"
          label={t("fields.bankAccount")}
          value={data.bankAccountNumber}
          onChange={(bankAccountNumber) =>
            onChange({ bankAccountNumber: sanitizeBankAccount(bankAccountNumber) })
          }
          placeholder={t("fields.bankAccountPlaceholder")}
          inputMode="numeric"
          maxLength={BANK_ACCOUNT_MAX_DIGITS}
          autoComplete="off"
        />

        <SignUpPickerTrigger
          id="signup-bank"
          label={t("fields.bank")}
          placeholder={t("fields.bankPlaceholder")}
          valueLabel={selectedBank?.label}
          icon={<BankBuildingIcon className="h-4 w-4" />}
          onClick={() => onOpenBankPicker()}
        />

        <SignUpPickerTrigger
          id="signup-channel"
          label={t("fields.channel")}
          placeholder={t("fields.channelPlaceholder")}
          valueLabel={selectedChannel?.label}
          icon={<BroadcastChannelIcon className="h-4 w-4" />}
          onClick={() => onOpenChannelPicker()}
        />

        <div className="mt-2 grid grid-cols-[2fr_3fr] gap-3">
          <button
            type="button"
            onClick={onBack}
            className="glass-control glass-pill !min-h-12 w-full text-sm font-medium text-[var(--text-secondary)]"
          >
            {tCommon("back")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${COSMIC_BTN_PRIMARY} !h-12 !min-h-12 text-sm`}
          >
            {isSubmitting ? t("signUpSheet.submitting") : t("signUp")}
          </button>
        </div>
      </form>
  );
}
