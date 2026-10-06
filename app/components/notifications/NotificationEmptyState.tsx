import React from "react";

/**
 * ว่าง — ไม่มีแจ้งเตือน (NotificationCenterPanel)
 */
export function NotificationEmptyState({ message }: { message: string }) {
  return (
    <div className="notification-center__empty flex flex-col items-center justify-center px-4 py-8 text-center">
      <div className="notification-center__empty-art" aria-hidden="true">
        <svg viewBox="0 0 120 100" className="h-[5.75rem] w-[7rem]" fill="none">
          <path
            d="M38 18c4-6 10-8 22-8s18 2 22 8l8 14H30l8-14Z"
            className="fill-[color-mix(in_srgb,var(--action-solid)_24%,var(--surface-mid))]"
          />
          <path
            d="M24 40h72v42c0 5-4 9-9 9H33c-5 0-9-4-9-9V40Z"
            className="fill-[var(--inner-card-fill)] stroke-[color-mix(in_srgb,var(--border-subtle)_70%,transparent)]"
            strokeWidth="1.5"
          />
          <path
            d="M30 40 44 26h32l14 14"
            className="stroke-[color-mix(in_srgb,var(--action-solid)_50%,var(--text-muted))]"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle
            cx="44"
            cy="14"
            r="2"
            className="fill-[color-mix(in_srgb,var(--action-solid)_70%,white)]"
          />
          <circle
            cx="58"
            cy="10"
            r="1.5"
            className="fill-[color-mix(in_srgb,var(--action-solid)_55%,white)]"
          />
          <circle
            cx="72"
            cy="15"
            r="1.75"
            className="fill-[color-mix(in_srgb,var(--action-solid)_60%,white)]"
          />
          <path
            d="M48 58c6 7 18 7 24 0"
            className="stroke-[var(--text-muted)]"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
        </svg>
      </div>
      <p className="mt-3 text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
