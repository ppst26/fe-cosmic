import React from "react";
import Link from "next/link";
import { CosmicbetLogo, HamburgerMenuIcon } from "../ui/Icons";

interface HeaderProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onMenuClick?: () => void;
}

/**
 * Header แถบเต็มความกว้าง — grid 3 โซน (โลโก้ | auth | เมนู) ไม่ทับกัน
 * ถูกเรียกใช้ใน app/page.tsx (นอก page-shell)
 */
export function Header({
  onLoginClick,
  onSignUpClick,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full min-w-0 bg-[#121127]/92 shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-[var(--content-max)] grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] items-center gap-2 px-[var(--page-gutter)] py-2 sm:gap-3 sm:py-2.5">
        {/* ซ้าย — pod โลโก้ (จำกัดความกว้าง ไม่ล้นกลาง) */}
        <div className="flex min-w-0 max-w-[42%] items-center rounded-full  py-1.5 pl-2.5 pr-3 sm:max-w-[200px] sm:pl-3 sm:pr-4">
          <Link
            href="/"
            className="block min-w-0 max-w-full outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] active:scale-95 rounded-[var(--radius-control)]"
            aria-label="Cosmicbet หน้าแรก"
          >
            <CosmicbetLogo />
          </Link>
        </div>

        {/* กลาง — LOG IN + SIGN UP pill */}
        <div className="flex min-w-0 items-center justify-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={onLoginClick}
            className="shrink-0 whitespace-nowrap px-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--text-primary)] transition-colors hover:text-white active:opacity-80 sm:px-2 sm:text-xs"
          >
            LOG IN
          </button>
          <button
            type="button"
            onClick={onSignUpClick}
            className="shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-[0_2px_12px_rgba(9,104,248,0.45)] transition-all hover:brightness-110 active:scale-[0.98] sm:px-5 sm:py-2 sm:text-xs"
            style={{ background: "var(--action-gradient)" }}
          >
            SIGN UP
          </button>
        </div>

        {/* ขวา — เมนู */}
        <div className="flex shrink-0 items-center justify-end rounded-full bg-[#232145]/90 p-1">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#121127]/80 text-[var(--icon-active)] transition-colors hover:bg-[var(--surface-hover)] active:scale-95 sm:h-10 sm:w-10"
            aria-label="เปิดเมนูหลัก"
            aria-haspopup="dialog"
          >
            <HamburgerMenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
