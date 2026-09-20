"use client";

import React from "react";
import {
  PROMOTIONS_HUB_CATEGORY_TABS,
  type PromoHubCategoryFilterId,
} from "@/app/data/promotionsHubMockData";

/**
 * แถบฟิลเตอร์หมวดโปรโมชั่น — ใช้ในหน้า /promotions และ PromotionsDesktopHubLayout
 */
export function PromotionsCategoryTabs({
  activeId,
  onSelect,
  className,
}: {
  activeId: PromoHubCategoryFilterId;
  onSelect: (id: PromoHubCategoryFilterId) => void;
  className?: string;
}) {
  return (
    <div
      className={[
        "promo-hub-category-tabs flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="tablist"
      aria-label="กรองโปรโมชั่นตามหมวด"
    >
      {PROMOTIONS_HUB_CATEGORY_TABS.map((tab) => {
        const selected = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.id)}
            className={[
              "glass-card--soft shrink-0 whitespace-nowrap rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-[background,color,box-shadow] duration-[var(--motion-fast)] sm:px-5 sm:py-2.5",
              selected
                ? "is-active text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
