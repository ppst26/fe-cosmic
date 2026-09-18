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
        "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
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
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors sm:px-5 sm:py-2.5 ${
              selected
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            style={selected ? { background: "var(--category-active-gradient)" } : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
