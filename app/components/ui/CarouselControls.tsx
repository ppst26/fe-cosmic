import React from "react";
import Link from "@/lib/i18n/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

interface CarouselControlsProps {
  viewAllHref?: string;
  viewAllLabel?: string;
  /** false = แสดงเฉพาะปุ่มเลื่อน (เช่น carousel กิจกรรม) */
  showViewAll?: boolean;
  /** ชื่อ section ใช้ประกอบ accessible name ของปุ่มลูกศร */
  sectionTitle: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * ชุดควบคุมด้านขวาของ SectionHeader: View All (pill) → Previous → Next (ปุ่มวงกลม)
 * ภาพปุ่มลูกศร 36px แต่ hit area ขยายเป็น 44px ด้วย pseudo-element ตาม design.md
 * ถูกเรียกใช้โดย Carousel.tsx เท่านั้น — state ของปุ่มมาจาก hook ใน Carousel
 */
export function CarouselControls({
  viewAllHref = "#",
  viewAllLabel = "View All",
  showViewAll = true,
  sectionTitle,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: CarouselControlsProps) {
  const arrowClass = "glass-control glass-icon-btn";

  return (
    <div className="flex items-center gap-2">
      {showViewAll ? (
        <Link href={viewAllHref} className="glass-control glass-pill">
          {viewAllLabel}
        </Link>
      ) : null}

      {/* Previous */}
      <button
        type="button"
        className={arrowClass}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={`เลื่อน ${sectionTitle} ไปกลุ่มก่อนหน้า`}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {/* Next */}
      <button
        type="button"
        className={arrowClass}
        onClick={onNext}
        disabled={!canNext}
        aria-label={`เลื่อน ${sectionTitle} ไปกลุ่มถัดไป`}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
