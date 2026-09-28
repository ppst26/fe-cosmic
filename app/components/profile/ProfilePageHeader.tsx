import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "../ui/Icons";

/**
 * แถบหัวหน้าโปรไฟล์ — ปุ่มย้อน arrow back ไร้ card ครอบ + ชื่อหน้ากึ่งกลาง
 * ถูกเรียกใช้ใน app/profile/page.tsx
 */
export function ProfilePageHeader({ title }: { title: string }) {
  return (
    <header className="profile-page-header standalone-sub-header page-sub-header w-full min-w-0 bg-[#140f1c] border-b border-[#2d1b4e]/50">
      <div className="relative mx-auto flex h-12 w-full max-w-[var(--content-max)] items-center justify-between px-3 sm:px-4">
        <Link
          href="/"
          className="flex h-10 w-10 shrink-0 items-center justify-start text-white hover:text-white/80 active:scale-90 transition-transform cursor-pointer"
          aria-label="กลับหน้าแรก"
        >
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium tracking-tight text-white sm:text-lg select-none pointer-events-none truncate max-w-[70%] text-center leading-none">
          {title}
        </h1>
        <div className="w-10 h-10 shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
}
