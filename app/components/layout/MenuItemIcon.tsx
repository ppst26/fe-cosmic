import React from "react";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { Menu3DIcon } from "@/app/components/ui/Menu3DIcon";
import {
  CrownIcon,
  DiamondGemIcon,
  FlameIcon,
  GiftVoucherIcon,
  HistoryIcon,
  InviteFriendsIcon,
  MissionsIcon,
  PrizeWheelIcon,
  ProfileNavIcon,
  PromoTagIcon,
  PromoTicketIcon,
  RefundIcon,
} from "../ui/Icons";

const DEFAULT_CLASS = "h-[22px] w-[22px] shrink-0 text-white";

/**
 * SVG fallback เมื่อไม่มี asset 3D — ครบทุกไทล์ใน menuMockData
 */
function MenuItemIconSvg({ iconId, className }: { iconId: string; className: string }) {
  switch (iconId) {
    case "profile":
      return <ProfileNavIcon className={className} />;
    case "transactions":
      return <HistoryIcon className={className} />;
    case "rank":
      return <CrownIcon className={className} />;
    case "promotions":
      return <PromoTagIcon className={className} />;
    case "cashback":
      return <RefundIcon className={className} />;
    case "check-in":
      return <MissionsIcon className={className} />;
    case "referral":
      return <InviteFriendsIcon className={className} />;
    case "wheel":
      return <PrizeWheelIcon className={className} />;
    case "gems":
      return <DiamondGemIcon className={className} />;
    case "activities":
      return <FlameIcon className={className} />;
    case "coupon":
      return <GiftVoucherIcon className={className} />;
    case "ticket":
      return <PromoTicketIcon className={className} />;
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        </svg>
      );
  }
}

/**
 * ไอคอนไทล์เมนู — ใช้รูป 3D จาก menuicon เป็นค่าเริ่มต้น (สอดคล้อง CategoryNav / drawer)
 */
export function MenuItemIcon({
  iconId,
  className = DEFAULT_CLASS,
  variant = "asset",
}: {
  iconId: string;
  className?: string;
  /** asset = 3D menuicon · svg = fallback เส้น (เมื่อไม่มี asset) */
  variant?: "svg" | "asset";
}) {
  const iconClass = `${className} text-white`;
  const assetSrc = variant === "asset" ? getMenuIconSrc(iconId) : undefined;

  if (assetSrc) {
    return <Menu3DIcon iconId={iconId} className={className} />;
  }

  return <MenuItemIconSvg iconId={iconId} className={iconClass} />;
}
