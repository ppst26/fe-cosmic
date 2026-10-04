"use client";



import React from "react";

import type { VipPlayerState, VipRankId } from "@/app/types/vip";

import { cn } from "@/lib/utils";

import {

  getVipLevelUpOverallPercent,

  getVipRankDisplayNumber,

  getVipRankLevelUpAmounts,

  getVipRankViewStatus,

  getVipRequirementRankForFocus,

} from "@/app/data/vipMockData";

import { VipRankProgressMetric } from "@/app/components/vip/VipRankProgressMetric";



interface VipRankLevelUpCardProps {

  player: VipPlayerState;

  focusRankId: VipRankId;

  /** current = แท็บระดับของฉัน (ไป nextRank เท่านั้น) · carousel = แท็บแร็งค์ */

  mode?: "current" | "carousel";

  /** desktop-fill = ขยายสูงเต็มคอลัมน์ใน VIP modal */

  layout?: "default" | "desktop-fill";

  /** หน้าการ์ด gradient มุมบนโค้ง — ภายใน .vip-rank-stack เท่านั้น */

  rankSurface?: boolean;

}



/**

 * การ์ดความคืบหน้าเลื่อนแรงค์ — ฝาก + เทิร์น (AND ทั้งสองเงื่อนไข)

 */

export function VipRankLevelUpCard({

  player,

  focusRankId,

  mode = "carousel",

  layout = "default",

  rankSurface = false,

}: VipRankLevelUpCardProps) {

  const status = getVipRankViewStatus(focusRankId, player.currentRankId);



  if (mode === "current") {

    if (!player.nextRankId) return null;

  } else if (status === "active" && !player.nextRankId && focusRankId === player.currentRankId) {

    return null;

  }



  const requirementRankId =

    mode === "current" && player.nextRankId

      ? player.nextRankId

      : getVipRequirementRankForFocus(focusRankId, player);

  const targetVipNumber = getVipRankDisplayNumber(requirementRankId);

  const { depositTarget, turnoverTarget } = getVipRankLevelUpAmounts(requirementRankId);



  const locked = mode === "carousel" && status === "locked";

  const cleared = mode === "carousel" && status === "cleared";



  const depositProgress = locked ? 0 : cleared ? depositTarget : player.depositProgress;

  const turnoverProgress = locked ? 0 : cleared ? turnoverTarget : player.turnoverProgress;



  const overallPct = getVipLevelUpOverallPercent(

    depositProgress,

    turnoverProgress,

    depositTarget,

    turnoverTarget,

  );



  const title =

    cleared

      ? `VIP ${targetVipNumber}`

      : `เลื่อนขึ้นสู่ VIP ${targetVipNumber}`;



  return (

    <section

      className={cn(

        "vip-panel-card vip-panel-card--level-up vip-level-up-card",

        layout === "desktop-fill" && "vip-panel-card--desktop-fill",

        rankSurface && "vip-rank-surface-card",

      )}

    >

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0 text-left">

          <h3 className="text-base font-medium text-[var(--text-primary)] sm:text-lg">{title}</h3>

          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">

            ต้องครบทั้งสองเงื่อนไข

          </p>

        </div>

        <span

          className="vip-level-up-card__percent shrink-0 text-2xl font-medium tabular-nums sm:text-[1.75rem]"

          aria-label={`ความคืบหน้ารวม ${Math.round(overallPct)} เปอร์เซ็นต์`}

        >

          {Math.round(overallPct)}%

        </span>

      </div>



      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">

        <VipRankProgressMetric

          label="ฝาก"

          iconKind="deposit"

          progress={depositProgress}

          target={depositTarget}

          locked={locked}

          amountFormat="compact"

        />

        <VipRankProgressMetric

          label="เทิร์น"

          iconKind="turnover"

          progress={turnoverProgress}

          target={turnoverTarget}

          locked={locked}

          amountFormat="compact"

        />

      </div>

    </section>

  );

}


