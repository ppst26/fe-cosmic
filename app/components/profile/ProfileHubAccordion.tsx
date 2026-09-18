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
    "profile-hub-row flex w-full items-center gap-2 rounded-[var(--radius-control)] px-2 py-1.5 text-left transition-colors hover:bg-[var(--surface-selected)]/25";

  const inner = (
    <>
      <span className="profile-hub-row__icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--icon-default)]">
        {icon}
      </span>
      <span className="profile-hub-row__title min-w-0 flex-1 font-semibold text-[var(--text-secondary)]">
        {title}
      </span>
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
    <section className="profile-hub-accordion overflow-hidden rounded-[var(--radius-panel)]">
      <button
        type="button"
        onClick={onToggle}
        className="profile-hub-accordion__trigger flex w-full items-center gap-2 px-2.5 py-2.5 text-left transition-colors"
        aria-expanded={expanded}
      >
        <span className="profile-hub-accordion__icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--icon-default)]">
          {headerIcon}
        </span>
        <span className="profile-hub-accordion__title flex-1 font-bold text-[var(--text-primary)]">
          {title}
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 text-[var(--icon-default)] transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded ? (
        <div className="profile-hub-accordion__panel">{children}</div>
      ) : null}
    </section>
  );
}
