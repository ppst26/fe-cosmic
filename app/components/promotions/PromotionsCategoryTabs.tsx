"use client";

import React from "react";
import type {
  PromoHubCategoryFilterId,
  PromoHubMobileCategoryFilterId,
  PromotionsCategoryTab,
} from "@/app/types/promotions";
import { COSMIC_BTN_GLASS_PILL } from "../ui/cosmicButtonClasses";

/**
 * แถบฟิลเตอร์หมวดโปรโมชั่น — ใช้ในหน้า /promotions และ PromotionsDesktopHubLayout
 */
type PromotionsCategoryTabsProps =
  | {
      variant?: "default" | "flat";
      activeId: PromoHubCategoryFilterId;
      onSelect: (id: PromoHubCategoryFilterId) => void;
      className?: string;
      hubCategoryTabs: PromotionsCategoryTab<PromoHubCategoryFilterId>[];
      mobileActiveId?: never;
      onMobileSelect?: never;
      mobileCategoryTabs?: never;
    }
  | {
      variant: "mobile";
      mobileActiveId: PromoHubMobileCategoryFilterId;
      onMobileSelect: (id: PromoHubMobileCategoryFilterId) => void;
      className?: string;
      mobileCategoryTabs: PromotionsCategoryTab<PromoHubMobileCategoryFilterId>[];
      activeId?: never;
      onSelect?: never;
      hubCategoryTabs?: never;
    };

/**
 * แถบฟิลเตอร์หมวดโปรโมชั่น — ใช้ในหน้า /promotions และ PromotionsDesktopHubLayout
 */
export function PromotionsCategoryTabs(props: PromotionsCategoryTabsProps) {
  const { className, variant = "default" } = props;
  const isFlat = variant === "flat";
  const isMobile = variant === "mobile";

  const tabs = (isMobile ? props.mobileCategoryTabs : props.hubCategoryTabs) ?? [];

  return (
    <div
      className={[
        "promo-hub-category-tabs flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        isFlat ? "promotions-desktop-hub__category-track promo-hub-category-tabs--flat flex-wrap gap-2 p-0" : "",
        isMobile ? "promo-hub-category-tabs--mobile gap-3" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="tablist"
      aria-label="กรองโปรโมชั่นตามหมวด"
    >
      {tabs.map((tab) => {
        const selected = isMobile
          ? props.mobileActiveId === tab.id
          : props.activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              if (props.variant === "mobile") {
                props.onMobileSelect(tab.id as PromoHubMobileCategoryFilterId);
                return;
              }
              props.onSelect(tab.id as PromoHubCategoryFilterId);
            }}
            className={
              isMobile
                ? [
                    "promo-hub-category-tabs__mobile-pill shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    selected
                      ? "is-active"
                      : "bg-transparent text-[var(--text-secondary)]",
                  ].join(" ")
                : isFlat
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
