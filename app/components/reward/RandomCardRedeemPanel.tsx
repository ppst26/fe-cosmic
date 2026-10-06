"use client";

import React from "react";
import Image from "next/image";
import { GEMS_STORE_GEM_ASSET } from "@/app/data/gemsStoreMockData";
import { CosmicStackedActionButton } from "../ui/CosmicStackedActionButton";
import { cn } from "@/lib/utils";
import { formatRewardPoints } from "@/lib/format";
import type { RandomCardDisplayItem } from "@/app/types/reward";

/**
 * กระดานแลกการ์ดสุ่ม — layout อ้างอิง Redeem Card (ปิดใช้งาน · Coming soon)
 * ใช้ใน RandomCardPageContent.tsx
 */
export function RandomCardRedeemPanel({
  pointsBalance,
  cards,
  drawCost,
  comingSoonLabel,
  className,
}: {
  pointsBalance: number;
  cards: RandomCardDisplayItem[];
  drawCost: number;
  comingSoonLabel: string;
  className?: string;
}) {
  /** รูปเพชร — asset คงที่ ไม่ได้มาจาก API */
  const gemAsset = GEMS_STORE_GEM_ASSET;
  const topRow = cards.slice(0, 3);
  const bottomRow = cards.slice(3, 5);

  return (
    <section
      className={cn("random-card-redeem reward-redeem-board", className)}
      aria-label="แลกการ์ดสุ่ม"
      aria-disabled="true"
    >
      <div className="reward-redeem-board__soon-badge" role="status">
        {comingSoonLabel}
      </div>

      <div className="reward-redeem-board__inner pointer-events-none select-none">
        <header className="reward-redeem-board__header w-full">
          <h2 className="reward-redeem-board__title">Redeem Card</h2>
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

        <div className="random-card-redeem__deck">
          <div className="random-card-redeem__row random-card-redeem__row--three">
            {topRow.map((card) => (
              <RandomCardPrizeTile key={card.id} card={card} gemAsset={gemAsset} />
            ))}
          </div>
          <div className="random-card-redeem__row random-card-redeem__row--two">
            {bottomRow.map((card) => (
              <RandomCardPrizeTile key={card.id} card={card} gemAsset={gemAsset} />
            ))}
          </div>
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

function RandomCardPrizeTile({
  card,
  gemAsset,
}: {
  card: RandomCardDisplayItem;
  gemAsset: string;
}) {
  const valueLabel =
    card.pointsValue > 0
      ? new Intl.NumberFormat("th-TH").format(card.pointsValue)
      : "0";

  return (
    <article className={cn("random-card-prize", card.pointsValue === 0 && "random-card-prize--empty")}>
      <div className="random-card-prize__art">
        <Image
          src={card.imageSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 28vw, 120px"
          className={cn(
            "object-contain object-center",
            card.pointsValue === 0 && "opacity-35 grayscale",
          )}
        />
      </div>
      <p className="random-card-prize__value">
        <Image src={gemAsset} alt="" width={12} height={12} className="h-3 w-3 object-contain opacity-90" />
        <span className="tabular-nums">{valueLabel}</span>
      </p>
    </article>
  );
}
