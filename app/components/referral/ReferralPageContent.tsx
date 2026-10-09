"use client";

import React, { useState } from "react";
import type { ReferralOverviewData } from "@/lib/api/referral";
import { useReferralOverview } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { LoginPrompt } from "../ui/LoginPrompt";
import { ChevronRightIcon, UsersGroupIcon, WalletCryptoIcon } from "../ui/Icons";
import { ReferralUsersPanel } from "./ReferralUsersPanel";
import { ReferralEarningPanel } from "./ReferralEarningPanel";
import { ReferralDesktopHubLayout } from "./ReferralDesktopHubLayout";
import { ReferralLinkSection, ReferralStatsSection } from "./ReferralOverviewSections";
import { valueClass } from "@/lib/semanticValue";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { COSMIC_PANEL_GLASS_ICON } from "../ui/cosmicButtonClasses";
import type { ReferralMessageKey, ReferralStatsMock } from "@/app/types/referral";
import { useT } from "@/lib/i18n/I18nProvider";
type ReferralTabId = "overview" | "users" | "earning";

const TABS: { id: ReferralTabId; labelKey: ReferralMessageKey }[] = [
  { id: "overview", labelKey: "tabs.overview" },
  { id: "users", labelKey: "tabs.users" },
  { id: "earning", labelKey: "tabs.earning" },
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
  refCode,
  embedded = false,
}: {
  refCode?: string;
  embedded?: boolean;
}) {
  const overview = useReferralOverview();
  const t = useT("referral");
  return (
    <ResourceGate
      resource={overview}
      loadingLabel={t("status.overviewLoading")}
      errorTitle={t("status.overviewError")}
      idleFallback={
        <LoginPrompt
          title={t("loginPrompt.title")}
          description={t("loginPrompt.description")}
        />
      }
    >
      {(referralOverview) => (
        <ReferralPageContentInner
          refCode={refCode ?? referralOverview.refCode}
          embedded={embedded}
          referralOverview={referralOverview}
        />
      )}
    </ResourceGate>
  );
}

function ReferralPageContentInner({
  refCode,
  embedded,
  referralOverview,
}: {
  refCode: string;
  embedded: boolean;
  referralOverview: ReferralOverviewData;
}) {
  const [tab, setTab] = useState<ReferralTabId>("overview");
  const stats = referralOverview.stats;

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
      stats={stats}
      overview={referralOverview}
    />
  );
}

function ReferralMobileTabs({
  refCode,
  tab,
  setTab,
  stats,
  overview,
}: {
  refCode: string;
  tab: ReferralTabId;
  setTab: (tab: ReferralTabId) => void;
  stats: ReferralStatsMock;
  overview: ReferralOverviewData;
}) {
  const t = useT("referral");
  return (
    <div className="referral-mobile flex flex-col gap-5 pb-4">
      <CosmicLineTabs
        tabs={TABS.map((item) => ({
          id: item.id,
          label: (
            <>
              <TabIcon tab={item.id} />
              {t(item.labelKey)}
            </>
          ),
        }))}
        activeId={tab}
        onSelect={setTab}
        ariaLabel={t("tabs.ariaLabel")}
        columns={3}
        withIcons
      />

      <TabPanelTransition tabKey={tab} order={TABS.map((item) => item.id)}>
      {tab === "overview" && (
        <div className="flex flex-col gap-5">
          <ReferralLinkSection refCode={refCode} />
          <ReferralStatsSection stats={stats} />

          <section className="surface-solid-stack px-4 py-4">
            <h2 className="text-sm font-medium text-[var(--text-primary)]">{t("tiers.title")}</h2>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {t("tiers.description")}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {overview.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="surface-solid-inner flex items-center gap-3 p-3 sm:gap-4"
                >
                  <div className={COSMIC_PANEL_GLASS_ICON}>
                    <UsersGroupIcon className="h-5 w-5 text-[var(--icon-default)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--text-primary)] sm:text-[13px]">
                      {t(tier.titleKey)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-secondary)] sm:text-xs">
                      {t(tier.subtitleKey)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={valueClass("reward", "text-xl leading-none sm:text-2xl")}>
                      {tier.rateLabel}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--text-secondary)] sm:text-xs">
                      {t(tier.rateHintKey)}
                    </p>
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
                  {t(line)}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-[var(--text-primary)]">
              {t("steps.title")}
            </h2>
            <ol className="flex list-none items-start gap-0 p-0">
              {overview.steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <li className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className="glass-control flex h-12 w-12 items-center justify-center rounded-full text-xs font-medium text-[var(--text-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-2 text-xs font-medium text-[var(--text-primary)] sm:text-[13px]">
                      {t(step.labelKey)}
                    </p>
                  </li>
                  {index < overview.steps.length - 1 ? (
                    <li
                      className="flex h-12 w-5 shrink-0 items-center justify-center text-[var(--border-active)] sm:w-6"
                      aria-hidden="true"
                    >
                      <ChevronRightIcon className="h-4 w-4 opacity-80" />
                    </li>
                  ) : null}
                </React.Fragment>
              ))}
            </ol>
          </section>
        </div>
      )}

      {tab === "users" && <ReferralUsersPanel />}

      {tab === "earning" && <ReferralEarningPanel />}
      </TabPanelTransition>
    </div>
  );
}
