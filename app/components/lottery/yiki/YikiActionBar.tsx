"use client";

import React from "react";
import Link from "next/link";

type YikiActionBarSecondary = { label: string; href: string } | { label: string; onClick: () => void };

interface YikiActionBarProps {
  className?: string;
  /** ไม่ส่งมา = ไม่มีปุ่มรอง ปุ่มหลักขยายเต็มความกว้าง (เช่นขั้นใส่ราคาที่ย้าย "กลับแก้ไขเลข" ไปไว้ในการ์ดขวาแล้ว) */
  secondary?: YikiActionBarSecondary;
  primary: { label: string; onClick: () => void; disabled?: boolean };
}

/**
 * แถบปุ่มล่างสุดแบบ fixed — ปุ่มรอง (กลับหน้าก่อนหน้า) + ปุ่มหลัก (ใส่ราคา/ส่งโพย)
 * แทน FloatingBottomNav บนหน้านี้ ตามที่ผู้ใช้ระบุ — ใช้ใน YikiBetBoard ทุกขั้น (จอใหญ่จัดกว้างตรงกับคอลัมน์ด้านบน)
 */
export function YikiActionBar({ className = "", secondary, primary }: YikiActionBarProps) {
  return (
    <div
      className={`yiki-action-bar${!secondary ? " yiki-action-bar--single" : ""}${className ? ` ${className}` : ""}`}
    >
      {secondary ? (
        "href" in secondary ? (
          <Link href={secondary.href} className="yiki-action-bar__secondary">
            {secondary.label}
          </Link>
        ) : (
          <button type="button" className="yiki-action-bar__secondary" onClick={secondary.onClick}>
            {secondary.label}
          </button>
        )
      ) : null}
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
