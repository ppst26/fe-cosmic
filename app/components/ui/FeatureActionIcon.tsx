import React from "react";
import { FeatureActionIconId } from "../../types/lobby";
import { DiamondShopIcon, MissionsIcon, PrizeWheelIcon } from "./Icons";

interface FeatureActionIconProps {
  id: FeatureActionIconId;
  className?: string;
}

/**
 * แมปไอคอนเรียบสำหรับการ์ดฟีเจอร์ — ใช้สี currentColor ตาม design.md
 * ถูกเรียกใช้โดย FeatureActionCard.tsx
 */
export function FeatureActionIcon({ id, className = "h-10 w-10 text-[var(--icon-default)]" }: FeatureActionIconProps) {
  switch (id) {
    case "diamond-shop":
      return <DiamondShopIcon className={className} />;
    case "missions":
      return <MissionsIcon className={className} />;
    case "prize-wheel":
      return <PrizeWheelIcon className={className} />;
    default:
      return null;
  }
}
