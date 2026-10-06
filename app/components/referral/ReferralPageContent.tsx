"use client";

import React, { useState } from "react";
import {
  type ReferralStatsMock,
} from "@/app/data/referralMockData";
import { fetchReferralOverview } from "@/lib/api/referral";
import { UsersGroupIcon, WalletCryptoIcon } from "../ui/Icons";
import { ReferralUsersPanel } from "./ReferralUsersPanel";
import { ReferralEarningPanel } from "./ReferralEarningPanel";
import { ReferralDesktopHubLayout } from "./ReferralDesktopHubLayout";
import {
  ReferralLinkSection,
  ReferralPromoBanner,
  ReferralStatsSection,
} from "./ReferralOverviewSections";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { COSMIC_PANEL_GLASS_ICON, COSMIC_PANEL_SOLID } from "../ui/cosmicButtonClasses";
type ReferralTabId = "overview" | "users" | "earning";

const TABS: { id: ReferralTabId; label: string }[] = [
  { id: "overview", label: "ภาพรวม" },
  { id: "users", label: "เพื่อนที่แนะนำ" },
  { id: "earning", label: "รายได้" },
];

function TabIcon({ tab }: { tab: ReferralTabId }) {
  const className = "h-4 w-4 shrink-0";
  if (tab === "users") {
    return <UsersGroupIcon className={className} />;
  }
  if (tab === "earning") {
    return <WalletCryptoIcon className={`${className} h-4 w-4`} />;
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 2a8 8 0 0 1 6.32 12.9L12 12V4Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path d="M12 4v8l6.32 4.9A8 8 0 0 1 12 4Z" fill="currentColor" />
    </svg>
  );
}

/**
 * เนื้อหาหน้าแนะนำเพื่อน — ใช้ใน /referral และ DesktopHubModal
 */
export function ReferralPageContent({
  refCode = fetchReferralOverview().refCode,
  embedded = false,
}: {
  refCode?: string;
  embedded?: boolean;
}) {
  const referralOverview = fetchReferralOverview();
  const [tab, setTab] = useState<ReferralTabId>("overview");
  const [copied, setCopied] = useState(false);
  const stats = referralOverview.stats;

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  if (embedded) {
    return (
      <>
        <div className="hidden lg:block">
          <ReferralDesktopHubLayout refCode={refCode} />
        </div>
        <div className="lg:hidden">
          <ReferralMobileTabs
            refCode={refCode}
            tab={tab}
            setTab={setTab}
            copied={copied}
            onCopy={(link) => void handleCopy(link)}
            stats={stats}
            overview={referralOverview}
          />
        </div>
      </>
    );
  }

  return (
    <ReferralMobileTabs
      refCode={refCode}
      tab={tab}
      setTab={setTab}
      copied={copied}
      onCopy={(link) => void handleCopy(link)}
      stats={stats}
      overview={referralOverview}
    />
  );
}

function ReferralMobileTabs({
  refCode,
  tab,
  setTab,
  copied,
  onCopy,
  stats,
  overview,
}: {
  refCode: string;
  tab: ReferralTabId;
  setTab: (tab: ReferralTabId) => void;
  copied: boolean;
  onCopy: (link: string) => void;
  stats: ReferralStatsMock;
  overview: ReturnType<typeof fetchReferralOverview>;
}) {
  return (
    <div className="referral-mobile flex flex-col gap-5 pb-4">
      <CosmicLineTabs
        tabs={TABS.map((item) => ({
          id: item.id,
          label: (
            <>
              <TabIcon tab={item.id} />
              {item.label}
            </>
          ),
        }))}
        activeId={tab}
        onSelect={setTab}
        ariaLabel="เมนูแนะนำเพื่อน"
        columns={3}
        withIcons
      />

      <TabPanelTransition tabKey={tab} order={TABS.map((item) => item.id)}>
      {tab === "overview" && (
        <div className="flex flex-col gap-5">
          <ReferralPromoBanner />
          <ReferralLinkSection refCode={refCode} copied={copied} onCopy={onCopy} />
          <ReferralStatsSection stats={stats} />

          <section className={`${COSMIC_PANEL_SOLID} px-4 py-4`}>
            <h2 className="text-sm font-medium text-[var(--text-primary)]">รับรายได้ 2 ต่อ</h2>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              แชร์ลิงก์แล้วรับส่วนแบ่งจากยอดเทิร์นของเครือข่าย
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {overview.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="cosmic-inset-card flex gap-3 p-3"
                >
                  <div className={COSMIC_PANEL_GLASS_ICON}>
                    <UsersGroupIcon className="h-5 w-5 text-[var(--icon-default)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[var(--text-primary)]">{tier.title}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{tier.subtitle}</p>
                    <p className="mt-1 text-2xl font-medium text-[var(--text-primary)]">{tier.rateLabel}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{tier.rateHint}</p>
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {overview.checks.map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"
                >
                  <span className="text-[var(--success)]" aria-hidden="true">✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-[var(--text-primary)]">
              เริ่มต้นง่าย ๆ ใน 3 ขั้นตอน
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {overview.steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div className="glass-control flex h-12 w-12 items-center justify-center rounded-full text-xs font-medium text-[var(--text-primary)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="mt-2 text-xs sm:text-[13px] font-medium text-[var(--text-primary)]">{step.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "users" && <ReferralUsersPanel />}

      {tab === "earning" && <ReferralEarningPanel />}
      </TabPanelTransition>
    </div>
  );
}
