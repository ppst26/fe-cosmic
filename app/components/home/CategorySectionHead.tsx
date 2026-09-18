import React from "react";

interface CategorySectionHeadProps {
  /** breadcrumb / ชื่อหมวด — ชิดซ้าย */
  start: React.ReactNode;
  /** จำนวนเกมหรือค่าย — ชิดขวา */
  meta: React.ReactNode;
  className?: string;
}

/**
 * หัวแถวหมวด — breadcrumb ซ้าย · จำนวนขวา (LobbyCategoryProviders)
 */
export function CategorySectionHead({ start, meta, className = "" }: CategorySectionHeadProps) {
  return (
    <div
      className={`category-section-head flex min-w-0 items-baseline justify-between gap-3 pt-0.5 ${className}`.trim()}
    >
      <div className="category-section-head__start min-w-0">{start}</div>
      <p className="category-section-head__meta shrink-0">{meta}</p>
    </div>
  );
}
