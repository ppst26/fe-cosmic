"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import type { CategoryId, CategoryItem } from "@/app/types/lobby";
import { ContactNavIcon } from "../ui/Icons";
import { Menu3DIcon } from "@/app/components/ui/Menu3DIcon";
import {
  MENU_DIALOG_SECTIONS,
} from "@/app/data/menuMockData";
import { MenuItemIcon } from "./MenuItemIcon";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MenuDialogAction, MenuDialogTile } from "@/app/types/menu";

interface LobbyDesktopSidebarProps {
  categories: CategoryItem[];
  activeCategoryId: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
  onMenuAction?: (action: MenuDialogAction) => void;
  /** route = ไปหน้า /casino ฯลฯ · none = สลับ state บนหน้าเดียว (หน้าแรก) */
  navigationMode?: "route" | "none";
}

const SIDEBAR_MENU_ICON_CLASS =
  "h-7 w-7 shrink-0 object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]";

function renderMenuTile(
  tile: MenuDialogTile,
  label: string,
  onMenuAction?: (action: MenuDialogAction) => void,
) {
  const inner = (
    <>
      <span className="lobby-desktop-sidebar__link-icon-wrap flex shrink-0 items-center justify-center" aria-hidden="true">
        <MenuItemIcon iconId={tile.iconId} variant="asset" className={SIDEBAR_MENU_ICON_CLASS} />
      </span>
      <span className="lobby-desktop-sidebar__link-label min-w-0 flex-1 truncate">{label}</span>
    </>
  );

  const linkLayout = "relative flex w-full items-center border-0 text-left";

  if (tile.action) {
    return (
      <button
        type="button"
        className={`lobby-desktop-sidebar__link cosmic-type-sidebar-link ${linkLayout}`}
        title={label}
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
        <HubNavLink href={tile.href} className={linkClass} title={label}>
          {inner}
        </HubNavLink>
      );
    }
    return (
      <Link href={tile.href} className={linkClass} title={label}>
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
  const t = useT("nav");
  const tHome = useT("home");

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
      aria-label={t("desktop.sidebar")}
    >
      <div className="lobby-desktop-sidebar glass-sidebar lobby-desktop-sidebar--borderless relative flex w-full min-w-0 max-w-full flex-none flex-col h-auto min-h-0 overflow-hidden p-2 rounded-(--radius-panel)">
      <div className="lobby-desktop-sidebar__body flex flex-col min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain">
      <nav
        className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--primary"
        aria-label={t("desktop.gameCategories")}
      >
        <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">{t("desktop.games")}</p>
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
                  title={tHome(category.labelKey)}
                >
                  <span className="lobby-desktop-sidebar__link-icon-wrap flex shrink-0 items-center justify-center" aria-hidden="true">
                    <Menu3DIcon iconId={category.id} className={SIDEBAR_MENU_ICON_CLASS} />
                  </span>
                  <span className="lobby-desktop-sidebar__link-label min-w-0 flex-1 truncate">{tHome(category.labelKey)}</span>
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
          aria-label={t(section.sectionLabelKey)}
        >
          <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">
            {t(section.sectionLabelKey)}
          </p>
          <ul className="lobby-desktop-sidebar__list flex flex-col m-0 p-0">
            {section.items.map((tile) => (
              <li key={tile.id}>{renderMenuTile(tile, t(tile.labelKey), onMenuAction)}</li>
            ))}
          </ul>
        </nav>
      ))}

      <nav className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--services shrink-0" aria-label={t("desktop.system")}>
        <p className="lobby-desktop-sidebar__section-label cosmic-type-sidebar-section">{t("desktop.system")}</p>
        <ul className="lobby-desktop-sidebar__list flex flex-col m-0 p-0">
          <li>
            <Link
              href="/support"
              className="lobby-desktop-sidebar__link cosmic-type-sidebar-link relative flex w-full items-center border-0 text-left"
              title={t("desktop.contactUs")}
            >
              <span className="lobby-desktop-sidebar__link-icon-wrap flex shrink-0 items-center justify-center" aria-hidden="true">
                <ContactNavIcon className="h-5 w-5 shrink-0" />
              </span>
              <span className="lobby-desktop-sidebar__link-label min-w-0 flex-1 truncate">{t("desktop.contactUs")}</span>
            </Link>
          </li>
        </ul>
      </nav>

      </div>
      </div>
    </aside>
  );
}
