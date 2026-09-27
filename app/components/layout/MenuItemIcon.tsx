import React from "react";
import { getMenuDialogIconSrc } from "@/app/data/menuDialogIconAssets";
import {
  HistoryIcon,
  InviteFriendsIcon,
  ProfileNavIcon,
} from "../ui/Icons";

const DEFAULT_CLASS = "h-[22px] w-[22px] shrink-0 text-white";
const MENU_TILE_ICON_CLASS = "menu-item__icon-img";

/**
 * ไอคอนไทล์เมนู — สีขาวทั้งหมดตามคำสั่งผู้ใช้
 */
export function MenuItemIcon({
  iconId,
  className = DEFAULT_CLASS,
  variant = "svg",
}: {
  iconId: string;
  className?: string;
  /** asset = รูปจาก public/assets/icons (เมนู dialog) */
  variant?: "svg" | "asset";
}) {
  const assetSrc = variant === "asset" ? getMenuDialogIconSrc(iconId) : undefined;

  if (assetSrc) {
    return (
      <img
        src={assetSrc}
        alt=""
        draggable={false}
        className={className === DEFAULT_CLASS ? MENU_TILE_ICON_CLASS : className}
        loading="lazy"
        decoding="async"
        aria-hidden={true}
      />
    );
  }

  const iconClass = `${className} text-white`;

  switch (iconId) {
    case "profile":
      return <ProfileNavIcon className={iconClass} />;
    case "transactions":
      return <HistoryIcon className={iconClass} />;
    case "rank":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M5 18h14M5 18l-2-9 5 3 4-6 4 6 5-3-2 9H5z" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
        </svg>
      );
    case "promotions":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="m9 15 6-6M9.01 9h.01M15.01 15h.01" />
        </svg>
      );
    case "activities":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <rect x="4" y="5" width="16" height="16" rx="3" />
          <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z" />
          <path d="m9 13 2 2 4-4" />
        </svg>
      );
    case "cashback":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      );
    case "check-in":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      );
    case "wheel":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "gems":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M6 3h12l4 7-10 11L2 10l4-7Z" />
          <path d="M2 10h20M10 3l-2 7 4 11 4-11-2-7" />
        </svg>
      );
    case "referral":
      return <InviteFriendsIcon className={iconClass} />;
    case "coupon":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="m9 15 6-6M9.01 9h.01M15.01 15h.01" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        </svg>
      );
  }
}
