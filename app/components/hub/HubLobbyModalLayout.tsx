"use client";

import React, { type ReactNode } from "react";
import { CloseIcon, SearchIcon } from "@/app/components/ui/Icons";

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

      <div className="hub-lobby-modal__toolbar">
        {showSegment && onSegmentChange ? (
          <div className="hub-lobby-modal__segment" role="tablist" aria-label="โหมด lobby">
            {segmentButtons.map((item) => {
              const selected = segment === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`hub-lobby-modal__segment-btn${selected ? " is-active" : ""}`}
                  onClick={() => onSegmentChange(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <label className="hub-lobby-modal__search-wrap">
          <SearchIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
          <span className="sr-only">ค้นหาเกม</span>
          <input
            type="search"
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange?.(event.target.value)}
            autoComplete="off"
          />
        </label>

        {onFiltersClick ? (
          <button type="button" className="hub-lobby-modal__chrome-btn" onClick={onFiltersClick}>
            {filtersLabel}
          </button>
        ) : null}

        {onSortClick ? (
          <button type="button" className="hub-lobby-modal__chrome-btn" onClick={onSortClick}>
            {sortLabel}
          </button>
        ) : null}

        {toolbarExtra}

        {onClose ? (
          <button
            type="button"
            className="hub-lobby-modal__toolbar-close inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[var(--icon-default)] transition-colors hover:bg-[var(--hub-lobby-chrome)] hover:text-[var(--text-primary)]"
            aria-label="ปิด"
            onClick={onClose}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="hub-lobby-modal__body">
        <nav className="hub-lobby-modal__sidebar" aria-label="หมวดเกม">
          <ul className="hub-lobby-modal__nav">
            {categories.map((cat) => {
              const active = cat.id === activeCategoryId;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`hub-lobby-modal__nav-btn${active ? " is-active" : ""}`}
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
                  className={`hub-lobby-modal__nav-btn shrink-0${active ? " is-active" : ""}`}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="hub-lobby-modal__grid-scroll">
            <div className="hub-lobby-modal__grid">{children}</div>
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
  const className = "hub-lobby-game-tile";
  const inner = (
    <>
      <span className="hub-lobby-game-tile__cover">
        {imageSrc ? <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" /> : null}
        {badge ? <span className="hub-lobby-game-tile__badge">{badge}</span> : null}
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
