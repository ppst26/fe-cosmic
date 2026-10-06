"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { matchesPromoHubMobileCategory } from "@/lib/promotions/promotionFilters";
import type {
  PromoHubMobileListItem,
  PromoHubMobileCategoryFilterId,
  PromotionDetailId,
} from "@/app/types/promotions";
import { PromotionsCategoryTabs } from "./PromotionsCategoryTabs";
import { usePromotionsCatalog } from "./PromotionsCatalogProvider";
import { cn } from "@/lib/utils";

interface PromotionsMobileFeedProps {
  onOpenDetail: (id: PromotionDetailId) => void;
}

/**
 * หน้าโปรโมชั่นมือถือ — แท็บหมวด + รายการแนวตั้ง (รูป · ชื่อ · หมดเขต · อ่านเงื่อนไข)
 */
export function PromotionsMobileFeed({ onOpenDetail }: PromotionsMobileFeedProps) {
  const { catalog } = usePromotionsCatalog();
  const [categoryFilter, setCategoryFilter] = useState<PromoHubMobileCategoryFilterId>("all");

  const mobileList = catalog?.mobileList ?? [];
  const mobileTabs = catalog?.mobileCategoryTabs ?? [];

  const items = useMemo(
    () =>
      mobileList.filter((item) =>
        matchesPromoHubMobileCategory(item.mobileCategories, categoryFilter),
      ),
    [mobileList, categoryFilter],
  );

  if (!catalog) return null;

  return (
    <div className="promotions-mobile-feed flex flex-col gap-2 pb-2">
      <PromotionsCategoryTabs
        variant="mobile"
        mobileActiveId={categoryFilter}
        onMobileSelect={setCategoryFilter}
        mobileCategoryTabs={mobileTabs}
      />

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--text-secondary)]">
          ยังไม่มีโปรโมชั่นในหมวดนี้
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0 pt-1">
          {items.map((item) => (
            <li key={item.id}>
              <PromotionsMobileListCard item={item} onOpenDetail={onOpenDetail} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PromotionsMobileListCard({
  item,
  onOpenDetail,
}: {
  item: PromoHubMobileListItem;
  onOpenDetail: (id: PromotionDetailId) => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "promotions-mobile-feed__card group flex w-full flex-col overflow-hidden text-left",
        "glass-card--soft rounded-[var(--radius-panel)]",
        "cursor-pointer border-0 p-0 outline-none",
        "transition-[transform,opacity,box-shadow] duration-[var(--motion-fast)]",
        "active:scale-[0.995] active:opacity-95",
      )}
      onClick={() => onOpenDetail(item.detailId)}
      aria-label={`${item.title} — อ่านเงื่อนไข`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface-hover)]">
        <Image
          src={item.bannerSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          className="object-cover object-center transition-transform duration-200 group-hover:scale-[1.01]"
        />
      </div>

      <div className="flex flex-col gap-0 px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4 sm:pt-3.5">
        <h2 className="text-base font-medium leading-snug text-[var(--text-primary)]">
          {item.title}
        </h2>

        <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)]/50 pt-2.5">
          <span className="text-xs font-medium text-[var(--text-muted)] sm:text-sm">
            หมดเขต {item.expiresLabel}
          </span>
          <span
            className="shrink-0 text-xs font-medium text-[var(--accent-primary)] sm:text-sm"
            aria-hidden="true"
          >
            อ่านเงื่อนไข
          </span>
        </div>
      </div>
    </button>
  );
}