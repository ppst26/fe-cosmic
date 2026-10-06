"use client";

import React from "react";
import Image from "next/image";
import { fetchGemsStore } from "@/lib/api/gemsStore";
import { CosmicStackedActionButton } from "../ui/CosmicStackedActionButton";
import { cn } from "@/lib/utils";
import { formatRewardPoints } from "@/lib/format";

/**
 * กระดาน Lucky Box — layout อ้างอิงเว็นอ้างอิง (ปิดใช้งาน · Coming soon)
 * ใช้ใน LuckyBoxPageContent.tsx
 */
export function LuckyBoxRedeemPanel({
  pointsBalance,
  heroImageSrc,
  drawCost,
  comingSoonLabel,
  className,
}: {
  pointsBalance: number;
  heroImageSrc: string;
  drawCost: number;
  comingSoonLabel: string;
  className?: string;
}) {
  const gemAsset = fetchGemsStore().gemAsset;

  return (
    <section
      className={cn("lucky-box-redeem reward-redeem-board", className)}
      aria-label="Lucky Box"
      aria-disabled="true"
    >
      <div className="reward-redeem-board__soon-badge" role="status">
        {comingSoonLabel}
      </div>

      <div className="reward-redeem-board__inner pointer-events-none select-none">
        <header className="reward-redeem-board__header w-full">
          <h2 className="reward-redeem-board__title">Lucky Box</h2>
          <p className="reward-redeem-board__subtitle">
            <Image
              src={gemAsset}
              alt=""
              width={14}
              height={14}
              className="inline-block h-3.5 w-3.5 object-contain align-[-2px]"
            />
            <span className="ml-1">สุ่มของรางวัล</span>
          </p>
        </header>

        <div className="reward-redeem-board__balance">
          <p className="reward-redeem-board__balance-label">พอยท์สะสม</p>
          <p className="reward-redeem-board__balance-value">
            <Image src={gemAsset} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="tabular-nums">{formatRewardPoints(pointsBalance)}</span>
          </p>
        </div>

        <div className="lucky-box-redeem__hero">
          <Image
            src={heroImageSrc}
            alt=""
            width={280}
            height={280}
            className="lucky-box-redeem__hero-img"
            priority
          />
        </div>

        <p className="reward-redeem-board__cost">สุ่มรางวัลครั้งละ {drawCost} พอยท์</p>

        <div className="reward-redeem-board__action">
          <CosmicStackedActionButton
            type="button"
            disabled
            dimmed
            className="w-full opacity-60"
            title="เริ่มการสุ่ม"
          />
          <span className="reward-redeem-board__soon-hint">{comingSoonLabel}</span>
        </div>

        <p className="reward-redeem-board__history">
          {comingSoonLabel} · ประวัติการแลกของรางวัล
        </p>
      </div>

      <div className="reward-redeem-board__veil" aria-hidden="true" />
    </section>
  );
}
