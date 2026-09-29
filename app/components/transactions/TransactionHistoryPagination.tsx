"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * เลขหน้าตารางธุรกรรม — ใช้กับแท็บเดิมพัน
 */
export function TransactionHistoryPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="tx-history-pagination flex items-center justify-center gap-1.5 pt-2"
      aria-label="เปลี่ยนหน้ารายการเดิมพัน"
    >
      <PaginationBtn
        label="หน้าก่อน"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </PaginationBtn>
      {pages.map((num) => (
        <PaginationBtn
          key={num}
          label={`หน้า ${num}`}
          active={num === page}
          onClick={() => onPageChange(num)}
        >
          {num}
        </PaginationBtn>
      ))}
      <PaginationBtn
        label="หน้าถัดไป"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </PaginationBtn>
    </nav>
  );
}

function PaginationBtn({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
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
        "cosmic-choice-btn flex h-8 min-w-8 items-center justify-center px-2 text-xs disabled:cursor-not-allowed disabled:opacity-40",
        active && "is-active",
      )}
    >
      {children}
    </button>
  );
}
