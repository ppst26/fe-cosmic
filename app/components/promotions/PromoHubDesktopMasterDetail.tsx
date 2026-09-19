"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getPromotionDetail, type PromotionDetailId } from "@/app/data/promotionDetailMockData";
import {
  PROMOTIONS_HUB_ACTIVITIES,
  PROMOTIONS_HUB_FEATURED,
  PROMOTIONS_HUB_HERO,
  matchesPromoHubCategory,
  type PromoHubCategoryFilterId,
} from "@/app/data/promotionsHubMockData";
import { PromotionDetailPanel } from "./PromotionDetailPanel";
import { PromotionsCategoryTabs } from "./PromotionsCategoryTabs";

export type PromoHubDesktopKind = "promotions" | "activities";

interface PromoMasterListItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
}

/**
 * Master–detail โปร / กิจกรรม บน desktop hub — แยกตาม kind (ไม่รวมรายการในหน้าเดียว)
 * ใช้ใน PromotionsHubPageContent และ ActivitiesHubPageContent (embedded + lg+)
 */
export function PromoHubDesktopMasterDetail({ kind }: { kind: PromoHubDesktopKind }) {
  const [categoryFilter, setCategoryFilter] = useState<PromoHubCategoryFilterId>("all");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const listItems = useMemo(() => {
    const items: PromoMasterListItem[] = [];

    if (kind === "promotions") {
      if (matchesPromoHubCategory(PROMOTIONS_HUB_HERO.categories, categoryFilter)) {
        items.push({
          id: "hero-welcome",
          title: PROMOTIONS_HUB_HERO.title,
          subtitle: PROMOTIONS_HUB_HERO.subtitle,
          detailId: PROMOTIONS_HUB_HERO.detailId,
        });
      }

      for (const row of PROMOTIONS_HUB_FEATURED) {
        if (!matchesPromoHubCategory(row.categories, categoryFilter)) continue;
        items.push({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle,
          detailId: row.detailId,
        });
      }
    } else {
      for (const row of PROMOTIONS_HUB_ACTIVITIES) {
        if (!matchesPromoHubCategory(row.categories, categoryFilter)) continue;
        items.push({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle,
          detailId: row.detailId,
        });
      }
    }

    return items;
  }, [categoryFilter, kind]);

  useEffect(() => {
    if (listItems.length === 0) {
      setSelectedItemId(null);
      return;
    }
    setSelectedItemId((current) => {
      if (current && listItems.some((item) => item.id === current)) return current;
      return listItems[0].id;
    });
  }, [listItems]);

  const selectedItem = listItems.find((item) => item.id === selectedItemId) ?? null;
  const detailContent = selectedItem ? getPromotionDetail(selectedItem.detailId) : null;

  const emptyMessage =
    kind === "promotions"
      ? "ยังไม่มีโปรโมชั่นในหมวดนี้ — ลองเลือก All Promotions"
      : "ยังไม่มีกิจกรรมในหมวดนี้ — ลองเลือก All Promotions";

  const listAriaLabel = kind === "promotions" ? "รายการโปรโมชั่น" : "รายการกิจกรรม";

  return (
    <div className="promotions-desktop-hub flex min-h-0 flex-col gap-3">
      <div className="promotions-desktop-hub__tabs sticky top-0 z-10 -mx-[var(--page-gutter)] px-[var(--page-gutter)] pb-2 pt-0">
        <PromotionsCategoryTabs activeId={categoryFilter} onSelect={setCategoryFilter} />
      </div>

      {listItems.length === 0 ? (
        <p className="hub-desktop-card px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
          {emptyMessage}
        </p>
      ) : (
        <div
          className="promotions-desktop-hub__split grid min-h-[min(58dvh,520px)] gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-stretch"
        >
          <nav
            className="hub-desktop-card flex min-h-0 flex-col gap-0.5 overflow-y-auto p-2 [scrollbar-width:thin]"
            aria-label={listAriaLabel}
          >
            {listItems.map((item) => {
              const selected = item.id === selectedItemId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  aria-current={selected ? "true" : undefined}
                  className={`promotions-desktop-hub__row w-full rounded-[var(--radius-control)] px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "promotions-desktop-hub__row--selected bg-[var(--surface-selected)]/25"
                      : "hover:bg-[var(--surface-hover)]/40"
                  }`}
                >
                  <span className="block text-sm font-medium leading-snug text-[var(--text-primary)]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            className="hub-desktop-card min-h-0 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 [scrollbar-width:thin]"
            aria-live="polite"
            aria-label="รายละเอียดที่เลือก"
          >
            {detailContent ? (
              <PromotionDetailPanel key={detailContent.id} content={detailContent} variant="hub" />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
