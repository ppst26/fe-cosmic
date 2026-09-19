"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { ChevronLeftIcon, CloseIcon } from "./Icons";
import {
  RESPONSIVE_SHEET_HEADER_ROW_CLASS,
  responsiveSheetBackButtonClass,
  responsiveSheetCloseButtonClass,
} from "./responsiveSheetDialog";

type ResponsiveSheetHeaderProps = {
  /** ข้อความหัวข้อ — มักเป็น Dialog.Title */
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** ปิดทั้ง sheet */
  closeAriaLabel: string;
  /** กลับสเต็ปก่อนหน้า — ไม่ส่ง = ช่องซ้ายว่าง */
  onBack?: () => void;
  backAriaLabel?: string;
  className?: string;
};

/**
 * แถบหัว bottom sheet มือถือ — กลับซ้าย · หัวข้อกลาง · ปิดขวา
 * ใช้ใน Deposit / Withdraw / Coupon และสเต็ปย่อยของฝาก-ถอน
 */
export function ResponsiveSheetHeader({
  title,
  subtitle,
  closeAriaLabel,
  onBack,
  backAriaLabel = "กลับขั้นตอนก่อนหน้า",
  className,
}: ResponsiveSheetHeaderProps) {
  return (
    <header className={RESPONSIVE_SHEET_HEADER_ROW_CLASS(className)}>
      <div className="flex min-h-9 items-center justify-start">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className={responsiveSheetBackButtonClass()}
            aria-label={backAriaLabel}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        ) : (
          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 px-1 text-center">
        {title}
        {subtitle}
      </div>

      <div className="flex min-h-9 items-center justify-end">
        <Dialog.Close asChild>
          <button type="button" className={responsiveSheetCloseButtonClass()} aria-label={closeAriaLabel}>
            <CloseIcon className="h-4 w-4" />
          </button>
        </Dialog.Close>
      </div>
    </header>
  );
}
