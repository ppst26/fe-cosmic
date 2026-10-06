"use client";

import React, { useState } from "react";
import { useActivities } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { ActivityDetailBody, ActivityHubThumb } from "./ActivityHubShared";
import type { ActivityHubItem } from "@/app/types/activities";

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
      className={`activity-hub-master-row w-full rounded-[var(--radius-panel)] p-2.5 text-left transition-[border-color,box-shadow,background] duration-200 ${
        selected ? "activity-hub-master-row--selected" : ""
      }`}
    >
      <div className="flex gap-3">
        <ActivityHubThumb
          tone={item.thumbTone}
          imageUrl={item.imageUrl}
          overlay={item.statusOverlay}
          className="h-[72px] w-[72px] sm:h-20 sm:w-20"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
          <span className="text-sm font-medium leading-snug text-[var(--text-primary)]">
            {item.title}
          </span>
          {item.listMeta ? (
            <span className="text-xs leading-relaxed text-[var(--text-secondary)]">{item.listMeta}</span>
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
  const activitiesResource = useActivities();
  return (
    <ResourceGate resource={activitiesResource} loadingLabel="กำลังโหลดกิจกรรม…" errorTitle="โหลดกิจกรรมไม่สำเร็จ">
      {(activities) => <ActivitiesDesktopHubContent activities={activities} />}
    </ResourceGate>
  );
}

function ActivitiesDesktopHubContent({ activities }: { activities: ActivityHubItem[] }) {
  const [pickedId, setSelectedId] = useState(activities[0]?.id ?? "");

  /** id ที่เลือกหายจากรายการ → ใช้รายการแรกแทน (คำนวณตอน render ไม่ต้อง sync state) */
  const selected = activities.find((item) => item.id === pickedId) ?? activities[0];
  const selectedId = selected?.id ?? "";

  return (
    <div className="activities-desktop-hub activities-desktop-hub--flat grid min-h-[min(58dvh,560px)] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-stretch lg:gap-5">
      <nav
        className="activities-desktop-hub__list flex min-h-0 flex-col gap-2 overflow-y-auto [scrollbar-width:thin]"
        aria-label="รายการกิจกรรม"
      >
        {activities.map((item) => (
          <ActivityMasterRow
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onSelect={() => setSelectedId(item.id)}
          />
        ))}
      </nav>

      <div
        className="activities-desktop-hub__detail min-h-0 overflow-y-auto [scrollbar-width:thin]"
        aria-live="polite"
      >
        {selected ? <ActivityDetailBody key={selected.id} item={selected} flat /> : null}
      </div>
    </div>
  );
}
