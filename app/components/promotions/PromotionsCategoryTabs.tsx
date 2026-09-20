"use client";

import React from "react";
import {
  PROMOTIONS_HUB_CATEGORY_TABS,
  type PromoHubCategoryFilterId,
} from "@/app/data/promotionsHubMockData";
import { COSMIC_BTN_GLASS_PILL, COSMIC_SEGMENT_GLASS_WHITE } from "../ui/cosmicButtonClasses";

/**
 * แถบฟิลเตอร์หมวดโปรโมชั่น — ใช้ในหน้า /promotions และ PromotionsDesktopHubLayout
 */
export function PromotionsCategoryTabs({
  activeId,
  onSelect,
  className,
  variant = "default",
}: {
  activeId: PromoHubCategoryFilterId;
  onSelect: (id: PromoHubCategoryFilterId) => void;
  className?: string;
  /** desktop hub sheet — segment glass ไม่ใช่ pill การ์ดซ้อน */
  variant?: "default" | "flat";
}) {
  const isFlat = variant === "flat";

  return (
    <div
      className={[
        "promo-hub-category-tabs flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        isFlat ? "promotions-desktop-hub__category-track promo-hub-category-tabs--flat flex-wrap gap-2 p-0" : "",
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
            className={
              isFlat
                ? `${COSMIC_BTN_GLASS_PILL} shrink-0 whitespace-nowrap !px-4 !py-2.5 !text-sm font-medium sm:!px-5 sm:!text-base ${
                    selected ? "is-active" : ""
                  }`
                : [
                    "glass-card--soft shrink-0 whitespace-nowrap rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-[background,color,box-shadow] duration-[var(--motion-fast)] sm:px-5 sm:py-2.5",
                    selected
                      ? "is-active text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  ].join(" ")
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
