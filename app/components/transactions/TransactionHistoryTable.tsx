"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { BetRowType, TransactionItem, TransactionKind, TransactionStatus } from "@/app/types/transaction";

function formatDateOnly(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatTimeOnly(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function statusLabel(status: TransactionStatus): string {
  switch (status) {
    case "completed":
      return "สำเร็จ";
    case "pending":
      return "รอดำเนินการ";
    case "failed":
      return "ไม่สำเร็จ";
  }
}

function statusClass(status: TransactionStatus): string {
  switch (status) {
    case "completed":
      return "text-[var(--success)]";
    case "pending":
      return "text-[var(--text-secondary)]";
    case "failed":
      return "text-[var(--destructive)]";
  }
}

function betTypeLabel(type: BetRowType | undefined): string {
  if (type === "result") return "ผลลัพธ์";
  if (type === "bet") return "เดิมพัน";
  return "—";
}

type Column = { key: string; label: string; render: (item: TransactionItem) => React.ReactNode };

function columnsForKind(kind: TransactionKind): Column[] {
  if (kind === "withdraw") {
    return [
      {
        key: "amount",
        label: "จำนวนเงิน",
        render: (item) => (
          <span className="font-medium tabular-nums text-[var(--success)]">
            {formatAmount(item.amount)} ฿
          </span>
        ),
      },
      { key: "channel", label: "ช่องทาง", render: (item) => item.channel ?? "—" },
      {
        key: "account",
        label: "บัญชีที่ทำรายการ",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{item.accountLabel ?? "—"}</span>
        ),
      },
      {
        key: "created",
        label: "วัน-เวลา ที่ทำรายการ",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateTime(item.createdAt)}</span>
        ),
      },
      {
        key: "status",
        label: "สถานะ",
        render: (item) => (
          <span className={`font-medium ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
        ),
      },
    ];
  }

  if (kind === "deposit") {
    return [
      { key: "detail", label: "ทำรายการ", render: (item) => item.title },
      {
        key: "created",
        label: "วัน-เวลา ที่ทำรายการ",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateTime(item.createdAt)}</span>
        ),
      },
      {
        key: "status",
        label: "สถานะ",
        render: (item) => (
          <span className={`font-medium ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
        ),
      },
      {
        key: "completed",
        label: "วัน-เวลา ที่ทำรายการสำเร็จ",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateTime(item.completedAt)}</span>
        ),
      },
    ];
  }

  if (kind === "promotion") {
    return [
      {
        key: "name",
        label: "ชื่อโปรโมชั่น",
        render: (item) => item.promotionName ?? item.title,
      },
      {
        key: "playStart",
        label: "วันที่เริ่มเล่น",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateOnly(item.playStartAt)}</span>
        ),
      },
      {
        key: "playEnd",
        label: "วันที่สิ้นสุด",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateOnly(item.playEndAt)}</span>
        ),
      },
      {
        key: "freeSpins",
        label: "ฟรีสปิน",
        render: (item) => (
          <span className="tabular-nums">{item.freeSpins != null ? item.freeSpins : "—"}</span>
        ),
      },
      {
        key: "perRound",
        label: "จำนวนต่อรอบ",
        render: (item) => (
          <span className="tabular-nums">
            {item.amountPerRound != null ? formatAmount(item.amountPerRound) : "—"}
          </span>
        ),
      },
      {
        key: "provider",
        label: "ค่ายเกม",
        render: (item) => item.gameProvider ?? "—",
      },
      {
        key: "game",
        label: "ชื่อเกม",
        render: (item) => item.gameName ?? "—",
      },
      {
        key: "expires",
        label: "หมดอายุภายใน",
        render: (item) => item.expiresWithinLabel ?? "—",
      },
      {
        key: "status",
        label: "สถานะ",
        render: (item) => (
          <span className={`font-medium ${statusClass(item.status)}`}>{statusLabel(item.status)}</span>
        ),
      },
    ];
  }

  if (kind === "bet") {
    return [
      {
        key: "game",
        label: "เกม",
        render: (item) => item.gameName ?? item.title,
      },
      {
        key: "date",
        label: "วันที่",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateOnly(item.createdAt)}</span>
        ),
      },
      {
        key: "time",
        label: "เวลา",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatTimeOnly(item.createdAt)}</span>
        ),
      },
      {
        key: "type",
        label: "ประเภท",
        render: (item) => betTypeLabel(item.betRowType),
      },
      {
        key: "amount",
        label: "ยอดเงิน",
        render: (item) => (
          <span className="font-medium tabular-nums">{formatAmount(item.amount)}</span>
        ),
      },
      {
        key: "open",
        label: "ยอดเงินเริ่มต้น",
        render: (item) => (
          <span className="tabular-nums">
            {item.openingBalance != null ? formatAmount(item.openingBalance) : "—"}
          </span>
        ),
      },
      {
        key: "close",
        label: "ยอดเงินสิ้นสุด",
        render: (item) => (
          <span className="tabular-nums">
            {item.closingBalance != null ? formatAmount(item.closingBalance) : "—"}
          </span>
        ),
      },
    ];
  }

  return [];
}

function minWidthForKind(kind: TransactionKind): string {
  if (kind === "promotion") return "min-w-[720px]";
  if (kind === "bet") return "min-w-[640px]";
  return "min-w-[520px]";
}

/**
 * ตารางประวัติธุรกรรม — คอลัมน์ตามประเภทแท็บ
 */
export function TransactionHistoryTable({
  kind,
  items,
}: {
  kind: TransactionKind;
  items: TransactionItem[];
}) {
  const columns = columnsForKind(kind);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = Math.abs(el.scrollLeft);
    const next = { start: left > 2, end: max - left > 2 };
    setEdges((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, kind, items.length]);

  return (
    <div
      className="cosmic-data-table-shell tx-history-table-wrap"
      data-scroll-start={edges.start ? "true" : undefined}
      data-scroll-end={edges.end ? "true" : undefined}
    >
      <div ref={scrollRef} onScroll={updateEdges} className="tx-history-table__scroll">
        <table className={`cosmic-data-table tx-history-table ${minWidthForKind(kind)}`}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <p className="tx-history-empty">ไม่พบข้อมูล</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render(item)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
