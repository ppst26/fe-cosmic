"use client";



import React from "react";

import type { VipRankId } from "@/app/types/vip";

import {

  getVipMaintainState,

  getVipPreviousRankId,

  getVipRankDisplayNumber,

} from "@/app/data/vipMockData";

import { cn } from "@/lib/utils";

import { VipRankProgressMetric } from "@/app/components/vip/VipRankProgressMetric";
import { vipMaintainDaysClass } from "@/lib/semanticValue";
import { useT } from "@/lib/i18n/I18nProvider";



interface VipMaintainRankPanelProps {

  /** ต้องเป็นแรงค์ปัจจุบันของผู้เล่นเท่านั้น */

  activeRankId: VipRankId;

  rankSurface?: boolean;

}



/**

 * กล่องรักษาระดับ VIP — แสดงใน VipModal แท็บระดับของฉัน (แรงค์ปัจจุบัน)

 */

export function VipMaintainRankPanel({

  activeRankId,

  rankSurface = false,

}: VipMaintainRankPanelProps) {

  const t = useT("vip");

  const maintain = getVipMaintainState(activeRankId);

  if (!maintain) return null;



  const previousRankId = getVipPreviousRankId(activeRankId);

  const downgradeVipNumber =

    previousRankId != null ? getVipRankDisplayNumber(previousRankId) : null;



  const subtitle =

    downgradeVipNumber != null

      ? t("maintain.subtitleWithDowngrade", { level: downgradeVipNumber })

      : t("progress.bothRequired");



  return (

    <section

      className={cn(

        "vip-panel-card vip-maintain-rank-panel vip-maintain-rank-panel--flat vip-maintain-rank-panel--desktop-stretch",

        rankSurface && "vip-rank-surface-card",

      )}

    >

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0 text-left">

          <h3 className="text-base font-medium text-[var(--text-primary)] sm:text-lg">

            {t("maintain.title")}

          </h3>

          <p className="mt-1 text-xs leading-snug text-[var(--text-secondary)] sm:text-sm">

            {subtitle}

          </p>

        </div>

        <div className="shrink-0 text-right">

          <span
            className={vipMaintainDaysClass(
              maintain.daysRemaining,
              "vip-maintain-rank-panel__days block text-2xl leading-none sm:text-[1.75rem]",
            )}
          >

            {maintain.daysRemaining}

          </span>

          <span className="mt-0.5 block text-[0.65rem] leading-tight text-[var(--text-secondary)] sm:text-xs">

            {t("maintain.daysRemaining")}

          </span>

        </div>

      </div>



      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">

        <VipRankProgressMetric

          label={t("progress.deposit")}

          iconKind="deposit"

          progress={maintain.depositProgress}

          target={maintain.depositTarget}

        />

        <VipRankProgressMetric

          label={t("progress.turnover")}

          iconKind="turnover"

          progress={maintain.turnoverProgress}

          target={maintain.turnoverTarget}

        />

      </div>

    </section>

  );

}


