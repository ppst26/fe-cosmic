"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "../ui/Icons";

interface ProviderBreadcrumbProps {
  providerName: string;
  backHref?: string;
}

/**
 * แถบ Breadcrumb สำหรับหน้ารายการเกมของค่าย (/slots/[provider])
 * โครงสร้าง: ←  สล็อต  /  PRAGMATIC PLAY
 */
export function ProviderBreadcrumb({
  providerName,
  backHref = "/slots",
}: ProviderBreadcrumbProps) {
  return (
    <nav
      className="provider-breadcrumb-nav standalone-sub-header page-sub-header w-full min-w-0 bg-[#140f1c] border-b border-[#2d1b4e]/50"
      aria-label="การนำทางตามลำดับขั้น"
    >
      <div className="mx-auto flex h-12 w-full max-w-[var(--content-max)] items-center gap-2 px-[var(--page-gutter)] text-sm sm:text-base">
        {/* ปุ่มย้อนกลับ arrow back */}
        <Link
          href={backHref}
          className="flex h-8 w-8 items-center justify-start text-white hover:text-white/80 active:scale-90 transition-transform shrink-0 cursor-pointer"
          aria-label="ย้อนกลับไปหน้ารวมสล็อต"
        >
          <ArrowLeftIcon className="h-5.5 w-5.5 text-white" />
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
