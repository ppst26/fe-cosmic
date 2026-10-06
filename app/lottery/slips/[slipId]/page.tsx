"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotterySlipSummary } from "@/app/components/lottery/LotterySlipSummary";
import { fetchLotterySlip } from "@/lib/lottery/fetchLotterySlip";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { EmptyState, LoadingState } from "@/app/components/ui/StatusState";

/** รับเฉพาะ path ภายในเว็บ — กัน open redirect เช่น ?continue=https://evil.com หรือ //evil.com */
function toSafeInternalHref(href: string | null): string | null {
  if (!href || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/\\")) {
    return null;
  }
  return href;
}

/**
 * หน้าสรุปโพยหลังส่งแทง — /lottery/slips/[slipId]
 */
export default function LotterySlipSummaryPage() {
  const urlParams = useParams();
  const searchParams = useSearchParams();
  const slipId = (urlParams?.slipId as string) || "";
  const continuePlayHref = toSafeInternalHref(searchParams.get("continue"));

  /** ผลโหลดผูกกับ slipId — loading คำนวณตอน render ไม่ต้อง set ใน effect */
  const [fetched, setFetched] = useState<{
    id: string;
    slip: LotterySubmittedSlip | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchLotterySlip(slipId)
      .catch(() => null)
      .then((data) => {
        if (!cancelled) setFetched({ id: slipId, slip: data });
      });
    return () => {
      cancelled = true;
    };
  }, [slipId]);

  const loading = fetched?.id !== slipId;
  const slip = loading ? null : fetched.slip;

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "สรุปโพย", backHref: "/lottery/slips" }}
      mainClassName="lottery-slips-page mx-auto max-w-[var(--content-max)] pb-8 lg:mx-0 lg:max-w-none"
    >
      {loading ? (
        <LoadingState label="กำลังโหลดโพย…" />
      ) : slip ? (
        <LotterySlipSummary slip={slip} continuePlayHref={continuePlayHref ?? undefined} />
      ) : (
        <EmptyState
          className="mt-4"
          variant="card"
          title="ไม่พบโพยนี้"
          description="โพยอาจถูกลบหรือลิงก์ไม่ถูกต้อง"
          primaryAction={{ label: "ดูโพยทั้งหมด", href: "/lottery/slips" }}
        />
      )}
    </LobbyDesktopPageShell>
  );
}
