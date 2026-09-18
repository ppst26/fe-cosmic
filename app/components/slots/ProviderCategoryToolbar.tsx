"use client";

import React, { useEffect, useId, useRef, useState } from "react";
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
  /** เปลี่ยนหมวด — ปิด dialog/search overlay โดยไม่ remount แถบ */
  scopeKey?: string;
}

/**
 * แถบมินิมอล — ปุ่มค้นหา (expand เป็น pill input) + ปุ่มตัวกรอง (เปิด dialog)
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();
  const filterActive = activeTabId !== "all-in-one" && activeTabId !== "all-providers";

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsFilterDialogOpen(false);
    setIsSearchOpen(false);
  }, [scopeKey]);

  const openSearch = () => {
    setIsFilterDialogOpen(false);
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    onSearchQueryChange("");
  };

  const openFilterDialog = () => {
    setIsSearchOpen(false);
    setIsFilterDialogOpen(true);
  };

  return (
    <>
      <div className="provider-category-toolbar w-full min-w-0">
        {/* Desktop — search pill + FILTER (borderless) */}
        <div className="provider-category-toolbar__desktop-row hidden min-w-0 lg:flex">
          <form
            className="provider-category-toolbar__search-field provider-category-toolbar__search-field--desktop"
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
            className={`provider-category-toolbar__pill-btn ${filterActive ? "is-filter-active" : ""}`}
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

        <div className="lg:hidden">
        {isSearchOpen ? (
          <div className="provider-category-toolbar__search-row">
            <form
              className="provider-category-toolbar__search-field"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor={searchInputId} className="sr-only">
                {searchPlaceholder}
              </label>
              <span className="text-[var(--text-muted)] shrink-0" aria-hidden="true">
                <SearchIcon className="h-[18px] w-[18px]" />
              </span>
              <input
                ref={inputRef}
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
              className="provider-category-toolbar__cancel"
              onClick={closeSearch}
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <div className="provider-category-toolbar__actions">
            <button
              type="button"
              className="provider-category-toolbar__icon-btn"
              aria-label="เปิดช่องค้นหา"
              onClick={openSearch}
            >
              <SearchIcon className="h-[19px] w-[19px]" />
            </button>
            <button
              type="button"
              className={`provider-category-toolbar__icon-btn ${filterActive ? "is-filter-active" : ""}`}
              aria-label={filterAriaLabel}
              aria-haspopup="dialog"
              aria-expanded={isFilterDialogOpen}
              onClick={openFilterDialog}
            >
              <FilterSlidersIcon className="h-[19px] w-[19px]" />
            </button>
          </div>
        )}
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
