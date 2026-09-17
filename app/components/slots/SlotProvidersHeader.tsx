"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "../ui/Icons";

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
    <div className="w-full min-w-0 border-b border-[#232145]/60 bg-[#121127]/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-[var(--content-max)] items-center gap-3 px-[var(--page-gutter)]">
        {/* ปุ่มย้อนกลับ < */}
        <Link
          href={backHref}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--icon-active)] transition-colors hover:bg-[var(--surface-hover)] active:scale-95"
          aria-label="ย้อนกลับไปหน้าแรก"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>

        {/* ชื่อหน้า */}
        <h2 className="text-base font-bold tracking-wide text-white sm:text-lg">
          {title}
        </h2>
      </div>
    </div>
  );
}
