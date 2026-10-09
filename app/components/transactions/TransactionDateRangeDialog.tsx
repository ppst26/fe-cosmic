"use client";

import React, { useMemo, useState } from "react";
import { Dialog } from "radix-ui";
import {
  getCalendarMonthCells,
  getMonthOptionLabels,
  getWeekdayShortLabels,
  isSameDay,
  startOfDay,
} from "@/app/lib/transactionDateUtils";
import { CloseIcon } from "../ui/Icons";
import { COSMIC_BTN_GLASS_PILL, COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale } from "@/lib/i18n/navigation";

interface TransactionDateRangeDialogProps {
  open: boolean;
  from: Date;
  to: Date;
  onOpenChange: (open: boolean) => void;
  onConfirm: (from: Date, to: Date) => void;
  /** จำกัดวันที่เลือกได้ — วันนอกช่วงกดไม่ได้ (เช่น ประวัติโพยย้อนหลังไม่เกิน 30 วัน) */
  minDate?: Date;
  maxDate?: Date;
}

/**
 * เลือกช่วงวันที่ — ปฏิทินเดือน + ยืนยัน/ยกเลิก (TransactionDateFilter)
 */
export function TransactionDateRangeDialog({
  open,
  from,
  to,
  onOpenChange,
  onConfirm,
  minDate,
  maxDate,
}: TransactionDateRangeDialogProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfDay(from));
  const [rangeStart, setRangeStart] = useState<Date | null>(from);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(to);
  const t = useT("transactions");
  const locale = useLocale();
  const monthLabels = useMemo(() => getMonthOptionLabels(locale), [locale]);
  const weekdayLabels = useMemo(() => getWeekdayShortLabels(locale), [locale]);

  /** เปิด dialog หรือช่วงจากภายนอกเปลี่ยนขณะเปิด → เริ่มจากช่วงปัจจุบัน (ปรับระหว่าง render) */
  const [synced, setSynced] = useState({ open, from, to });
  if (synced.open !== open || synced.from !== from || synced.to !== to) {
    setSynced({ open, from, to });
    if (open) {
      setViewMonth(startOfDay(from));
      setRangeStart(from);
      setRangeEnd(to);
    }
  }

  const cells = useMemo(() => getCalendarMonthCells(viewMonth), [viewMonth]);

  const isOutOfBounds = (day: Date) =>
    (minDate !== undefined && day.getTime() < startOfDay(minDate).getTime()) ||
    (maxDate !== undefined && day.getTime() > startOfDay(maxDate).getTime());

  const handleDayClick = (date: Date) => {
    const day = startOfDay(date);
    if (isOutOfBounds(day)) return;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }
    if (day.getTime() < rangeStart.getTime()) {
      setRangeEnd(rangeStart);
      setRangeStart(day);
      return;
    }
    setRangeEnd(day);
  };

  const handleConfirm = () => {
    if (!rangeStart) return;
    const end = rangeEnd ?? rangeStart;
    onConfirm(rangeStart, end);
    onOpenChange(false);
  };

  const years = useMemo(() => {
    if (minDate || maxDate) {
      const first = (minDate ?? new Date()).getFullYear();
      const last = (maxDate ?? new Date()).getFullYear();
      return Array.from({ length: Math.max(1, last - first + 1) }, (_, i) => first + i);
    }
    const current = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => current - 3 + i);
  }, [minDate, maxDate]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cosmic-dialog-overlay fixed inset-0 z-[80]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="tx-calendar-dialog fixed left-1/2 top-1/2 z-[81] w-[min(92vw,360px)] -translate-x-1/2 -translate-y-1/2 p-4 outline-none"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <Dialog.Title className="text-sm font-medium text-[var(--text-primary)]">
              {t("calendar.title")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--icon-default)] hover:bg-white/[0.06]"
                aria-label={t("calendar.close")}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mb-3 flex gap-2">
            <select
              className="cosmic-filter-control min-w-0 flex-1 border border-[var(--border-subtle)]/60 bg-[var(--inner-card-fill)] px-2 py-2 text-sm text-[var(--text-primary)]"
              value={viewMonth.getMonth()}
              onChange={(event) => {
                const month = Number(event.target.value);
                setViewMonth(new Date(viewMonth.getFullYear(), month, 1));
              }}
            >
              {monthLabels.map((label, index) => (
                <option key={label} value={index}>{label}</option>
              ))}
            </select>
            <select
              className="cosmic-filter-control w-24 border border-[var(--border-subtle)]/60 bg-[var(--inner-card-fill)] px-2 py-2 text-sm text-[var(--text-primary)]"
              value={viewMonth.getFullYear()}
              onChange={(event) => {
                const year = Number(event.target.value);
                setViewMonth(new Date(year, viewMonth.getMonth(), 1));
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="tx-calendar-grid mb-1">
            {weekdayLabels.map((day, index) => (
              <span
                key={index}
                className="py-1 text-center text-xs font-medium text-[var(--text-muted)]"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="tx-calendar-grid">
            {cells.map(({ date, inMonth }) => {
              const day = startOfDay(date);
              const isStart = rangeStart && isSameDay(day, rangeStart);
              const isEnd = rangeEnd && isSameDay(day, rangeEnd);
              const inRange =
                rangeStart &&
                rangeEnd &&
                day.getTime() >= rangeStart.getTime() &&
                day.getTime() <= rangeEnd.getTime();

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={isOutOfBounds(day)}
                  className={cn(
                    "tx-calendar-day disabled:cursor-not-allowed disabled:opacity-30",
                    !inMonth && "is-outside",
                    inRange && !isStart && !isEnd && "is-in-range",
                    (isStart || isEnd) && "is-range-start",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Dialog.Close asChild>
              <button type="button" className={`${COSMIC_BTN_GLASS_PILL} !min-h-11 w-full text-sm`}>
                {t("calendar.cancel")}
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!rangeStart}
              className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--sm !min-h-11 w-full text-sm disabled:opacity-45`}
            >
              {t("calendar.confirm")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
