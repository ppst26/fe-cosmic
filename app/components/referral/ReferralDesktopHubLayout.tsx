"use client";

import React, { useMemo, useState } from "react";
import {
  REFERRAL_EARNING_HISTORY_MOCK,
  REFERRAL_EARNING_SUMMARY_MOCK,
  REFERRAL_STATS_MOCK,
  formatReferralCurrency,
  type ReferralEarningPeriodId,
  REFERRAL_EARNING_PERIOD_OPTIONS,
  filterReferralEarningHistoryByPeriod,
} from "@/app/data/referralMockData";
import { COSMIC_BTN_GLASS_PILL, COSMIC_SEGMENT_GLASS_WHITE } from "../ui/cosmicButtonClasses";
import { ReferralEarningPanel } from "./ReferralEarningPanel";
import {
  ReferralLinkSection,
  ReferralPromoBanner,
  ReferralStatsSection,
} from "./ReferralOverviewSections";

interface ReferralDesktopHubLayoutProps {
  refCode: string;
}

/**
 * โครง dialog แนะนำเพื่อน desktop — ซ้าย: แบนเนอร์/ลิงก์/สรุป · ขวา: ฟิลเตอร์/ตาราง/ยอดรับสะสม
 * ใช้ใน ReferralPageContent (embedded + lg+)
 */
export function ReferralDesktopHubLayout({ refCode }: ReferralDesktopHubLayoutProps) {
  const [copied, setCopied] = useState(false);
  const [period, setPeriod] = useState<ReferralEarningPeriodId>("all");
  const [claimable, setClaimable] = useState(REFERRAL_EARNING_SUMMARY_MOCK.bonusClaimableThb);
  const [received, setReceived] = useState(REFERRAL_EARNING_SUMMARY_MOCK.bonusReceivedThb);

  const stats = REFERRAL_STATS_MOCK;

  const filteredHistory = useMemo(
    () => filterReferralEarningHistoryByPeriod(REFERRAL_EARNING_HISTORY_MOCK, period),
    [period],
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

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  return (
    <div className="referral-desktop-hub referral-desktop-hub--flat grid min-h-0 gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
      <div className="flex min-w-0 flex-col gap-4">
        <ReferralPromoBanner compact flat />
        <ReferralLinkSection
          refCode={refCode}
          copied={copied}
          onCopy={(link) => void handleCopy(link)}
          variant="hub"
        />
        <ReferralStatsSection stats={stats} layout="stack" flat variant="hub" />

        <section
          className="referral-hub-block flex flex-col gap-3 py-4"
          aria-label="รายได้ที่รับได้"
        >
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">รายได้ที่รับได้</p>
            <p className="mt-1.5 text-3xl font-medium tabular-nums text-[var(--accent-highlight)]">
              {formatReferralCurrency(claimable)}
            </p>
          </div>
          <button
            type="button"
            disabled={claimable <= 0}
            onClick={handleClaim}
            className={`${COSMIC_BTN_GLASS_PILL} referral-desktop-hub__claim-btn !min-h-12 w-full !text-base font-medium ${
              claimable > 0 ? "is-active" : ""
            }`}
          >
            รับโบนัส
          </button>
          <p className="text-sm text-[var(--text-secondary)]">
            รับสะสมแล้ว {formatReferralCurrency(received)}
          </p>
        </section>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div
          role="tablist"
          aria-label="ช่วงเวลารายได้"
          className={`${COSMIC_SEGMENT_GLASS_WHITE} referral-desktop-hub__period-tabs grid grid-cols-2 gap-2 lg:grid-cols-4`}
        >
          {REFERRAL_EARNING_PERIOD_OPTIONS.map((option) => {
            const active = period === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPeriod(option.id)}
                className={`cosmic-segment-btn min-h-11 px-2 py-2.5 text-sm font-medium leading-snug ${active ? "is-active" : ""}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

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
