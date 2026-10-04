"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { COSMIC_BTN_CONFIRM_TEXT } from "./cosmicButtonClasses";

export interface CosmicStackedActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ข้อความหลักบนปุ่ม */
  title: string;
  /** บรรทัดรอง (เช่น ใช้ตั๋ว 1 ใบ) */
  subtitle?: string;
  /** โทนจางเมื่อยังกดไม่ได้เต็มที่ */
  dimmed?: boolean;
}

/**
 * ปุ่มแอคชั่น gradient — ใช้ .cosmic-sheet-submit (เดียวกับ sheet ฝาก/ถอน)
 * ข้อความอย่างเดียว ไม่มีไอคอนในปุ่ม
 */
export function CosmicStackedActionButton({
  title,
  subtitle,
  dimmed = false,
  className,
  type = "button",
  children,
  ...props
}: CosmicStackedActionButtonProps) {
  const stacked = Boolean(subtitle);

  return (
    <button
      type={type}
      className={cn(
        "cosmic-sheet-submit",
        stacked && "cosmic-sheet-submit--stacked",
        dimmed && "cosmic-sheet-submit--dimmed",
        className,
      )}
      {...props}
    >
      {stacked ? (
        <>
          <span className="cosmic-sheet-submit__row">
            <span className={COSMIC_BTN_CONFIRM_TEXT}>{title}</span>
          </span>
          <span className="cosmic-sheet-submit__meta">{subtitle}</span>
        </>
      ) : (
        <span className={COSMIC_BTN_CONFIRM_TEXT}>{title}</span>
      )}

      {children}
    </button>
  );
}
