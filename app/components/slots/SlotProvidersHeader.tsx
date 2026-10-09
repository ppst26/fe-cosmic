"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { ArrowLeftIcon } from "../ui/Icons";

export interface PageSubHeaderProps {
  title?: string;
  backHref?: string;
  /** modal hub — ปิดแทน history.back */
  onBackClick?: () => void;
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
  onBackClick,
  className = "",
}: PageSubHeaderProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBackClick) {
      onBackClick();
      return;
    }
    router.push(backHref);
  };

  return (
    <header className={`standalone-sub-header page-sub-header w-full min-w-0 ${className}`}>
      <div className="standalone-sub-header__inner relative mx-auto flex h-12 w-full max-w-[var(--content-max)] items-center justify-between px-3 sm:px-4">
        {/* ปุ่มย้อนกลับ arrow back (ไม่มี card ครอบ) */}
        <Link
          href={backHref}
          onClick={handleBack}
          className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-start text-white hover:text-white/80 active:scale-90 transition-transform cursor-pointer"
          aria-label="ย้อนกลับ"
        >
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </Link>

        {/* ชื่อหน้า กึ่งกลาง */}
        <h1
          className="page-sub-header__title absolute left-1/2 max-w-[70%] -translate-x-1/2 truncate text-center text-white select-none pointer-events-none"
        >
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
