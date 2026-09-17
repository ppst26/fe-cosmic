"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import { CloseIcon, LockIcon, PhoneIcon } from "../ui/Icons";
import {
  responsiveAuthSheetContentClass,
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
          )}
        >
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-hover)]/90 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-selected)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label="ปิดหน้าเข้าสู่ระบบ"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <Dialog.Title className="text-2xl font-extrabold">เข้าสู่ระบบ</Dialog.Title>
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
              <div className="flex h-12 items-center gap-2.5 rounded-[var(--radius-control)] bg-[var(--surface-hover)] px-3">
                <PhoneIcon className="h-5 w-5 text-[var(--icon-default)]" />
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
              <div className="flex h-12 items-center gap-2.5 rounded-[var(--radius-control)] bg-[var(--surface-hover)] px-3 focus-within:ring-1 focus-within:ring-[var(--focus-ring)]">
                <LockIcon className="h-5 w-5 text-[var(--icon-default)]" />
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
              className="cosmic-action-btn mt-1 flex h-12 w-full items-center justify-center text-base disabled:opacity-60"
            >
              {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>

            <p className="text-center text-sm text-[var(--text-secondary)]">
              ยังไม่มีบัญชี?{" "}
              <button
                type="button"
                className="font-semibold text-[var(--border-active)] hover:text-[var(--icon-active)]"
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
