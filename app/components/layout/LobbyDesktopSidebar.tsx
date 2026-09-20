"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CategoryId, CategoryItem } from "@/app/types/lobby";
import {
  CardsIcon,
  ContactNavIcon,
  FishIcon,
  FootballIcon,
  GameShowsIcon,
  HomeNavIcon,
  LiveCasinoIcon,
  PromoTicketIcon,
  SlotsIcon,
} from "../ui/Icons";
import {
  MENU_DIALOG_SECTIONS,
  type MenuDialogAction,
  type MenuDialogTile,
} from "@/app/data/menuMockData";
import { MenuItemIcon } from "./MenuItemIcon";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import { cn } from "@/lib/utils";

interface LobbyDesktopSidebarProps {
  categories: CategoryItem[];
  activeCategoryId: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
  onMenuAction?: (action: MenuDialogAction) => void;
  /** route = ไปหน้า /casino ฯลฯ · none = สลับ state บนหน้าเดียว (หน้าแรก) */
  navigationMode?: "route" | "none";
}

/** ไอคอนหมวด — ใช้ชุดเดียวกับ CategoryNav */
function getCategoryIcon(id: CategoryId, className = "h-5 w-5 shrink-0") {
  switch (id) {
    case "home":
      return <HomeNavIcon className={className} />;
    case "casino":
      return <LiveCasinoIcon className={className} />;
    case "slots":
      return <SlotsIcon className={className} />;
    case "fishing":
      return <FishIcon className={className} />;
    case "sports":
      return <FootballIcon className={className} />;
    case "lottery":
      return <PromoTicketIcon className={className} />;
    case "games":
      return <GameShowsIcon className={className} />;
    case "cards":
      return <CardsIcon className={className} />;
    default:
      return <LiveCasinoIcon className={className} />;
  }
}

function renderMenuTile(
  tile: MenuDialogTile,
  onMenuAction?: (action: MenuDialogAction) => void,
) {
  const inner = (
    <>
      <span className="lobby-desktop-sidebar__link-icon-wrap" aria-hidden="true">
        <MenuItemIcon iconId={tile.iconId} className="h-5 w-5 shrink-0 text-current" />
      </span>
      <span className="lobby-desktop-sidebar__link-label">{tile.label}</span>
    </>
  );

  if (tile.action) {
    return (
      <button
        type="button"
        className="lobby-desktop-sidebar__link cosmic-type-sidebar-link"
        title={tile.label}
        onClick={() => onMenuAction?.(tile.action!)}
      >
        {inner}
      </button>
    );
  }

  if (tile.href) {
    const linkClass = "lobby-desktop-sidebar__link cosmic-type-sidebar-link";
    if (hrefToHubId(tile.href)) {
      return (
        <HubNavLink href={tile.href} className={linkClass} title={tile.label}>
          {inner}
        </HubNavLink>
      );
    }
    return (
      <Link href={tile.href} className={linkClass} title={tile.label}>
        {inner}
      </Link>
    );
  }

  return null;
}

const SIDEBAR_MENU_SECTIONS = MENU_DIALOG_SECTIONS.filter(
  (section) =>
    section.id !== "personal" &&
    section.id !== "rewards" &&
    section.id !== "privileges",
);

/**
 * แถบนำทางซ้าย desktop — sticky · glass พื้นหลัง ไม่มีกรอบชัด
 * ถูกเรียกใช้ใน app/page.tsx ภายใน lobby-desktop-shell
 */
export function LobbyDesktopSidebar({
  categories,
  activeCategoryId,
  onSelectCategory,
  onMenuAction,
  navigationMode = "route",
}: LobbyDesktopSidebarProps) {
  const router = useRouter();

  const pushCategoryRoute = (href: string) => {
    const scrollY = window.scrollY;
    router.push(href, { scroll: false });
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleCategoryClick = (category: CategoryItem) => {
    onSelectCategory?.(category.id);
    if (navigationMode !== "route") return;
    if (category.href.startsWith("#")) {
      pushCategoryRoute(`/${category.href}`);
      return;
    }
    if (category.href.startsWith("/")) {
      pushCategoryRoute(category.href);
    }
  };

  return (
    <aside
      className="lobby-desktop-sidebar-rail hidden shrink-0 lg:flex"
      aria-label="เมนูหลักเดสก์ท็อป"
    >
      <div className="lobby-desktop-sidebar glass-sidebar lobby-desktop-sidebar--borderless">
      <div className="lobby-desktop-sidebar__body">
      <nav
        className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--primary"
        aria-label="หมวดเกม"
      >
        <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">เกม</p>
        <ul className="lobby-desktop-sidebar__list">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "lobby-desktop-sidebar__link cosmic-type-sidebar-link-lg",
                    isActive && "is-active",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={category.label}
                >
                  <span className="lobby-desktop-sidebar__link-icon-wrap" aria-hidden="true">
                    {getCategoryIcon(category.id)}
                  </span>
                  <span className="lobby-desktop-sidebar__link-label">{category.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {SIDEBAR_MENU_SECTIONS.map((section) => (
        <nav
          key={section.id}
          className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--services"
          aria-label={section.sectionLabel}
        >
          <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">
            {section.sectionLabel}
          </p>
          <ul className="lobby-desktop-sidebar__list">
            {section.items.map((tile) => (
              <li key={tile.id}>{renderMenuTile(tile, onMenuAction)}</li>
            ))}
          </ul>
        </nav>
      ))}

      <nav className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--services" aria-label="ระบบ">
        <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">ระบบ</p>
        <ul className="lobby-desktop-sidebar__list">
          <li>
            <Link
              href="/support"
              className="lobby-desktop-sidebar__link cosmic-type-sidebar-link"
              title="ติดต่อเรา"
            >
              <span className="lobby-desktop-sidebar__link-icon-wrap" aria-hidden="true">
                <ContactNavIcon className="h-5 w-5 shrink-0" />
              </span>
              <span className="lobby-desktop-sidebar__link-label">ติดต่อเรา</span>
            </Link>
          </li>
        </ul>
      </nav>

      </div>
      </div>
    </aside>
  );
}
