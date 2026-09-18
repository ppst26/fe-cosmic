"use client";

import React from "react";
import Link from "next/link";

type YikiActionBarSecondary = { label: string; href: string } | { label: string; onClick: () => void };

interface YikiActionBarProps {
  secondary: YikiActionBarSecondary;
  primary: { label: string; onClick: () => void; disabled?: boolean };
  /**
   * จอใหญ่: "columns" จัดกว้างตรงกับคอลัมน์โพย/เลือกเลขของขั้นเลือกเลข (ค่าเริ่มต้น)
   * "centered" จัดกึ่งกลางแคบให้ตรงกับแผงใส่ราคาคอลัมน์เดียวของขั้นใส่ราคา
   */
  variant?: "columns" | "centered";
}

/**
 * แถบปุ่มล่างสุดแบบ fixed — ปุ่มรอง (กลับหน้าก่อนหน้า/ย้อนกลับ) + ปุ่มหลัก (ใส่ราคา/ยืนยันการแทง)
 * แทน FloatingBottomNav บนหน้านี้ ตามที่ผู้ใช้ระบุ — ใช้ใน YikiBetBoard
 */
export function YikiActionBar({ secondary, primary, variant = "columns" }: YikiActionBarProps) {
  return (
    <div className={`yiki-action-bar${variant === "centered" ? " yiki-action-bar--centered" : ""}`}>
      {"href" in secondary ? (
        <Link href={secondary.href} className="yiki-action-bar__secondary">
          {secondary.label}
        </Link>
      ) : (
        <button type="button" className="yiki-action-bar__secondary" onClick={secondary.onClick}>
          {secondary.label}
        </button>
      )}
      <button
        type="button"
        className="cosmic-action-btn yiki-action-bar__primary"
        disabled={primary.disabled}
        onClick={primary.onClick}
      >
        {primary.label}
      </button>
    </div>
  );
}
