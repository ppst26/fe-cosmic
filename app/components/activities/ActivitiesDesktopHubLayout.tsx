"use client";

import React, { useEffect, useState } from "react";
import { ACTIVITIES_HUB_ITEMS, type ActivityHubItem } from "@/app/data/activitiesHubMockData";
import { ActivityDetailBody, ActivityHubThumb } from "./ActivityHubShared";

function ActivityMasterRow({
  item,
  selected,
  onSelect,
}: {
  item: ActivityHubItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`activity-hub-master-row w-full rounded-[var(--radius-panel)] p-2 text-left transition-colors ${
        selected ? "activity-hub-master-row--selected" : "hover:bg-[var(--surface-hover)]/35"
      }`}
    >
      <div className="flex gap-3">
        <ActivityHubThumb
          tone={item.thumbTone}
          overlay={item.statusOverlay}
          className="h-[72px] w-[72px] sm:h-20 sm:w-20"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
          <span className="text-sm font-extrabold leading-snug text-[var(--text-primary)]">
            {item.title}
          </span>
          {item.listMeta ? (
            <span className="text-[11px] leading-relaxed text-[var(--text-muted)]">{item.listMeta}</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

/**
 * กิจกรรม desktop hub — รายการซ้าย (รูป+สถานะ) · รายละเอียดขวา (เทิร์น/ตาราง)
 * ใช้ใน ActivitiesHubPageContent (embedded + lg+)
 */
export function ActivitiesDesktopHubLayout() {
  const [selectedId, setSelectedId] = useState(ACTIVITIES_HUB_ITEMS[0]?.id ?? "");

  useEffect(() => {
    if (!ACTIVITIES_HUB_ITEMS.some((item) => item.id === selectedId)) {
      setSelectedId(ACTIVITIES_HUB_ITEMS[0]?.id ?? "");
    }
  }, [selectedId]);

  const selected = ACTIVITIES_HUB_ITEMS.find((item) => item.id === selectedId) ?? ACTIVITIES_HUB_ITEMS[0];

  return (
    <div className="activities-desktop-hub grid min-h-[min(58dvh,540px)] gap-4 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-stretch">
      <nav
        className="hub-desktop-card flex min-h-0 flex-col gap-2 overflow-y-auto p-2 [scrollbar-width:thin]"
        aria-label="รายการกิจกรรม"
      >
        {ACTIVITIES_HUB_ITEMS.map((item) => (
          <ActivityMasterRow
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onSelect={() => setSelectedId(item.id)}
          />
        ))}
      </nav>

      <div
        className="hub-desktop-card min-h-0 overflow-y-auto px-3 py-4 sm:px-5 [scrollbar-width:thin]"
        aria-live="polite"
      >
        {selected ? <ActivityDetailBody key={selected.id} item={selected} /> : null}
      </div>
    </div>
  );
}
