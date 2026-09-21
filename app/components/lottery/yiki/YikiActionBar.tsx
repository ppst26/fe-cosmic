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
      className={`yiki-action-bar flex gap-3 px-[var(--page-gutter)] pt-3 pb-[calc(var(--space-3)+var(--nav-safe))]${!secondary ? " yiki-action-bar--single" : ""}${className ? ` ${className}` : ""}`}
    >
      {secondary ? (
        "href" in secondary ? (
          <Link
            href={secondary.href}
            className="yiki-action-bar__secondary grid flex-1 place-items-center min-h-12 text-center"
          >
            {secondary.label}
          </Link>
        ) : (
          <button
            type="button"
            className="yiki-action-bar__secondary grid flex-1 place-items-center min-h-12 text-center"
            onClick={secondary.onClick}
          >
            {secondary.label}
          </button>
        )
      ) : null}
      <button
        type="button"
        className="cosmic-cta-primary cosmic-cta-primary--lg yiki-action-bar__primary flex-1 min-h-12"
        disabled={primary.disabled}
        onClick={primary.onClick}
      >
        {primary.label}
      </button>
    </div>
  );
}
