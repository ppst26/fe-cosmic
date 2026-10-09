"use client";

import React, { useEffect, useState } from "react";
import Link from "@/lib/i18n/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { formatBaht } from "@/app/components/lottery/lotteryUtils";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { fetchLotterySlips } from "@/lib/lottery/fetchLotterySlip";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { EmptyState, LoadingState } from "@/app/components/ui/StatusState";

/**
 * รายการโพยที่ส่งแล้ว (mock) — /lottery/slips
 */
export default function LotterySlipsListPage() {
  const { t, dateTime } = useLotteryI18n();
  const [slips, setSlips] = useState<LotterySubmittedSlip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchLotterySlips().then((data) => {
      setSlips(data);
      setLoading(false);
    });
  }, []);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: t("slips.title"), backHref: "/lottery" }}
      mainClassName="lottery-slips-page mx-auto max-w-[var(--content-max)] pb-8 lg:mx-0 lg:max-w-none"
    >
      {loading ? (
        <LoadingState label={t("slips.loading")} />
      ) : slips.length === 0 ? (
        <EmptyState
          className="mt-4"
          variant="card"
          title={t("slips.emptyTitle")}
          description={t("slips.emptyDescription")}
          primaryAction={{ label: t("slips.goPlay"), href: "/lottery" }}
        />
      ) : (
        <ul className="lottery-slips-list flex flex-col gap-[0.65rem] m-0 pt-2">
          {slips.map((slip) => (
            <li key={slip.id}>
              <Link
                href={`/lottery/slips/${slip.id}`}
                className="lottery-slips-list__card glass-card--soft block px-4 py-[0.85rem]"
              >
                <div className="lottery-slips-list__row flex items-center justify-between gap-2">
                  <span className="lottery-slips-list__id">{t("summary.slipId", { id: slip.shortId })}</span>
                  <span className="lottery-slips-list__status">{t("summary.submitted")}</span>
                </div>
                <p className="lottery-slips-list__meta mt-[0.35rem] mb-0">{slip.drawLabel || t("round.current")}</p>
                <p className="lottery-slips-list__meta mt-[0.35rem] mb-0">
                  {t("summary.purchased", { date: dateTime(slip.purchasedAt) })}
                </p>
                <p className="lottery-slips-list__stake mt-2 mb-0">{t("slips.stake", { amount: formatBaht(slip.totalStake) })}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </LobbyDesktopPageShell>
  );
}
