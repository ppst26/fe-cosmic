"use client";

import React from "react";
import { ChevronRightIcon, CopyIcon } from "../ui/Icons";
import { cn } from "@/lib/utils";

type ProfileAccountFieldRowProps = {
  label: string;
  value: string;
  className?: string;
  onCopy?: () => void;
  copyLabel?: string;
  onEdit?: () => void;
  editLabel?: string;
};

/**
 * แถวข้อมูลบัญชี — label ซ้าย · ค่ากลาง · ปุ่ม copy/edit ขวา (ProfileAccountTabs)
 */
export function ProfileAccountFieldRow({
  label,
  value,
  className,
  onCopy,
  copyLabel = "คัดลอก",
  onEdit,
  editLabel = "แก้ไข",
}: ProfileAccountFieldRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[var(--radius-panel)] bg-[var(--surface-solid-inner)] px-3 py-3 sm:px-3.5 sm:py-3.5",
        className,
      )}
    >
      <span className="w-[5.5rem] shrink-0 text-xs text-[var(--text-secondary)] sm:w-24 sm:text-[13px]">
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-end text-sm font-medium text-[var(--text-primary)] tabular-nums">
        {value}
      </span>
      <div className="flex w-9 shrink-0 justify-end">
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--icon-active)] transition-colors hover:bg-white/[0.06]"
            aria-label={copyLabel}
          >
            <CopyIcon className="h-4 w-4" />
          </button>
        ) : null}
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--icon-active)] transition-colors hover:bg-white/[0.06]"
            aria-label={editLabel}
          >
            <ProfileFieldEditIcon className="h-4 w-4" />
          </button>
        ) : null}
        {!onCopy && !onEdit ? <span className="h-8 w-8" aria-hidden="true" /> : null}
      </div>
    </div>
  );
}

/**
 * แถวนำทางในแท็บบัญชี — เช่น VIP (ProfileAccountTabs)
 */
export function ProfileAccountNavRow({
  label,
  value,
  onClick,
  className,
}: {
  label: string;
  value?: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-[var(--radius-panel)] bg-[var(--surface-solid-inner)] px-3 py-3 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_5%,var(--surface-solid-inner))] sm:px-3.5 sm:py-3.5",
        className,
      )}
    >
      <span className="w-[5.5rem] shrink-0 text-xs text-[var(--text-secondary)] sm:w-24 sm:text-[13px]">
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-end text-sm font-medium text-[var(--text-primary)]">
        {value ?? ""}
      </span>
      <span className="flex w-9 shrink-0 justify-end text-[var(--icon-default)]">
        <ChevronRightIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

function ProfileFieldEditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3L16 4a2.1 2.1 0 0 0-3 0L4 13v4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m13.5 6.5 4 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
