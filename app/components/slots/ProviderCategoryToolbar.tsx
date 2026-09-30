"use client";

import React, { useId } from "react";
import { SearchIcon } from "../ui/Icons";

export interface ProviderCategoryToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchPlaceholder?: string;
}

/**
 * แถบค้นหาค่ายเกม — ใช้ใน LobbyCategoryProviders และหน้าค่าย (/slots, /casino ฯลฯ)
 */
export function ProviderCategoryToolbar({
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder = "Game | Provider",
}: ProviderCategoryToolbarProps) {
  const searchInputId = useId();

  return (
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
      </div>
    </div>
  );
}
