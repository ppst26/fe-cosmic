import type { TransactionItem, TransactionStatus } from "@/app/types/transaction";
import { DepositNavIcon, WithdrawNavIcon } from "../ui/Icons";
import {
  COSMIC_PANEL_GLASS,
  COSMIC_PANEL_GLASS_ICON,
} from "../ui/cosmicButtonClasses";

/**
 * จัดรูปแบบวันที่รายการ
 */
function formatTransactionDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(item: TransactionItem): string {
  const formatted = new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(item.amount);
  const prefix = item.kind === "deposit" ? "+" : "-";
  return `${prefix}${formatted}`;
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

/**
 * รายการธุรกรรมแบบแถว
 */
export function TransactionList({ items }: { items: TransactionItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--text-muted)]">ยังไม่มีรายการ</p>
    );
  }

  return (
    <ul
      className={`${COSMIC_PANEL_GLASS} flex flex-col divide-y divide-[var(--border-subtle)]/40 px-4 py-1`}
    >
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
          <span className={`${COSMIC_PANEL_GLASS_ICON} !h-11 !w-11`}>
            {item.kind === "deposit" ? (
              <DepositNavIcon className="h-5 w-5" />
            ) : (
              <WithdrawNavIcon className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {formatTransactionDate(item.createdAt)} · {item.reference}
            </p>
            <p className={`mt-1 text-xs font-medium ${statusClass(item.status)}`}>
              {statusLabel(item.status)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p
              className={`text-sm font-medium tabular-nums ${
                item.kind === "deposit" ? "text-[var(--success)]" : "text-[var(--text-primary)]"
              }`}
            >
              {formatAmount(item)}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">{item.currency}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
