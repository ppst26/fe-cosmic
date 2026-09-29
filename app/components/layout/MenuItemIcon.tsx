import React from "react";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { Menu3DIcon } from "@/app/components/ui/Menu3DIcon";
import {
  HistoryIcon,
  InviteFriendsIcon,
  ProfileNavIcon,
} from "../ui/Icons";

const DEFAULT_CLASS = "h-[22px] w-[22px] shrink-0 text-white";

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
  const assetSrc = variant === "asset" ? getMenuIconSrc(iconId) : undefined;

  if (assetSrc) {
    return <Menu3DIcon iconId={iconId} className={className} />;
  }

  const iconClass = `${className} text-white`;

  switch (iconId) {
    case "profile":
      return <ProfileNavIcon className={iconClass} />;
    case "transactions":
      return <HistoryIcon className={iconClass} />;
    case "referral":
      return <InviteFriendsIcon className={iconClass} />;
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
