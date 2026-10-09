"use client";

import React, { useState } from "react";
import { useActivities } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { ActivityDetailBody, ActivityHubThumb } from "./ActivityHubShared";
import { PromoHubPillLabel, promoCardButtonClass } from "../promotions/promoHubCardPrimitives";
import { CloseIcon } from "../ui/Icons";
import type { ActivityHubItem } from "@/app/types/activities";

type MobileView = "list" | "detail";

/**
 * กิจกรรมมือถือ — รายการเต็มความกว้าง แตะเข้าหน้ารายละเอียด (ปิดกลับรายการ)
 * ใช้ใน ActivitiesHubPageContent (ไม่ embedded หรือ embedded แต่ < lg)
 */
export function ActivitiesMobileHub() {
  const activitiesResource = useActivities();
  const [view, setView] = useState<MobileView>("list");
  const [selected, setSelected] = useState<ActivityHubItem | null>(null);

  const openDetail = (item: ActivityHubItem) => {
    setSelected(item);
    setView("detail");
  };

  const backToList = () => {
    setView("list");
  };

  if (view === "detail" && selected) {
    return (
      <div className="activities-mobile-hub flex flex-col gap-4 pb-2">
        <div className="relative flex h-12 w-full items-center justify-between">
          <div className="h-10 w-10 shrink-0" aria-hidden="true" />
          <h2 className="absolute left-1/2 max-w-[70%] -translate-x-1/2 truncate text-center text-base font-medium text-white">
            {selected.title}
          </h2>
          <button
            type="button"
            onClick={backToList}
            className="relative z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-end text-white transition-transform hover:text-white/80 active:scale-90"
            aria-label="ปิดรายละเอียดกิจกรรม"
          >
            <CloseIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="min-w-0 px-0 py-1">
          <ActivityDetailBody item={selected} showTitle={false} flat />
        </div>
      </div>
    );
  }

  return (
    <ResourceGate resource={activitiesResource} loadingLabel="กำลังโหลดกิจกรรม…" errorTitle="โหลดกิจกรรมไม่สำเร็จ">
      {(activities) => (
    <ul className="activities-mobile-hub flex flex-col gap-3" aria-label="รายการกิจกรรม">
      {activities.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => openDetail(item)}
            className={promoCardButtonClass("activity-hub-mobile-card flex gap-3 p-3")}
          >
            <ActivityHubThumb
              tone={item.thumbTone}
              imageUrl={item.imageUrl}
              overlay={item.statusOverlay}
              className="h-[72px] w-[72px]"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <span className="text-sm font-medium leading-snug text-[var(--text-primary)]">
                {item.title}
              </span>
              {item.listMeta ? (
                <span className="text-xs text-[var(--text-muted)]">{item.listMeta}</span>
              ) : null}
              <span className="mt-1 inline-flex">
                <PromoHubPillLabel label="ดูรายละเอียด" />
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
      )}
    </ResourceGate>
  );
}
