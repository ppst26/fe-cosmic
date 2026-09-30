"use client";

import React, { type ReactNode } from "react";
import { CloseIcon, SearchIcon } from "@/app/components/ui/Icons";
import { CosmicLineTabs } from "@/app/components/ui/CosmicLineTabs";

export type HubLobbySegmentId = "casino" | "sports";

export interface HubLobbyCategoryItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface HubLobbyModalLayoutProps {
  /** หัวข้อสำหรับ screen reader */
  ariaTitle: string;
  segment: HubLobbySegmentId;
  onSegmentChange?: (id: HubLobbySegmentId) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  categories: HubLobbyCategoryItem[];
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
  onFiltersClick?: () => void;
  onSortClick?: () => void;
  onClose?: () => void;
  showSegment?: boolean;
  filtersLabel?: string;
  sortLabel?: string;
  children: ReactNode;
  toolbarExtra?: ReactNode;
}

/**
 * โครง lobby modal แบบ Dexsport — ใส่ใน Dialog.Content ที่มี class cosmic-modal-shell--lobby
 * อ้าง design.md § Dialog & Modal — Lobby catalog (XL)
 * ใช้คู่กับ HubLobbyGameTile สำหรับการ์ดใน grid
 */
export function HubLobbyModalLayout({
  ariaTitle,
  segment,
  onSegmentChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  categories,
  activeCategoryId,
  onCategoryChange,
  onFiltersClick,
  onSortClick,
  onClose,
  showSegment = true,
  filtersLabel = "Filters",
  sortLabel = "Sort By",
  children,
  toolbarExtra,
}: HubLobbyModalLayoutProps) {
  const segmentButtons: { id: HubLobbySegmentId; label: string }[] = [
    { id: "casino", label: "Casino" },
    { id: "sports", label: "Sports" },
  ];

  return (
    <div className="hub-lobby-modal min-h-0 flex-1">
      <p className="sr-only">{ariaTitle}</p>

      <div className="hub-lobby-modal__toolbar flex shrink-0 flex-wrap items-center gap-x-3 gap-y-[0.65rem] px-4 pt-3 pb-[0.65rem]">
        {showSegment && onSegmentChange ? (
          <CosmicLineTabs
            className="hub-lobby-modal__segment-tabs shrink-0 min-w-[min(100%,14rem)]"
            tabs={segmentButtons.map((item) => ({ id: item.id, label: item.label }))}
            activeId={segment}
            onSelect={onSegmentChange}
            ariaLabel="โหมด lobby"
            columns={2}
          />
        ) : null}

        <label className="hub-lobby-modal__search-wrap flex min-w-[min(100%,12rem)] flex-[1_1_12rem] items-center gap-2 h-[42px] px-[0.85rem] rounded-[10px]">
          <SearchIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
          <span className="sr-only">ค้นหาเกม</span>
          <input
            type="search"
            className="min-w-0 flex-1"
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange?.(event.target.value)}
            autoComplete="off"
          />
        </label>

        {onFiltersClick ? (
          <button
            type="button"
            className="hub-lobby-modal__chrome-btn inline-flex shrink-0 items-center gap-[0.4rem] min-h-[42px] px-[0.85rem] rounded-[10px]"
            onClick={onFiltersClick}
          >
            {filtersLabel}
          </button>
        ) : null}

        {onSortClick ? (
          <button
            type="button"
            className="hub-lobby-modal__chrome-btn inline-flex shrink-0 items-center gap-[0.4rem] min-h-[42px] px-[0.85rem] rounded-[10px]"
            onClick={onSortClick}
          >
            {sortLabel}
          </button>
        ) : null}

        {toolbarExtra}

        {onClose ? (
          <button
            type="button"
            className="hub-lobby-modal__toolbar-close ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[var(--icon-default)] transition-colors hover:bg-[var(--hub-lobby-chrome)] hover:text-[var(--text-primary)]"
            aria-label="ปิด"
            onClick={onClose}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="hub-lobby-modal__body">
        <nav
          className="hub-lobby-modal__sidebar hidden w-(--hub-lobby-sidebar-width) shrink-0 overflow-y-auto pt-[0.65rem] pr-2 pb-4 pl-3 lg:block"
          aria-label="หมวดเกม"
        >
          <ul className="hub-lobby-modal__nav flex flex-col gap-0.5 m-0 p-0 list-none">
            {categories.map((cat) => {
              const active = cat.id === activeCategoryId;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`hub-lobby-modal__nav-btn flex w-full items-center gap-[0.55rem] min-h-10 px-[0.65rem] py-[0.35rem] border-0 rounded-lg text-left${active ? " is-active" : ""}`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => onCategoryChange(cat.id)}
                  >
                    {cat.icon}
                    <span className="truncate">{cat.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hub-lobby-modal__main">
          <div
            className="hub-lobby-modal__categories-mobile"
            role="tablist"
            aria-label="หมวดเกม"
          >
            {categories.map((cat) => {
              const active = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`hub-lobby-modal__nav-btn flex w-full items-center gap-[0.55rem] min-h-10 px-[0.65rem] py-[0.35rem] border-0 rounded-lg text-left shrink-0${active ? " is-active" : ""}`}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="hub-lobby-modal__grid-scroll">
            <div className="hub-lobby-modal__grid grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HubLobbyGameTileProps {
  title: string;
  provider: string;
  imageSrc?: string;
  imageAlt?: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

/**
 * การ์ดเกมใน grid ของ HubLobbyModalLayout
 */
export function HubLobbyGameTile({
  title,
  provider,
  imageSrc,
  imageAlt = "",
  badge,
  href,
  onClick,
}: HubLobbyGameTileProps) {
  const className = "hub-lobby-game-tile flex flex-col gap-[0.35rem] p-0 text-left";
  const inner = (
    <>
      <span className="hub-lobby-game-tile__cover relative aspect-[3/4] overflow-hidden rounded-[14px]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        {badge ? (
          <span className="hub-lobby-game-tile__badge absolute top-[0.4rem] left-[0.4rem] px-[0.4rem] py-[0.15rem] rounded-md">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="hub-lobby-game-tile__title line-clamp-2">{title}</span>
      <span className="hub-lobby-game-tile__provider truncate">{provider}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {inner}
    </button>
  );
}
