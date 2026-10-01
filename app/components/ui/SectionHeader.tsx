import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  titleId?: string;
  className?: string;
  actionContent?: React.ReactNode;
}

/**
 * Reusable Section Header ประจำหมวดหมู่ต่าง ๆ
 * ถูกเรียกใช้โดย PopularHighlights.tsx และหมวดเกมอื่น ๆ ในอนาคต
 */
export function SectionHeader({
  icon,
  title,
  titleId,
  className = "",
  actionContent,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="inline-flex items-center shrink-0">{icon}</span>}
        <h2
          id={titleId}
          className="cosmic-type-section-title tracking-tight"
        >
          {title}
        </h2>
      </div>
      {actionContent && <div className="flex items-center gap-2">{actionContent}</div>}
    </div>
  );
}
