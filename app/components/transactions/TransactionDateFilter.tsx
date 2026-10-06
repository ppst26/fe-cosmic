"use client";

import React, { useState } from "react";
import { formatTransactionDateRangeLabel } from "@/app/lib/transactionDateUtils";
import { TransactionDateRangeDialog } from "./TransactionDateRangeDialog";
import { COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";

interface TransactionDateFilterProps {
  draftFrom: Date;
  draftTo: Date;
  onDraftChange: (from: Date, to: Date) => void;
  onSearch: () => void;
  onClear: () => void;
}

/**
 * ฟิลเตอร์วันที่ — ช่องเลือกช่วง · ล้าง · ค้นหา
 */
export function TransactionDateFilter({
  draftFrom,
  draftTo,
  onDraftChange,
  onSearch,
  onClear,
}: TransactionDateFilterProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-sm text-[var(--text-secondary)]">เลือกวันที่</label>

      <div className="tx-date-filter__toolbar">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="tx-date-field tx-date-field--range min-w-0"
        >
          <span className="min-w-0 flex-1 truncate text-left text-sm tabular-nums">
            {formatTransactionDateRangeLabel(draftFrom, draftTo)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="tx-date-field tx-date-field--calendar shrink-0"
          aria-label="เปิดปฏิทินเลือกวันที่"
        >
          <CalendarIcon className="h-5 w-5 shrink-0 text-[var(--icon-default)]" />
        </button>
        <button
          type="button"
          onClick={onClear}
          className="tx-date-filter__clear shrink-0"
        >
          ล้าง
        </button>
        <button
          type="button"
          onClick={onSearch}
          className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--sm tx-date-filter__search shrink-0 text-sm font-medium`}
        >
          ค้นหา
        </button>
      </div>

      <TransactionDateRangeDialog
        open={pickerOpen}
        from={draftFrom}
        to={draftTo}
        onOpenChange={setPickerOpen}
        onConfirm={onDraftChange}
      />
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
