"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CosmicLineTabItem<T extends string> {
  id: T;
  label: React.ReactNode;
}

interface CosmicLineTabsProps<T extends string> {
  tabs: CosmicLineTabItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
  columns?: 2 | 3 | 4;
  scrollable?: boolean;
  withIcons?: boolean;
  className?: string;
}

/**
 * แท็บเส้นใต้ — ใช้ในหน้า standalone และ hub sheet
 */
export function CosmicLineTabs<T extends string>({
  tabs,
  activeId,
  onSelect,
  ariaLabel,
  columns,
  scrollable = false,
  withIcons = false,
  className,
}: CosmicLineTabsProps<T>) {
  const tablistClass = cn(
    "cosmic-line-tablist",
    columns === 2 && "cosmic-line-tablist--cols-2",
    columns === 3 && "cosmic-line-tablist--cols-3",
    columns === 4 && "cosmic-line-tablist--cols-4",
    scrollable && "cosmic-line-tablist--scroll",
    className,
  );

  return (
    <div role="tablist" aria-label={ariaLabel} className={tablistClass}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "cosmic-line-tab",
              withIcons && "cosmic-line-tab--with-icon",
              isActive && "is-active",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
