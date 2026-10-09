"use client";

import React from "react";
import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";
import { GEMS_STORE_GEM_ASSET } from "@/app/data/gemsStoreMockData";
import { COSMIC_PANEL_GLASS } from "@/app/components/ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";
import { formatRewardPoints } from "@/lib/format";
import { valueClass } from "@/lib/semanticValue";

/**
 * แถบยอดพอยท์คงเหลือ — ใช้ซ้ำในหน้าย่อย /reward/*
 */
export function RewardPointsBar({
  pointsBalance,
  className,
}: {
  pointsBalance: number;
  className?: string;
}) {
  const t = useT("rewards");
  return (
    <div
      className={cn(
        "mx-3 flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 sm:mx-4",
        COSMIC_PANEL_GLASS,
        className,
      )}
      aria-label={t("hub.pointsBalance")}
    >
      <p className="text-sm text-[var(--text-secondary)]">{t("hub.pointsBalance")}</p>
      <p className={valueClass("accent", "flex items-center gap-2 text-lg")}>
        <Image src={GEMS_STORE_GEM_ASSET} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
        {formatRewardPoints(pointsBalance)}
      </p>
    </div>
  );
}
