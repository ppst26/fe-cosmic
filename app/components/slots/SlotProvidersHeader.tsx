"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "../ui/Icons";
import { COSMIC_BTN_GLASS_ICON } from "../ui/cosmicButtonClasses";

interface SlotProvidersHeaderProps {
  title?: string;
  backHref?: string;
}

/**
 * แถบ Header ย่อยสำหรับหน้าค่ายเกมสล็อต (/category/slots)
 * แสดงปุ่มย้อนกลับ < และชื่อหมวดหมู่ "สล็อต"
 */
export function SlotProvidersHeader({
  title = "สล็อต",
  backHref = "/",
}: SlotProvidersHeaderProps) {
  return (
    <div
      className="slot-providers-header w-full min-w-0 border-b border-[var(--border-subtle)]/60 bg-[color-mix(in_srgb,var(--cosmic-page-base)_82%,transparent)] backdrop-blur-md"
    >
      <div className="slot-providers-header__inner mx-auto flex h-12 w-full max-w-[var(--content-max)] items-center gap-3 px-[var(--layout-inline-gutter)]">
        {/* ปุ่มย้อนกลับ < */}
        <Link
          href={backHref}
          className={`${COSMIC_BTN_GLASS_ICON} text-[var(--icon-active)] active:scale-95`}
          aria-label="ย้อนกลับไปหน้าแรก"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>

        {/* ชื่อหน้า */}
        <h2 className="text-base font-medium tracking-wide text-white sm:text-lg">
          {title}
        </h2>
      </div>
    </div>
  );
}
