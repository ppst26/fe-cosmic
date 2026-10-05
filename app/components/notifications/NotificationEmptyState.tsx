import React from "react";

/**
 * ว่าง — ไม่มีแจ้งเตือน (NotificationCenterPanel)
 */
export function NotificationEmptyState({ message }: { message: string }) {
  return (
    <div className="notification-center__empty flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="notification-center__empty-art" aria-hidden="true">
        <svg viewBox="0 0 120 96" className="h-[5.5rem] w-[6.75rem]" fill="none">
          <path
            d="M24 38h72v40c0 4-3 7-7 7H31c-4 0-7-3-7-7V38Z"
            className="fill-[var(--surface-mid)] stroke-[var(--border-subtle)]"
            strokeWidth="1.5"
          />
          <path
            d="M30 38 42 24h36l12 14"
            className="stroke-[var(--text-muted)]"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M48 52c6 8 18 8 24 0"
            className="stroke-[var(--text-secondary)]"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
          <circle cx="78" cy="30" r="2" className="fill-[var(--text-muted)]" />
        </svg>
      </div>
      <p className="mt-4 text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
