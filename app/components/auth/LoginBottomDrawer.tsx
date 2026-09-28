"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import { CloseIcon, LockIcon, PhoneIcon } from "../ui/Icons";
import { COSMIC_SHEET_FIELD_ROW } from "../ui/cosmicButtonClasses";
import {
  responsiveAuthSheetContentClass,
  responsiveSheetCloseButtonClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { useAuth } from "./AuthProvider";

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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setPhone("");
    setPassword("");
    setError(null);
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
    setError(null);
    setSubmitting(true);
    const result = await login({ phone: phone.trim(), password });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }
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
            "z-[60] max-h-[min(70dvh,480px)] flex-col overflow-hidden pt-14",
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

          <Dialog.Title className="text-2xl font-medium">เข้าสู่ระบบ</Dialog.Title>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">ใช้เบอร์และรหัสผ่านที่สมัครไว้</p>

          <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <p
                className="rounded-[var(--radius-control)] bg-[var(--surface-selected)] px-3 py-2 text-sm text-[var(--destructive)]"
                role="alert"
              >
                {error}
              </p>
            )}

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
                  onChange={(e) => setPhone(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cosmic-sheet-submit mt-1"
            >
              {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>

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
