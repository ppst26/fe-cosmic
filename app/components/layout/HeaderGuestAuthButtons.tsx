"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

type HeaderGuestAuthButtonsProps = {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  /** มือถือ: ปุ่มสมัครใช้คำสั้น «สมัคร» จนกว่าจะมีพื้นที่ sm+ */
  signUpLabelCompact?: boolean;
  loginClassName: string;
  signUpClassName: string;
  className?: string;
};

/**
 * ปุ่มเข้าสู่ระบบ / สมัครสมาชิกสำหรับผู้เยี่ยมชม — ใช้ใน Header และ LobbyDesktopTopBar
 */
export function HeaderGuestAuthButtons({
  onLoginClick,
  onSignUpClick,
  signUpLabelCompact = false,
  loginClassName,
  signUpClassName,
  className,
}: HeaderGuestAuthButtonsProps) {
  const t = useT("auth");
  const signUpLabel = signUpLabelCompact ? (
    <>
      <span className="sm:hidden">{t("signUpShort")}</span>
      <span className="hidden sm:inline">{t("signUp")}</span>
    </>
  ) : (
    t("signUp")
  );

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onLoginClick}
        className={cn(
          loginClassName,
          "inline-flex items-center justify-center whitespace-nowrap text-xs font-medium",
        )}
      >
        {t("login")}
      </button>
      <button
        type="button"
        onClick={onSignUpClick}
        className={cn(
          signUpClassName,
          "cosmic-cta-primary cosmic-cta-primary--sm inline-flex items-center justify-center whitespace-nowrap text-xs font-medium",
        )}
      >
        {signUpLabel}
      </button>
    </div>
  );
}
