"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import { CloseIcon, LockIcon, PhoneIcon } from "../ui/Icons";
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
  isThaiMobilePhone,
  PASSWORD_MAX_LENGTH,
  PHONE_DIGIT_LENGTH,
  sanitizePassword,
  sanitizePhone,
} from "@/lib/fieldInput";
interface LoginBottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick?: () => void;
}

/**
 * Bottom drawer เข้าสู่ระบบ — เบอร์ + รหัสผ่าน
 * เปิดจาก Header LOG IN — ถูกเรียกใช้ใน app/page.tsx
 */
export function LoginBottomDrawer({
  isOpen,
  onClose,
  onSignUpClick,
}: LoginBottomDrawerProps) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setPhone("");
    setPassword("");
    setSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = sanitizePhone(phone);
    if (!isThaiMobilePhone(normalizedPhone)) {
      showToast("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0", "error");
      return;
    }
    if (!password) {
      showToast("กรุณากรอกรหัสผ่าน", "error");
      return;
    }
    setSubmitting(true);
    const result = await login({ phone: normalizedPhone, password });
    setSubmitting(false);
    if (!result.ok) {
      showToast(result.error ?? "เข้าสู่ระบบไม่สำเร็จ", "error");
      return;
    }
    showToast("เข้าสู่ระบบสำเร็จ", "success");
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass("z-[60]")} />
        <Dialog.Content
          aria-describedby={undefined}
          className={responsiveAuthSheetContentClass(
            "z-[60] max-h-[min(78dvh,560px)] flex-col overflow-hidden pt-14",
            { variant: "auth" },
          )}
        >
          <Dialog.Close asChild>
            <button
              type="button"
              className={responsiveSheetCloseButtonClass("absolute right-3 top-4 z-20")}
              aria-label="ปิดหน้าเข้าสู่ระบบ"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <ModalDesktopTitleBlock
            titleIconId="profile"
            title={<Dialog.Title className="text-2xl font-medium">เข้าสู่ระบบ</Dialog.Title>}
            subtitle={<p className="cosmic-type-sheet-desc mt-1">ใช้เบอร์และรหัสผ่านที่สมัครไว้</p>}
          />

          <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="login-phone" className="text-sm font-medium text-[var(--text-secondary)]">
                เบอร์โทรศัพท์
              </label>
              <div className={COSMIC_SHEET_FIELD_ROW}>
                <PhoneIcon className="h-5 w-5 shrink-0 text-[var(--icon-default)]" />
                <input
                  id="login-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  maxLength={PHONE_DIGIT_LENGTH}
                  onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                  placeholder="กรอกเบอร์โทรศัพท์"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-sm font-medium text-[var(--text-secondary)]">
                รหัสผ่าน
              </label>
              <div className={COSMIC_SHEET_FIELD_ROW}>
                <LockIcon className="h-5 w-5 shrink-0 text-[var(--icon-default)]" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  maxLength={PASSWORD_MAX_LENGTH}
                  onChange={(e) => setPassword(sanitizePassword(e.target.value))}
                  placeholder="กรอกรหัสผ่าน"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <CosmicStackedActionButton
              type="submit"
              disabled={submitting}
              className="mt-1"
              title={submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            />

            <p className="text-center text-sm text-[var(--text-secondary)]">
              ยังไม่มีบัญชี?{" "}
              <button
                type="button"
                className="font-medium text-[var(--border-active)] hover:text-[var(--icon-active)]"
                onClick={() => {
                  reset();
                  onClose();
                  onSignUpClick?.();
                }}
              >
                สมัครสมาชิก
              </button>
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
