"use client";

import React from "react";
import type {
  PromoHubCategoryFilterId,
  PromoHubMobileCategoryFilterId,
  PromotionsCategoryTab,
} from "@/app/types/promotions";
import { cn } from "@/lib/utils";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { COSMIC_SEGMENT_PROMO_CTA } from "../ui/cosmicButtonClasses";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

/** ป้ายแท็บหมวดตาม id (ฟิลเตอร์เป็น UI) — id ที่ไม่รู้จักใช้ label จาก catalog */
const CATEGORY_LABEL_KEYS: Record<
  PromoHubCategoryFilterId | PromoHubMobileCategoryFilterId,
  MessageKey<"promotions">
> = {
  all: "categories.all",
  slots: "categories.slots",
  casino: "categories.casino",
  sport: "categories.sport",
  "new-member": "categories.newMember",
  daily: "categories.daily",
  privilege: "categories.privilege",
};

function resolveCategoryLabel(t: ReturnType<typeof useT<"promotions">>, tab: PromotionsCategoryTab) {
  const key = (CATEGORY_LABEL_KEYS as Record<string, MessageKey<"promotions"> | undefined>)[tab.id];
  return key ? t(key) : tab.label;
}

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
  const t = useT("promotions");
  const categoryLabel = (tab: PromotionsCategoryTab) => resolveCategoryLabel(t, tab);

  if (props.variant === "mobile") {
    const { className, mobileActiveId, onMobileSelect, mobileCategoryTabs } = props;
    return (
      <div className={cn("flex w-full justify-center pb-1", className)}>
        <div
          className={cn(
            COSMIC_SEGMENT_PROMO_CTA,
            "promo-hub-category-tabs promo-hub-category-tabs--mobile inline-flex w-fit max-w-full gap-0.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
          role="tablist"
          aria-label={t("filterAria")}
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
                  "cosmic-segment-btn shrink-0 whitespace-nowrap px-2.5 py-1.5 text-xs font-medium sm:px-3 sm:py-1.5 sm:text-sm",
                  selected && "is-active",
                )}
              >
                {categoryLabel(tab)}
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
        tabs={tabs.map((tab) => ({ id: tab.id, label: categoryLabel(tab) }))}
        activeId={activeId}
        onSelect={onSelect}
        ariaLabel={t("filterAria")}
        scrollable
      />
    );
  }

  return (
    <div
      className={cn(
        COSMIC_SEGMENT_PROMO_CTA,
        "promo-hub-category-tabs inline-flex max-w-full gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      role="tablist"
      aria-label={t("filterAria")}
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
            className={cn(
              "cosmic-segment-btn shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium sm:px-5 sm:py-2.5",
              selected && "is-active",
            )}
          >
            {categoryLabel(tab)}
          </button>
        );
      })}
    </div>
  );
}
