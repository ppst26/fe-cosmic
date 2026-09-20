"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "../ui/Icons";

interface ProviderBreadcrumbProps {
  providerName: string;
  backHref?: string;
}

/**
 * แถบ Breadcrumb สำหรับหน้ารายการเกมของค่าย (/slots/[provider])
 * โครงสร้างตามภาพตัวอย่าง: <  สล็อต  /  PRAGMATIC PLAY
 */
export function ProviderBreadcrumb({
  providerName,
  backHref = "/slots",
}: ProviderBreadcrumbProps) {
  return (
    <nav
      className="provider-breadcrumb-nav w-full min-w-0"
      aria-label="การนำทางตามลำดับขั้น"
    >
      <div className="mx-auto flex h-12 w-full max-w-[var(--content-max)] items-center gap-2 px-[var(--page-gutter)] text-sm sm:text-base">
        {/* ปุ่มย้อนกลับ < */}
        <Link
          href={backHref}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--icon-active)] transition-colors hover:bg-[var(--surface-hover)] active:scale-95 shrink-0"
          aria-label="ย้อนกลับไปหน้ารวมสล็อต"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>

        {/* Breadcrumb Links: สล็อต / [ค่ายเกม] */}
        <ol className="flex items-center gap-2 min-w-0">
          <li>
            <Link
              href={backHref}
              className="font-medium text-white transition-colors hover:text-white/80 hover:underline"
            >
              สล็อต
            </Link>
          </li>
          <li className="text-[var(--text-muted)] font-light select-none" aria-hidden="true">
            /
          </li>
          <li
            className="truncate font-medium tracking-tight text-[var(--text-primary)] uppercase"
            aria-current="page"
          >
            {providerName}
          </li>
        </ol>
      </div>
    </nav>
  );
}
