"use client";

import React from "react";
import Link from "next/link";

type YikiActionBarSecondary = { label: string; href: string } | { label: string; onClick: () => void };

interface YikiActionBarProps {
  secondary: YikiActionBarSecondary;
  primary: { label: string; onClick: () => void; disabled?: boolean };
}

/**
 * แถบปุ่มล่างสุดแบบ fixed — ปุ่มรอง (กลับหน้าก่อนหน้า/กลับแก้ไขเลข) + ปุ่มหลัก (ใส่ราคา/ส่งโพย)
 * แทน FloatingBottomNav บนหน้านี้ ตามที่ผู้ใช้ระบุ — ใช้ใน YikiBetBoard ทุกขั้น (จอใหญ่จัดกว้างตรงกับคอลัมน์ด้านบน)
 */
export function YikiActionBar({ secondary, primary }: YikiActionBarProps) {
  return (
    <div className="yiki-action-bar">
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
