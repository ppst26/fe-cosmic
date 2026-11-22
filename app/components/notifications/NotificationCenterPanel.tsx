"use client";

import React, { useState } from "react";
import {
  NOTIFICATION_EMPTY_MESSAGE_KEY,
  NOTIFICATION_TABS,
} from "@/app/data/notificationsMockData";
import { useNotificationFeed } from "@/app/hooks/api/account";
import { useT } from "@/lib/i18n/I18nProvider";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationPopoverFooter } from "./NotificationPopoverFooter";
import { cn } from "@/lib/utils";
import { COSMIC_SHEET_SEGMENT_TRACK_CLASS } from "../ui/cosmicButtonClasses";
import type { NotificationTabId } from "@/app/types/notifications";

interface NotificationCenterPanelProps {
  /** mobile sheet — ไม่จำกัดความสูงแคบ */
  variant?: "popover" | "sheet";
}

/**
 * เนื้อหากล่องแจ้งเตือน — แท็บ 3 ช่อง + empty state (desktop popover · mobile sheet)
 */
export function NotificationCenterPanel({ variant = "popover" }: NotificationCenterPanelProps) {
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");
  const t = useT("common");
  const feed = useNotificationFeed();
  const visibleItems = (feed.data?.items ?? []).filter((item) => activeTab === "all" || item.kind === activeTab);

  return (
    <div
      className={cn(
        "notification-center flex min-h-0 flex-col",
        variant === "popover" ? "notification-center--popover" : "notification-center--sheet",
      )}
    >
      <div
        className={cn(
          "notification-center__segment notification-center__segment--tabs",
          COSMIC_SHEET_SEGMENT_TRACK_CLASS,
          "grid grid-cols-3 gap-1",
        )}
        role="tablist"
        aria-label={t("notifications.tabsLabel")}
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
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      <div
        className="notification-center__body min-h-0 flex-1"
        role="tabpanel"
        aria-live="polite"
      >
        {visibleItems.length === 0 ? (
          <NotificationEmptyState message={t(NOTIFICATION_EMPTY_MESSAGE_KEY)} />
        ) : (
          <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
            {visibleItems.map((item) => (
              <li key={item.id} className="rounded-xl bg-white/[0.06] px-3.5 py-3 text-left">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                  {item.read ? null : (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
