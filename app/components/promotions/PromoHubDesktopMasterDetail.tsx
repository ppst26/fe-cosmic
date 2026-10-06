"use client";

import React, { useEffect, useMemo, useState } from "react";
import { matchesPromoHubCategory } from "@/lib/promotions/promotionFilters";
import type {
  PromotionDetailContent,
  PromotionDetailId,
  PromoHubCategoryFilterId,
} from "@/app/types/promotions";
import { PromotionDetailPanel } from "./PromotionDetailPanel";
import { PromotionsCategoryTabs } from "./PromotionsCategoryTabs";
import { usePromotionsCatalog } from "./PromotionsCatalogProvider";

export type PromoHubDesktopKind = "promotions" | "activities";

interface PromoMasterListItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
}

/**
 * Master–detail โปร / กิจกรรม บน desktop hub — แยกตาม kind (ไม่รวมรายการในหน้าเดียว)
 * ใช้ใน PromotionsHubPageContent (embedded + lg+)
 */
export function PromoHubDesktopMasterDetail({ kind }: { kind: PromoHubDesktopKind }) {
  const { catalog, fetchDetail, getCachedDetail } = usePromotionsCatalog();
  const [categoryFilter, setCategoryFilter] = useState<PromoHubCategoryFilterId>("all");
  const [pickedItemId, setSelectedItemId] = useState<string | null>(null);
  const [fetchedDetail, setFetchedDetail] = useState<{
    id: PromotionDetailId;
    content: PromotionDetailContent | null;
  } | null>(null);

  const listItems = useMemo(() => {
    const items: PromoMasterListItem[] = [];
    if (!catalog) return items;

    if (kind === "promotions") {
      const { hero, featured, activities } = catalog;
      if (matchesPromoHubCategory(hero.categories, categoryFilter)) {
        items.push({
          id: "hero-welcome",
          title: hero.title,
          subtitle: hero.subtitle,
          detailId: hero.detailId,
        });
      }

      for (const row of featured) {
        if (!matchesPromoHubCategory(row.categories, categoryFilter)) continue;
        items.push({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle,
          detailId: row.detailId,
        });
      }

      for (const row of activities) {
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
  }, [catalog, categoryFilter, kind]);

  /** id ที่เลือกหายจากรายการ (เปลี่ยนหมวด) → ใช้รายการแรกแทน คำนวณตอน render */
  const selectedItem =
    listItems.find((item) => item.id === pickedItemId) ?? listItems[0] ?? null;
  const selectedItemId = selectedItem?.id ?? null;
  const selectedDetailId = selectedItem?.detailId ?? null;

  useEffect(() => {
    if (!selectedDetailId || getCachedDetail(selectedDetailId)) return;

    let cancelled = false;
    fetchDetail(selectedDetailId)
      .catch(() => null)
      .then((detail) => {
        if (!cancelled) setFetchedDetail({ id: selectedDetailId, content: detail });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDetailId, fetchDetail, getCachedDetail]);

  const detailContent = selectedDetailId
    ? (getCachedDetail(selectedDetailId) ??
      (fetchedDetail?.id === selectedDetailId ? fetchedDetail.content : null))
    : null;

  const emptyMessage =
    kind === "promotions"
      ? "ยังไม่มีโปรโมชั่นในหมวดนี้ — ลองเลือก All Promotions"
      : "ยังไม่มีกิจกรรมในหมวดนี้ — ลองเลือก All Promotions";

  const listAriaLabel = kind === "promotions" ? "รายการโปรโมชั่น" : "รายการกิจกรรม";
  const hubTabs = catalog?.hubCategoryTabs ?? [];

  if (!catalog) return null;

  return (
    <div className="promotions-desktop-hub promotions-desktop-hub--flat flex min-h-0 flex-col gap-3">
      <div className="promotions-desktop-hub__tabs sticky top-0 z-10 pb-2 pt-0">
        <PromotionsCategoryTabs
          activeId={categoryFilter}
          onSelect={setCategoryFilter}
          variant="flat"
          hubCategoryTabs={hubTabs}
        />
      </div>

      {listItems.length === 0 ? (
        <p className="promotions-desktop-hub__empty py-10 text-center text-base text-[var(--text-secondary)]">
          {emptyMessage}
        </p>
      ) : (
        <div
          className="promotions-desktop-hub__split grid min-h-[min(58dvh,520px)] lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-stretch"
        >
          <nav
            className="promotions-desktop-hub__list flex min-h-0 flex-col overflow-y-auto [scrollbar-width:thin]"
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
                  className={`promotions-desktop-hub__row w-full px-2.5 py-3 text-left transition-colors ${
                    selected ? "promotions-desktop-hub__row--selected" : "hover:bg-[var(--surface-hover)]/25"
                  }`}
                >
                  <span className="block text-base font-medium leading-snug text-[var(--text-primary)]">
                    {item.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            className="promotions-desktop-hub__detail min-h-0 overflow-y-auto [scrollbar-width:thin]"
            aria-live="polite"
            aria-label="รายละเอียดที่เลือก"
          >
            {detailContent ? (
              <PromotionDetailPanel key={detailContent.id} content={detailContent} variant="hub" />
            ) : (
              <p className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
                กำลังโหลดรายละเอียด…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
