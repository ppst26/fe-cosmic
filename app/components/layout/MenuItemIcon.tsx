import React from "react";
import { getMenuDialogIconSrc } from "@/app/data/menuDialogIconAssets";
import {
  CrownIcon,
  DiamondGemIcon,
  HistoryIcon,
  InviteFriendsIcon,
  MissionsIcon,
  PrizeWheelIcon,
  ProfileNavIcon,
  PromoTicketIcon,
  RefundIcon,
} from "../ui/Icons";

const DEFAULT_CLASS = "h-[22px] w-[22px] shrink-0 text-current";
const MENU_TILE_ICON_CLASS = "menu-item__icon-img";

/**
 * ไอคอนไทล์เมนู — ใช้ร่วม RightMenuDrawer และ LobbyDesktopSidebar
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
        className={className === DEFAULT_CLASS ? MENU_TILE_ICON_CLASS : className}
        loading="lazy"
        decoding="async"
        aria-hidden={true}
      />
    );
  }

  switch (iconId) {
    case "profile":
      return <ProfileNavIcon className={className} />;
    case "transactions":
      return <HistoryIcon className={className} />;
    case "rank":
      return <CrownIcon className={`${className} text-[#ffe66d]`} />;
    case "promotions":
      return <PromoTicketIcon className={className} />;
    case "coupon":
      return <CouponCutIcon className={className} />;
    case "cashback":
      return <RefundIcon className={className} />;
    case "check-in":
      return <CalendarCheckIcon className={className} />;
    case "activities":
      return <MissionsIcon className={className} />;
    case "wheel":
      return <PrizeWheelIcon className={className} />;
    case "gems":
      return <DiamondGemIcon className={`${className} text-[#60a5fa]`} />;
    case "referral":
      return <InviteFriendsIcon className={className} />;
    default:
      return <PromoTicketIcon className={className} />;
  }
}

function CalendarCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function CouponCutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 5H3a2 2 0 0 0-2 2v2a2 2 0 0 1 0 4v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2Z" />
      <path d="M9 9h.01M15 15h.01M9 15l6-6" />
    </svg>
  );
}
