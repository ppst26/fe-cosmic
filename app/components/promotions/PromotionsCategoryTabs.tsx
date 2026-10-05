"use client";

import React from "react";
import type {
  PromoHubCategoryFilterId,
  PromoHubMobileCategoryFilterId,
  PromotionsCategoryTab,
} from "@/app/types/promotions";
import { cn } from "@/lib/utils";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { COSMIC_SEGMENT_GLASS_WHITE } from "../ui/cosmicButtonClasses";

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
  if (props.variant === "mobile") {
    const { className, mobileActiveId, onMobileSelect, mobileCategoryTabs } = props;
    return (
      <div className={cn("flex w-full justify-center pb-1", className)}>
        <div
          className={cn(
            COSMIC_SEGMENT_GLASS_WHITE,
            "promo-hub-category-tabs promo-hub-category-tabs--mobile inline-flex max-w-full gap-1 overflow-x-auto p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
          role="tablist"
          aria-label="กรองโปรโมชั่นตามหมวด"
        >
          {mobileCategoryTabs.map((tab) => {
            const selected = mobileActiveId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onMobileSelect(tab.id)}
                className={cn(
                  "cosmic-segment-btn shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium sm:px-4",
                  selected && "is-active",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const { className, variant = "default", activeId, onSelect, hubCategoryTabs } = props;
  const isFlat = variant === "flat";
  const tabs = hubCategoryTabs;

  if (isFlat) {
    return (
      <CosmicLineTabs
        className={["promotions-desktop-hub__category-track promo-hub-category-tabs--flat", className]
          .filter(Boolean)
          .join(" ")}
        tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label }))}
        activeId={activeId}
        onSelect={onSelect}
        ariaLabel="กรองโปรโมชั่นตามหมวด"
        scrollable
      />
    );
  }

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
      {tabs.map((tab) => {
        const selected = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.id)}
            className={[
              "glass-card--soft shrink-0 whitespace-nowrap rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-[background,color,box-shadow,transform] duration-[var(--motion-base)] ease-[var(--ease-out)] active:scale-[0.97] sm:px-5 sm:py-2.5",
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
