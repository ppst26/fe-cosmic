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
 * แถบค้นหา + ตัวกรอง — แสดงช่องค้นหาตลอด (มือถือ/desktop) · glass-control
 * ใช้แทน SlotFilterTabs + GameSearchBar บนหน้าค่ายเกมและ LobbyCategoryProviders
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

  const searchFieldClass =
    "provider-category-toolbar__search-field glass-control";

  return (
    <>
      <div className="provider-category-toolbar w-full min-w-0">
        <div className="provider-category-toolbar__desktop-row hidden min-w-0 lg:flex">
          <form
            className={`${searchFieldClass} provider-category-toolbar__search-field--desktop`}
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor={`${searchInputId}-desktop`} className="sr-only">
              {searchPlaceholder}
            </label>
            <span className="shrink-0 text-[var(--text-muted)]" aria-hidden="true">
              <SearchIcon className="h-[18px] w-[18px]" />
            </span>
            <input
              id={`${searchInputId}-desktop`}
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
            className={`provider-category-toolbar__pill-btn glass-control ${filterActive ? "is-filter-active" : ""}`}
            aria-label={filterAriaLabel}
            aria-haspopup="dialog"
            aria-expanded={isFilterDialogOpen}
            onClick={openFilterDialog}
          >
            <FilterSlidersIcon className="h-4 w-4" />
            <span>FILTER</span>
            <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
          </button>
        </div>

        <div className="provider-category-toolbar__mobile-row lg:hidden">
          <form
            className={searchFieldClass}
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
            className={`provider-category-toolbar__filter-btn glass-control glass-icon-btn ${filterActive ? "is-filter-active" : ""}`}
            aria-label={filterAriaLabel}
            aria-haspopup="dialog"
            aria-expanded={isFilterDialogOpen}
            onClick={openFilterDialog}
          >
            <FilterSlidersIcon className="h-[19px] w-[19px]" />
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
