"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotterySlipSummary } from "@/app/components/lottery/LotterySlipSummary";
import { fetchLotterySlip } from "@/lib/lottery/fetchLotterySlip";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";

/**
 * หน้าสรุปโพยหลังส่งแทง — /lottery/slips/[slipId]
 */
export default function LotterySlipSummaryPage() {
  const urlParams = useParams();
  const searchParams = useSearchParams();
  const slipId = (urlParams?.slipId as string) || "";
  const continuePlayHref = searchParams.get("continue");

  const [slip, setSlip] = useState<LotterySubmittedSlip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchLotterySlip(slipId).then((data) => {
      if (!cancelled) {
        setSlip(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slipId]);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "สรุปโพย", backHref: "/lottery/slips" }}
      mainClassName="lottery-slips-page mx-auto max-w-[var(--content-max)] pb-8 lg:mx-0 lg:max-w-none"
    >
      {loading ? (
        <p className="py-12 text-center text-sm text-[var(--text-secondary)]">กำลังโหลดโพย…</p>
      ) : slip ? (
        <LotterySlipSummary slip={slip} continuePlayHref={continuePlayHref ?? undefined} />
      ) : (
        <p className="py-12 text-center text-sm text-[var(--text-secondary)]">ไม่พบโพยนี้</p>
      )}
    </LobbyDesktopPageShell>
  );
}
