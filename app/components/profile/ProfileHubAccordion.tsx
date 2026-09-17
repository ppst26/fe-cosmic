"use client";

import React from "react";
import { ChevronDownIcon, ChevronRightIcon } from "../ui/Icons";

/**
 * แถวย่อยใน accordion โปรไฟล์
 */
export function ProfileHubRow({
  icon,
  title,
  onClick,
  trailing,
  showChevron = false,
}: {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  showChevron?: boolean;
}) {
  const className =
    "flex w-full items-center gap-2 rounded-[var(--radius-control)] px-1.5 py-1.5 text-left transition-colors hover:bg-[var(--surface-selected)]/30";

  const inner = (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)] text-[var(--icon-default)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-xs font-medium text-[var(--text-primary)]">{title}</span>
      {trailing}
      {showChevron && (
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--icon-default)]" />
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}

/**
 * กลุ่ม accordion — หัวข้อ + เปิด/ปิด
 */
export function ProfileHubAccordion({
  title,
  headerIcon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  headerIcon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="cosmic-inset-card overflow-hidden bg-[var(--surface-hover)]/50">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors hover:bg-[var(--surface-selected)]/25"
        aria-expanded={expanded}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)] text-[var(--icon-default)]">
          {headerIcon}
        </span>
        <span className="flex-1 text-xs font-bold text-[var(--text-primary)]">{title}</span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-[var(--icon-default)] transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded && (
        <div className="space-y-0 px-1 pb-1 pt-0.5">
          {children}
        </div>
      )}
    </section>
  );
}
