import React from "react";
import { SectionIconId } from "../../types/lobby";
import {
  GoldSparkleIcon,
  FlameIcon,
  SlotsIcon,
  CardsIcon,
  FishIcon,
  FootballIcon,
  NetworkIcon,
} from "./Icons";

interface SectionIconProps {
  id: SectionIconId;
  className?: string;
}

/**
 * แมป SectionIconId → SVG ไอคอนประจำหัวข้อ (ขนาด 20–24px ตาม design.md หมวด 6)
 * ดาวคู่ "ยอดนิยม" ใช้ gold accent ได้ตามแบบ ที่เหลือใช้ currentColor = --icon-default
 * ถูกเรียกใช้โดย GameSection.tsx, ProvidersSection.tsx และ PopularHighlights.tsx
 */
export function SectionIcon({ id, className = "w-6 h-6" }: SectionIconProps) {
  switch (id) {
    case "sparkle":
      return <GoldSparkleIcon className={className} />;
    case "flame":
      return <FlameIcon className={className} />;
    case "cherries":
      return <SlotsIcon className={className} />;
    case "cards":
      return <CardsIcon className={className} />;
    case "fish":
      return <FishIcon className={className} />;
    case "football":
      return <FootballIcon className={className} />;
    case "network":
      return <NetworkIcon className={className} />;
    default:
      return null;
  }
}
