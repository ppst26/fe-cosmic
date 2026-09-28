"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "../ui/Icons";

export interface PageSubHeaderProps {
  title?: string;
  backHref?: string;
  className?: string;
}

export type SlotProvidersHeaderProps = PageSubHeaderProps;

/**
 * แถบ Header ย่อยสำหรับหน้า standalone มือถือ (แชร์ร่วมกันทุกหน้า)
 * ปุ่มย้อนกลับ arrow back ไร้ card ครอบ + ชื่อหัวข้อจัดกึ่งกลาง
 */
export function StandaloneSubHeader({
  title = "สล็อต",
  backHref = "/",
  className = "",
}: PageSubHeaderProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <header className={`standalone-sub-header page-sub-header w-full min-w-0 bg-[#140f1c] border-b border-[#2d1b4e]/50 ${className}`}>
      <div className="standalone-sub-header__inner relative mx-auto flex h-12 w-full max-w-[var(--content-max)] items-center justify-between px-3 sm:px-4">
        {/* ปุ่มย้อนกลับ arrow back (ไม่มี card ครอบ) */}
        <Link
          href={backHref}
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 items-center justify-start text-white hover:text-white/80 active:scale-90 transition-transform cursor-pointer"
          aria-label="ย้อนกลับ"
        >
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </Link>

        {/* ชื่อหน้า กึ่งกลาง */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium tracking-tight text-white sm:text-lg select-none pointer-events-none truncate max-w-[70%] text-center leading-none">
          {title}
        </h1>

        {/* กล่องรักษาสมดุลด้านขวา */}
        <div className="w-10 h-10 shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
}

export const PageSubHeader = StandaloneSubHeader;
export const SlotProvidersHeader = StandaloneSubHeader;
