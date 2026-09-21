"use client";

import React from "react";
import { DailyCheckInCard } from "./DailyCheckInCard";

interface DailyCheckInPageContentProps {
  embedded?: boolean;
  onClose?: () => void;
}

/**
 * เนื้อหาเช็คอินรายวัน (ธีม Cosmicbet Hub)
 * ใช้ใน /missions/check-in และ DesktopHubModal
 */
export function DailyCheckInPageContent({
  embedded = false,
  onClose,
}: DailyCheckInPageContentProps) {
  return (
    <div className="flex w-full justify-center px-1 py-1 sm:px-2 sm:py-3">
      <DailyCheckInCard
        onClose={onClose}
        isStandalone={!embedded}
      />
    </div>
  );
}
