"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { COSMIC_BTN_PRIMARY } from "./cosmicButtonClasses";

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
 * ปุ่มแอคชั่น gradient — ใช้ .btn-primary (เดียวกับ sheet ฝาก/ถอน)
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
        COSMIC_BTN_PRIMARY,
        stacked && "btn-primary--stacked",
        dimmed && "btn-primary--dimmed",
        className,
      )}
      {...props}
    >
      {stacked ? (
        <>
          <span className="btn-primary__row">{title}</span>
          <span className="btn-primary__meta">{subtitle}</span>
        </>
      ) : (
        title
      )}

      {children}
    </button>
  );
}
