"use client";

import React, { useState } from "react";
import {
  NOTIFICATION_EMPTY_MESSAGE,
  NOTIFICATION_TABS,
  type NotificationTabId,
} from "@/app/data/notificationsMockData";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationPopoverFooter } from "./NotificationPopoverFooter";
import { cn } from "@/lib/utils";

interface NotificationCenterPanelProps {
  /** mobile sheet — ไม่จำกัดความสูงแคบ */
  variant?: "popover" | "sheet";
}

/**
 * เนื้อหากล่องแจ้งเตือน — แท็บ 3 ช่อง + empty state (desktop popover · mobile sheet)
 */
export function NotificationCenterPanel({ variant = "popover" }: NotificationCenterPanelProps) {
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");

  return (
    <div
      className={cn(
        "notification-center flex min-h-0 flex-col",
        variant === "popover" ? "notification-center--popover" : "notification-center--sheet",
      )}
    >
      <div
        className="notification-center__segment notification-center__segment--tabs cosmic-segment-track grid grid-cols-3 gap-1"
        role="tablist"
        aria-label="ประเภทการแจ้งเตือน"
      >
        {NOTIFICATION_TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                "cosmic-segment-btn min-h-9 px-1 py-2 text-xs font-medium sm:text-[13px]",
                selected && "is-active",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="notification-center__body min-h-0 flex-1"
        role="tabpanel"
        aria-live="polite"
      >
        <NotificationEmptyState message={NOTIFICATION_EMPTY_MESSAGE} />
      </div>
    </div>
  );
}
