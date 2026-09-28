"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { ChevronLeftIcon, CloseIcon } from "./Icons";
import { cn } from "@/lib/utils";
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
  /** center = กลาง (ฝาก/ถอน) · start = ชิดซ้ายสุด (hub modal) */
  titleAlign?: "center" | "start";
  className?: string;
  /** องค์ประกอบนำหน้า (เช่น ไอคอน 3D / ภาพประกอบ) เมื่อไม่มี onBack */
  leadingSlot?: React.ReactNode;
};

/**
 * แถบหัว bottom sheet มือถือ — กลับซ้าย · หัวข้อกลาง · ปิดขวา
 * ใช้ใน Deposit / Withdraw / Coupon / hub สิทธิพิเศษ และสเต็ปย่อยของฝาก-ถอน
 */
export function ResponsiveSheetHeader({
  title,
  subtitle,
  closeAriaLabel,
  onBack,
  backAriaLabel = "กลับขั้นตอนก่อนหน้า",
  titleAlign = "center",
  className,
  leadingSlot,
}: ResponsiveSheetHeaderProps) {
  const closeButton = (
    <Dialog.Close asChild>
      <button type="button" className={responsiveSheetCloseButtonClass()} aria-label={closeAriaLabel}>
        <CloseIcon className="h-4 w-4" />
      </button>
    </Dialog.Close>
  );

  if (titleAlign === "start") {
    return (
      <header
        className={cn(
          "responsive-sheet-header--start grid w-full shrink-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 pb-2 pt-0.5",
          className,
        )}
      >
        <div className="col-start-1 flex min-w-0 items-start gap-2 self-center">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className={responsiveSheetBackButtonClass()}
              aria-label={backAriaLabel}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          ) : leadingSlot ? (
            leadingSlot
          ) : null}
          <div className="min-w-0 text-left [&_h2]:text-left">
            {title}
            {subtitle}
          </div>
        </div>
        <div className="col-start-2 flex min-h-9 items-center justify-end self-start">{closeButton}</div>
      </header>
    );
  }

  const colClass = leadingSlot
    ? "grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] sm:grid-cols-[3rem_minmax(0,1fr)_3rem]"
    : undefined;

  return (
    <header className={RESPONSIVE_SHEET_HEADER_ROW_CLASS(cn(colClass, className))}>
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
        ) : leadingSlot ? (
          leadingSlot
        ) : (
          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 px-1 text-center">
        {title}
        {subtitle}
      </div>

      <div className="flex min-h-9 items-center justify-end">{closeButton}</div>
    </header>
  );
}
