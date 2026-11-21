"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import { ArrowLeftIcon } from "../ui/Icons";

/**
 * แถบหัวหน้าโปรไฟล์ — ปุ่มย้อน arrow back ไร้ card ครอบ + ชื่อหน้ากึ่งกลาง
 * ถูกเรียกใช้ใน app/profile/page.tsx
 */
export function ProfilePageHeader({ title }: { title: string }) {
  const t = useT("profile");
  return (
    <header className="profile-page-header standalone-sub-header page-sub-header w-full min-w-0">
      <div className="relative mx-auto flex min-h-14 w-full max-w-[var(--content-max)] items-center justify-between px-4 py-2.5 sm:px-5">
        <Link
          href="/"
          className="cosmic-back-btn"
          aria-label={t("backHome")}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1
          className="page-sub-header__title absolute left-1/2 max-w-[70%] -translate-x-1/2 truncate text-center text-white select-none pointer-events-none"
        >
          {title}
        </h1>
        <div className="w-10 h-10 shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
}
