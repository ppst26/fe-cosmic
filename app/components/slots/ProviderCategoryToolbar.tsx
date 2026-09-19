"use client";

import React, { useEffect, useId, useState } from "react";
import { ChevronDownIcon, FilterSlidersIcon, SearchIcon } from "../ui/Icons";
import { ProviderFilterDialog } from "./ProviderFilterDialog";
import type { GenericFilterTabItem } from "./SlotFilterTabs";

export interface ProviderCategoryToolbarProps {
  tabs: GenericFilterTabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchPlaceholder?: string;
  filterAriaLabel?: string;
  categoryGroupLabel?: string;
  /** เปลี่ยนหมวด — ปิด dialog โดยไม่ remount แถบ */
  scopeKey?: string;
}

/**
 * แถบค้นหา + ตัวกรอง — แถบเดียวทุก breakpoint (ไม่ซ้ำ mobile/desktop)
 * ใช้ใน LobbyCategoryProviders และหน้าค่าย (/slots, /casino ฯลฯ)
 */
export function ProviderCategoryToolbar({
  tabs,
  activeTabId,
  onSelectTab,
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder = "Game | Provider",
  filterAriaLabel = "ตัวกรองหมวดย่อย",
  categoryGroupLabel = "หมวดย่อย",
  scopeKey,
}: ProviderCategoryToolbarProps) {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const searchInputId = useId();
  const filterActive = activeTabId !== "all-in-one" && activeTabId !== "all-providers";

  useEffect(() => {
    setIsFilterDialogOpen(false);
  }, [scopeKey]);

  const openFilterDialog = () => {
    setIsFilterDialogOpen(true);
  };

  return (
    <>
      <div className="provider-category-toolbar w-full min-w-0">
        <div className="provider-category-toolbar__row">
          <form
            className="provider-category-toolbar__search-field glass-card--soft"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor={searchInputId} className="sr-only">
              {searchPlaceholder}
            </label>
            <span className="shrink-0 text-[var(--text-muted)]" aria-hidden="true">
              <SearchIcon className="h-[18px] w-[18px]" />
            </span>
            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="provider-category-toolbar__search-input"
              autoComplete="off"
              spellCheck={false}
            />
          </form>

          <button
            type="button"
            className={`provider-category-toolbar__filter-btn glass-card--soft ${filterActive ? "is-filter-active" : ""}`}
            aria-label={filterAriaLabel}
            aria-haspopup="dialog"
            aria-expanded={isFilterDialogOpen}
            onClick={openFilterDialog}
          >
            <FilterSlidersIcon className="h-[19px] w-[19px] shrink-0 lg:h-4 lg:w-4" />
            <span className="provider-category-toolbar__filter-label">FILTER</span>
            <ChevronDownIcon className="provider-category-toolbar__filter-chevron h-3.5 w-3.5 shrink-0 opacity-70" />
          </button>
        </div>
      </div>

      <ProviderFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        tabs={tabs}
        activeTabId={activeTabId}
        onApply={onSelectTab}
        categoryGroupLabel={categoryGroupLabel}
      />
    </>
  );
}
