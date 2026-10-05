"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NotificationBellButtonProps {
  onClick?: () => void;
  className?: string;
  /** desktop popover ใช้ Trigger — ไม่ส่ง onClick */
  showBadge?: boolean;
  ariaExpanded?: boolean;
  ariaHaspopup?: "dialog" | "true";
}

/**
 * ปุ่มกระดิ่งแจ้งเตือน — Header desktop / mobile
 */
export function NotificationBellButton({
  onClick,
  className,
  showBadge = true,
  ariaExpanded,
  ariaHaspopup,
}: NotificationBellButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "header-desktop-bar__icon-btn glass-card--soft glass-icon-btn relative inline-flex shrink-0 items-center justify-center rounded-(--header-chip-radius) border-0",
        className,
      )}
      aria-label="การแจ้งเตือน"
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
    >
      <NotificationBellIcon />
      {showBadge ? (
        <span
          className="header-desktop-bar__badge absolute top-1.5 right-1.75 h-1.75 w-1.75 rounded-full"
          aria-hidden
        />
      ) : null}
    </button>
  );
}

function NotificationBellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 3a4.5 4.5 0 0 0-4.5 4.5v2.1c0 .5-.2 1-.55 1.35L5.8 13.2A1.2 1.2 0 0 0 6.75 15h10.5a1.2 1.2 0 0 0 .95-1.8l-1.15-2.25a2 2 0 0 1-.55-1.35V7.5A4.5 4.5 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 17a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
