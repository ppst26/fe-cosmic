import React from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

interface CarouselControlsProps {
  viewAllHref: string;
  viewAllLabel?: string;
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
  viewAllHref,
  viewAllLabel = "View All",
  sectionTitle,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: CarouselControlsProps) {
  const arrowClass =
    "relative inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--icon-default)] transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-selected)] hover:text-[var(--icon-active)] disabled:opacity-40 disabled:pointer-events-none after:absolute after:-inset-1 after:content-['']";

  return (
    <div className="flex items-center gap-2">
      {/* View All — pill พื้นม่วงเข้ม ไปหน้ารวมของหมวด */}
      <Link
        href={viewAllHref}
        className="inline-flex h-9 items-center rounded-full bg-[var(--surface-hover)] px-3.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-selected)] hover:text-[var(--text-primary)]"
      >
        {viewAllLabel}
      </Link>

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
