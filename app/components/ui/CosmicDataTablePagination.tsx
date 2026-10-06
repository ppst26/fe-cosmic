"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * เลขหน้าตาราง solid — คู่กับ cosmic-data-table (Cashback · Referral · ธุรกรรม)
 */
export function CosmicDataTablePagination({
  page,
  totalPages,
  onPageChange,
  className,
  size = "md",
  "aria-label": ariaLabel = "เปลี่ยนหน้า",
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  size?: "sm" | "md";
  "aria-label"?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const sizeClass = size === "sm" ? "h-8 min-w-8" : "h-9 min-w-9";

  return (
    <nav className={cn("flex items-center gap-1.5", className)} aria-label={ariaLabel}>
      <CosmicPaginationButton
        label="หน้าก่อน"
        sizeClass={sizeClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </CosmicPaginationButton>
      {pages.map((num) => (
        <CosmicPaginationButton
          key={num}
          label={`หน้า ${num}`}
          sizeClass={sizeClass}
          active={num === page}
          onClick={() => onPageChange(num)}
        >
          {num}
        </CosmicPaginationButton>
      ))}
      <CosmicPaginationButton
        label="หน้าถัดไป"
        sizeClass={sizeClass}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </CosmicPaginationButton>
    </nav>
  );
}

function CosmicPaginationButton({
  children,
  label,
  sizeClass,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  sizeClass: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "cosmic-pagination-btn flex items-center justify-center px-2 text-xs disabled:cursor-not-allowed",
        sizeClass,
        active && "is-active",
      )}
    >
      {children}
    </button>
  );
}
