"use client";

import React, { useMemo, useState } from "react";
import type { ReferralEarningsData, ReferralOverviewData } from "@/lib/api/referral";
import { useReferralEarnings, useReferralOverview } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { ReferralEarningPanel } from "./ReferralEarningPanel";
import {
  ReferralLinkSection,
  ReferralPromoBanner,
  ReferralStatsSection,
} from "./ReferralOverviewSections";
import { formatReferralCurrency } from "@/lib/format";
import { valueClass } from "@/lib/semanticValue";
import { filterReferralEarningHistoryByPeriod } from "@/lib/domain/referral";
import type { ReferralEarningPeriodId } from "@/app/types/referral";

interface ReferralDesktopHubLayoutProps {
  refCode: string;
}

/**
 * โครง dialog แนะนำเพื่อน desktop — ซ้าย: แบนเนอร์/ลิงก์/สรุป · ขวา: ฟิลเตอร์/ตาราง/ยอดรับสะสม
 * ใช้ใน ReferralPageContent (embedded + lg+)
 */
export function ReferralDesktopHubLayout({ refCode }: ReferralDesktopHubLayoutProps) {
  const earnings = useReferralEarnings();
  const overview = useReferralOverview();
  return (
    <ResourceGate resource={earnings} loadingLabel="กำลังโหลดรายได้…" errorTitle="โหลดรายได้ไม่สำเร็จ">
      {(referralEarnings) => (
        <ResourceGate resource={overview} loadingLabel="กำลังโหลดข้อมูลแนะนำเพื่อน…" errorTitle="โหลดข้อมูลแนะนำเพื่อนไม่สำเร็จ">
          {(referralOverview) => (
            <ReferralDesktopHubContent
              refCode={refCode}
              referralEarnings={referralEarnings}
              referralOverview={referralOverview}
            />
          )}
        </ResourceGate>
      )}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดครบ — ยอดรับได้ / รับแล้ว seed จาก summary (useState) */
function ReferralDesktopHubContent({
  refCode,
  referralEarnings,
  referralOverview,
}: ReferralDesktopHubLayoutProps & {
  referralEarnings: ReferralEarningsData;
  referralOverview: ReferralOverviewData;
}) {
  const [period, setPeriod] = useState<ReferralEarningPeriodId>("all");
  const [claimable, setClaimable] = useState(referralEarnings.summary.bonusClaimableThb);
  const [received, setReceived] = useState(referralEarnings.summary.bonusReceivedThb);

  const stats = referralOverview.stats;

  const filteredHistory = useMemo(
    () => filterReferralEarningHistoryByPeriod(referralEarnings.history, period),
    [period, referralEarnings.history],
  );

  const periodEarningsTotal = useMemo(
    () => filteredHistory.reduce((sum, row) => sum + row.amountThb, 0),
    [filteredHistory],
  );

  const handleClaim = () => {
    if (claimable <= 0) return;
    setReceived((prev) => prev + claimable);
    setClaimable(0);
  };

  return (
    <div className="referral-desktop-hub referral-desktop-hub--flat grid min-h-0 gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
      <div className="flex min-w-0 flex-col gap-4">
        <ReferralPromoBanner compact flat />
        <ReferralLinkSection refCode={refCode} variant="hub" />
        <ReferralStatsSection stats={stats} layout="stack" flat variant="hub" />

        <section
          className="referral-hub-block flex flex-col gap-3 py-4"
          aria-label="รายได้ที่รับได้"
        >
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">รายได้ที่รับได้</p>
            <p className={valueClass("reward", "mt-1.5 text-3xl")}>
              {formatReferralCurrency(claimable)}
            </p>
          </div>
          <button
            type="button"
            disabled={claimable <= 0}
            onClick={handleClaim}
            className={COSMIC_BTN_PRIMARY}
          >
            รับโบนัส
          </button>
          <p className="text-sm text-[var(--text-secondary)]">
            รับสะสมแล้ว {formatReferralCurrency(received)}
          </p>
        </section>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <CosmicLineTabs
          className="referral-desktop-hub__period-tabs"
          tabs={referralEarnings.periods.map((option) => ({
            id: option.id,
            label: option.label,
          }))}
          activeId={period}
          onSelect={setPeriod}
          ariaLabel="ช่วงเวลารายได้"
          columns={4}
        />

        <section className="referral-hub-block py-4" aria-label="สรุปรายได้ช่วงที่เลือก">
          <p className="text-sm text-[var(--text-secondary)]">รายได้จากเครือข่าย (ช่วงที่เลือก)</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="text-3xl font-medium tabular-nums text-[var(--text-primary)]">
              {formatReferralCurrency(periodEarningsTotal)}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              สะสมทั้งหมด {formatReferralCurrency(stats.totalEarningsThb)}
            </p>
          </div>
        </section>

        <ReferralEarningPanel
          showSummary={false}
          flat
          history={filteredHistory}
          received={received}
          claimable={claimable}
          onClaim={handleClaim}
          sectionTitle="รายละเอียดการทำรายได้"
        />
      </div>
    </div>
  );
}
