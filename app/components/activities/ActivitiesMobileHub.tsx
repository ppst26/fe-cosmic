"use client";

import React, { useState } from "react";
import { ACTIVITIES_HUB_ITEMS, type ActivityHubItem } from "@/app/data/activitiesHubMockData";
import { ActivityDetailBody, ActivityHubThumb } from "./ActivityHubShared";
import { PromoHubPillLabel, promoCardButtonClass } from "../promotions/promoHubCardPrimitives";
import { COSMIC_BTN_GLASS_ICON, COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { ChevronLeftIcon } from "../ui/Icons";

type MobileView = "list" | "detail";

/**
 * กิจกรรมมือถือ — รายการเต็มความกว้าง แตะเข้าหน้ารายละเอียด (มีปุ่มกลับ)
 * ใช้ใน ActivitiesHubPageContent (ไม่ embedded หรือ embedded แต่ < lg)
 */
export function ActivitiesMobileHub() {
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={backToList}
            className={`${COSMIC_BTN_GLASS_ICON} shrink-0 text-[var(--icon-default)]`}
            aria-label="กลับรายการกิจกรรม"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="min-w-0 flex-1 text-base font-medium leading-snug text-[var(--text-primary)]">
            {selected.title}
          </h2>
        </div>
        <div className={`${COSMIC_PANEL_GLASS} px-3 py-4 sm:px-4`}>
          <ActivityDetailBody item={selected} showTitle={false} />
        </div>
      </div>
    );
  }

  return (
    <ul className="activities-mobile-hub flex flex-col gap-3" aria-label="รายการกิจกรรม">
      {ACTIVITIES_HUB_ITEMS.map((item) => (
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
  );
}
