"use client";

import React, { useId, useState } from "react";
import { Dialog } from "radix-ui";
import {
  CloseIcon,
  CosmicbetLogo,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  PhoneIcon,
} from "../ui/Icons";
import { SignUpStep, SignUpStepOneData, SignUpStepTwoData } from "../../types/signup";
import { SignUpStepTwo } from "./SignUpStepTwo";
import {
  SignUpPickerGridItem,
  SignUpPickerSheet,
} from "./SignUpPickerSheet";
import { useSignUpOptions } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { COSMIC_SHEET_FIELD_ROW } from "../ui/cosmicButtonClasses";
import { CosmicStackedActionButton } from "../ui/CosmicStackedActionButton";
import {
  responsiveAuthSheetContentClass,
  responsiveSheetCloseButtonClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/context/ToastContext";
import { ModalDesktopTitleBlock } from "../ui/ModalTitleLeadingIcon";
import {
  isBankAccountNumber,
  isPasswordLengthOk,
  isPersonName,
  isThaiMobilePhone,
  PASSWORD_MAX_LENGTH,
  PHONE_DIGIT_LENGTH,
  sanitizePassword,
  sanitizePhone,
} from "@/lib/fieldInput";
import { useT } from "@/lib/i18n/I18nProvider";

interface SignUpBottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** เมื่อผู้ใช้กดเข้าสู่ระบบจากท้ายฟอร์ม */
  onLoginClick?: () => void;
}

const EMPTY_STEP_ONE: SignUpStepOneData = {
  phone: "",
  password: "",
  confirmPassword: "",
};

const EMPTY_STEP_TWO: SignUpStepTwoData = {
  firstName: "",
  lastName: "",
  bankAccountNumber: "",
  bankId: null,
  channelId: null,
};

/**
 * แบนเนอร์ด้านบน drawer — ข้อความต้อนรับ + ภาพประกอบ (decorative)
 */
function SignUpDrawerHero() {
  const t = useT("auth");
  return (
    <div className="relative min-h-[148px] overflow-hidden rounded-t-[var(--radius-panel)] sm:min-h-[160px]">
      <div
        className="absolute inset-0"
        style={{ background: "var(--surface-gradient)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-90 cosmic-intro-bg"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-2 px-4 pb-4 pt-10 sm:px-5">
        <CosmicbetLogo className="h-5 max-w-[90px] sm:h-6 sm:max-w-[100px]" />
        <p className="text-lg font-medium leading-tight text-[var(--text-primary)] sm:text-xl">
          {t("signUpSheet.welcome")}
        </p>
        <p className="cosmic-type-sheet-desc">
          {t("signUpSheet.tagline")}
        </p>
      </div>
    </div>
  );
}

/**
 * ช่องกรอกข้อมูลพร้อมไอคอนซ้าย
 */
function SignUpField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  leadingIcon,
  trailing,
  autoComplete,
  inputMode,
  maxLength,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  leadingIcon: React.ReactNode;
  trailing?: React.ReactNode;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <div className={COSMIC_SHEET_FIELD_ROW}>
        <span className="shrink-0 text-[var(--icon-default)]">{leadingIcon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
        />
        {trailing}
      </div>
    </div>
  );
}

/**
 * Step 1 — เบอร์โทร + รหัสผ่าน + ยืนยันรหัสผ่าน
 */
function SignUpStepOne({
  formId,
  data,
  onChange,
  onSubmit,
  onLoginClick,
}: {
  formId: string;
  data: SignUpStepOneData;
  onChange: (patch: Partial<SignUpStepOneData>) => void;
  onSubmit: () => void;
  onLoginClick?: () => void;
}) {
  const t = useT("auth");
  const tCommon = useT("common");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <ModalDesktopTitleBlock
        titleIconId="profile"
        title={
          <Dialog.Title className="text-2xl font-medium text-[var(--text-primary)]">{t("signUp")}</Dialog.Title>
        }
      />

      <SignUpField
        id="signup-phone"
        label={t("fields.phone")}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={data.phone}
        onChange={(phone) => onChange({ phone: sanitizePhone(phone) })}
        placeholder={t("fields.phonePlaceholder")}
        maxLength={PHONE_DIGIT_LENGTH}
        leadingIcon={<PhoneIcon className="h-5 w-5" />}
      />

      <SignUpField
        id="signup-password"
        label={t("fields.password")}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        value={data.password}
        onChange={(password) => onChange({ password: sanitizePassword(password) })}
        placeholder={t("fields.passwordPlaceholder")}
        maxLength={PASSWORD_MAX_LENGTH}
        leadingIcon={<LockIcon className="h-5 w-5" />}
        trailing={
          <button
            type="button"
            className="shrink-0 text-[var(--icon-default)] hover:text-[var(--icon-active)]"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t("fields.hidePassword") : t("fields.showPassword")}
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        }
      />

      <SignUpField
        id="signup-confirm"
        label={t("fields.confirmPassword")}
        type={showConfirm ? "text" : "password"}
        autoComplete="new-password"
        value={data.confirmPassword}
        onChange={(confirmPassword) => onChange({ confirmPassword: sanitizePassword(confirmPassword) })}
        placeholder={t("fields.confirmPasswordPlaceholder")}
        maxLength={PASSWORD_MAX_LENGTH}
        leadingIcon={<LockIcon className="h-5 w-5" />}
        trailing={
          <button
            type="button"
            className="shrink-0 text-[var(--icon-default)] hover:text-[var(--icon-active)]"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? t("fields.hidePassword") : t("fields.showPassword")}
          >
            {showConfirm ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        }
      />

      <CosmicStackedActionButton type="submit" className="mt-1" title={tCommon("next")} />

      <p className="text-center text-sm text-[var(--text-secondary)]">
        {t("signUpSheet.haveAccount")}{" "}
        <button
          type="button"
          className="font-medium text-[var(--border-active)] hover:text-[var(--icon-active)]"
          onClick={onLoginClick}
        >
          {t("login")}
        </button>
      </p>
    </form>
  );
}

/**
 * Bottom drawer สมัครสมาชิก — slide จากด้านล่าง, หลาย step
 * เปิดจาก Header SIGN UP / WelcomeBanner — ถูกเรียกใช้ใน app/page.tsx
 */
export function SignUpBottomDrawer({
  isOpen,
  onClose,
  onLoginClick,
}: SignUpBottomDrawerProps) {
  const formId = useId();
  const t = useT("auth");
  const { register } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState<SignUpStep>(1);
  const [stepOne, setStepOne] = useState<SignUpStepOneData>(EMPTY_STEP_ONE);
  const [stepTwo, setStepTwo] = useState<SignUpStepTwoData>(EMPTY_STEP_TWO);
  const [signUpPicker, setSignUpPicker] = useState<null | "bank" | "channel">(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signUpOptions = useSignUpOptions();

  const resetForm = () => {
    setStep(1);
    setStepOne(EMPTY_STEP_ONE);
    setStepTwo(EMPTY_STEP_TWO);
    setSignUpPicker(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const handleStepOneSubmit = () => {
    const phone = sanitizePhone(stepOne.phone);
    if (!isThaiMobilePhone(phone)) {
      showToast(t("validation.phone"), "error");
      return;
    }
    if (!isPasswordLengthOk(stepOne.password)) {
      showToast(t("validation.passwordLength"), "error");
      return;
    }
    if (stepOne.password !== stepOne.confirmPassword) {
      showToast(t("validation.passwordMismatch"), "error");
      return;
    }
    setStep(2);
  };

  const handleStepTwoSubmit = async () => {
    if (!isPersonName(stepTwo.firstName)) {
      showToast(t("validation.firstName"), "error");
      return;
    }
    if (!isPersonName(stepTwo.lastName)) {
      showToast(t("validation.lastName"), "error");
      return;
    }
    if (!isBankAccountNumber(stepTwo.bankAccountNumber)) {
      showToast(t("validation.bankAccount"), "error");
      return;
    }
    if (!stepTwo.bankId) {
      showToast(t("validation.bankRequired"), "error");
      return;
    }
    if (!stepTwo.channelId) {
      showToast(t("validation.channelRequired"), "error");
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      phone: sanitizePhone(stepOne.phone),
      password: stepOne.password,
      firstName: stepTwo.firstName.trim(),
      lastName: stepTwo.lastName.trim(),
      bankAccountNumber: stepTwo.bankAccountNumber,
      bankId: stepTwo.bankId,
      channelId: stepTwo.channelId,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      showToast(result.error ?? t("signUpSheet.failed"), "error");
      return;
    }

    showToast(t("signUpSheet.success"), "success");
    resetForm();
    onClose();
  };

  const handleBackToStepOne = () => {
    setSignUpPicker(null);
    setStep(1);
  };

  const handleLoginFromFooter = () => {
    resetForm();
    onClose();
    onLoginClick?.();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass("z-[60]")} />

        <Dialog.Content
          aria-describedby={undefined}
          className={responsiveAuthSheetContentClass(
            "z-[60] max-h-[min(92dvh,720px)] flex-col overflow-hidden",
          )}
        >
          {step === 1 && <SignUpDrawerHero />}

          <Dialog.Close asChild>
            <button
              type="button"
              className={responsiveSheetCloseButtonClass(
                `absolute right-3 z-20 backdrop-blur-sm ${step === 1 ? "top-3" : "top-4"}`,
              )}
              aria-label={t("signUpSheet.close")}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <div
            className={`flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              step === 1 ? "pt-4" : "pt-14"
            }`}
          >
            {step === 1 ? (
              <SignUpStepOne
                formId={formId}
                data={stepOne}
                onChange={(patch) => setStepOne((prev) => ({ ...prev, ...patch }))}
                onSubmit={handleStepOneSubmit}
                onLoginClick={handleLoginFromFooter}
              />
            ) : (
              <SignUpStepTwo
                formId={formId}
                data={stepTwo}
                onChange={(patch) => setStepTwo((prev) => ({ ...prev, ...patch }))}
                onBack={handleBackToStepOne}
                onSubmit={handleStepTwoSubmit}
                onOpenBankPicker={() => setSignUpPicker("bank")}
                onOpenChannelPicker={() => setSignUpPicker("channel")}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          <SignUpPickerSheet
            isOpen={signUpPicker === "bank"}
            onClose={() => setSignUpPicker(null)}
            ariaLabel={t("fields.bankPlaceholder")}
          >
            <ResourceGate resource={signUpOptions} loadingLabel={t("signUpSheet.loadingBanks")} errorTitle={t("signUpSheet.banksFailed")}>
              {({ banks }) => (
            <div className="grid grid-cols-4 gap-2 px-1">
              {banks.map((bank) => (
                <SignUpPickerGridItem
                  key={bank.id}
                  label={bank.label}
                  coverTone={bank.coverTone}
                  selected={stepTwo.bankId === bank.id}
                  onSelect={() => {
                    setStepTwo((prev) => ({ ...prev, bankId: bank.id }));
                    setSignUpPicker(null);
                  }}
                />
              ))}
            </div>
              )}
            </ResourceGate>
          </SignUpPickerSheet>

          <SignUpPickerSheet
            isOpen={signUpPicker === "channel"}
            onClose={() => setSignUpPicker(null)}
            ariaLabel={t("fields.channelPlaceholder")}
          >
            <ResourceGate resource={signUpOptions} loadingLabel={t("signUpSheet.loadingChannels")} errorTitle={t("signUpSheet.channelsFailed")}>
              {({ channels }) => (
            <div className="grid grid-cols-4 gap-2 px-1">
              {channels.map((channel) => (
                <SignUpPickerGridItem
                  key={channel.id}
                  label={channel.label}
                  coverTone={channel.coverTone}
                  selected={stepTwo.channelId === channel.id}
                  onSelect={() => {
                    setStepTwo((prev) => ({ ...prev, channelId: channel.id }));
                    setSignUpPicker(null);
                  }}
                />
              ))}
            </div>
              )}
            </ResourceGate>
          </SignUpPickerSheet>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
