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

const DEFAULT_CLASS = "h-[18px] w-[18px] shrink-0 text-current";
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
    case "coupon":
      return <PromoTicketIcon className={className} />;
    case "cashback":
      return <RefundIcon className={className} />;
    case "check-in":
    case "activities":
      return <MissionsIcon className={className} />;
    case "wheel":
      return <PrizeWheelIcon className={className} />;
    case "gems":
      return <DiamondGemIcon className={className} />;
    case "referral":
      return <InviteFriendsIcon className={className} />;
    default:
      return <PromoTicketIcon className={className} />;
  }
}
