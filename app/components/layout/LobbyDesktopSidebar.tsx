"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { CategoryId, CategoryItem } from "@/app/types/lobby";
import { CATEGORY_3D_ICONS } from "@/app/data/lobbyMockData";
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
function getCategoryIcon(id: CategoryId, className = "h-7 w-7 shrink-0 drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]") {
  const iconSrc = CATEGORY_3D_ICONS[id];
  if (iconSrc) {
    return (
      <Image
        src={iconSrc}
        alt=""
        width={48}
        height={48}
        className={cn("object-contain shrink-0 select-none pointer-events-none", className)}
      />
    );
  }

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
      <span className="lobby-desktop-sidebar__link-icon-wrap flex shrink-0 items-center justify-center" aria-hidden="true">
        <MenuItemIcon iconId={tile.iconId} className="h-5 w-5 shrink-0 text-current" />
      </span>
      <span className="lobby-desktop-sidebar__link-label min-w-0 flex-1 truncate">{tile.label}</span>
    </>
  );

  const linkLayout = "relative flex w-full items-center border-0 text-left";

  if (tile.action) {
    return (
      <button
        type="button"
        className={`lobby-desktop-sidebar__link cosmic-type-sidebar-link ${linkLayout}`}
        title={tile.label}
        onClick={() => onMenuAction?.(tile.action!)}
      >
        {inner}
      </button>
    );
  }

  if (tile.href) {
    const linkClass = `lobby-desktop-sidebar__link cosmic-type-sidebar-link ${linkLayout}`;
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
      className="lobby-desktop-sidebar-rail hidden shrink-0 lg:flex lg:w-full lg:min-w-0 lg:flex-col lg:flex-none lg:self-start lg:h-auto lg:overflow-visible lg:px-0"
      aria-label="เมนูหลักเดสก์ท็อป"
    >
      <div className="lobby-desktop-sidebar glass-sidebar lobby-desktop-sidebar--borderless relative flex w-full min-w-0 max-w-full flex-none flex-col h-auto min-h-0 overflow-hidden p-2 rounded-(--radius-panel)">
      <div className="lobby-desktop-sidebar__body flex flex-col min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain">
      <nav
        className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--primary"
        aria-label="หมวดเกม"
      >
        <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">เกม</p>
        <ul className="lobby-desktop-sidebar__list flex flex-col m-0 p-0">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "lobby-desktop-sidebar__link cosmic-type-sidebar-link-lg relative flex w-full items-center border-0 text-left",
                    isActive && "is-active",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={category.label}
                >
                  <span className="lobby-desktop-sidebar__link-icon-wrap flex shrink-0 items-center justify-center" aria-hidden="true">
                    {getCategoryIcon(category.id)}
                  </span>
                  <span className="lobby-desktop-sidebar__link-label min-w-0 flex-1 truncate">{category.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {SIDEBAR_MENU_SECTIONS.map((section) => (
        <nav
          key={section.id}
          className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--services shrink-0"
          aria-label={section.sectionLabel}
        >
          <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">
            {section.sectionLabel}
          </p>
          <ul className="lobby-desktop-sidebar__list flex flex-col m-0 p-0">
            {section.items.map((tile) => (
              <li key={tile.id}>{renderMenuTile(tile, onMenuAction)}</li>
            ))}
          </ul>
        </nav>
      ))}

      <nav className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--services shrink-0" aria-label="ระบบ">
        <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">ระบบ</p>
        <ul className="lobby-desktop-sidebar__list flex flex-col m-0 p-0">
          <li>
            <Link
              href="/support"
              className="lobby-desktop-sidebar__link cosmic-type-sidebar-link relative flex w-full items-center border-0 text-left"
              title="ติดต่อเรา"
            >
              <span className="lobby-desktop-sidebar__link-icon-wrap flex shrink-0 items-center justify-center" aria-hidden="true">
                <ContactNavIcon className="h-5 w-5 shrink-0" />
              </span>
              <span className="lobby-desktop-sidebar__link-label min-w-0 flex-1 truncate">ติดต่อเรา</span>
            </Link>
          </li>
        </ul>
      </nav>

      </div>
      </div>
    </aside>
  );
}
