"use client";

import React, { useMemo, useState } from "react";
import type { CashbackPanelsData } from "@/lib/api/cashback";
import { useCashbackPanels } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { CashbackLossRebateExtraSections } from "./CashbackLossRebateExtraSections";
import {
  CashbackClaimRow,
  CashbackHighlightCard,
  CashbackInsightPeriodTabs,
  CashbackPanelHeader,
  CashbackPanelShell,
  CashbackRulesTableSection,
  type CashbackInsightPeriodId,
} from "./CashbackPageLayout";
import { formatCashbackCurrency, formatCashbackPercent } from "@/lib/format";
import type { CashbackPanelMock, CashbackTabId } from "@/app/types/cashback";
import { useWallet } from "@/app/hooks/api/account";
import { useT } from "@/lib/i18n/I18nProvider";

interface CashbackPageContentProps {
  initialTab?: CashbackTabId;
  /** แสดงใน DesktopHubModal — ซ่อนหัวข้อซ้ำกับ chrome modal */
  embedded?: boolean;
}

/**
 * เนื้อหาหน้าคืนยอด — แท็บเล่น / เสีย ตาม mock UI
 * ใช้ใน app/cashback/page.tsx และ DesktopHubModal
 */
export function CashbackPageContent({
  initialTab = "play",
  embedded = false,
}: CashbackPageContentProps) {
  const cashbackPanels = useCashbackPanels();
  const t = useT("cashback");
  return (
    <ResourceGate resource={cashbackPanels} loadingLabel={t("status.panelsLoading")} errorTitle={t("status.panelsError")}>
      {(data) => (
        <CashbackPanelsView cashbackPanels={data} initialTab={initialTab} embedded={embedded} />
      )}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดเสร็จ — panel เริ่มต้นมาจาก API แล้วอัปเดตในเครื่องหลังกดรับ */
function CashbackPanelsView({
  cashbackPanels,
  initialTab,
  embedded,
}: {
  cashbackPanels: CashbackPanelsData;
  initialTab: CashbackTabId;
  embedded: boolean;
}) {
  const wallet = useWallet();
  const t = useT("cashback");
  const [tab, setTab] = useState<CashbackTabId>(initialTab);
  const [insightPeriod, setInsightPeriod] = useState<CashbackInsightPeriodId>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [playPanel, setPlayPanel] = useState(cashbackPanels.play);
  const [lossPanel, setLossPanel] = useState(cashbackPanels.loss);

  const panel = tab === "play" ? playPanel : lossPanel;

  const ruleRows = useMemo(
    () => [
      { id: "rate", label: t("rules.rate"), value: formatCashbackPercent(panel.ratePercent) },
      { id: "min", label: t("rules.min"), value: formatCashbackCurrency(panel.minThb) },
      { id: "max", label: t("rules.maxPerClaim"), value: formatCashbackCurrency(panel.maxPerClaimThb) },
      { id: "cycle", label: t("rules.cycle"), value: t(panel.cycleLabelKey) },
    ],
    [panel, t],
  );

  const handleClaim = () => {
    if (!panel.canClaim || panel.claimableThb <= 0) return;
    const reset = (prev: CashbackPanelMock) => ({
      ...prev,
      claimableThb: 0,
      canClaim: false,
      statusHintKey: "panel.claimed" as const,
      claimButtonLabelKey: "panel.claimed" as const,
    });
    if (tab === "play") setPlayPanel(reset);
    else setLossPanel(reset);
    // TODO(api): POST claim cashback แล้วใช้ panels จาก response · ยอดที่รับเข้ากระเป๋าหลัก
    wallet.refresh();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    wallet.refresh();
    window.setTimeout(() => setRefreshing(false), 400);
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <CosmicLineTabs
        tabs={cashbackPanels.tabs.map((item) => ({ id: item.id, label: t(item.labelKey) }))}
        activeId={tab}
        onSelect={setTab}
        ariaLabel={t("tabs.ariaLabel")}
        columns={2}
      />

      <TabPanelTransition
        tabKey={tab}
        order={cashbackPanels.tabs.map((t) => t.id)}
        className="flex flex-col gap-5"
      >
        <CashbackPanelShell embedded={embedded}>
          <CashbackPanelHeader title={t(panel.titleKey)} subtitle={t(panel.subtitleKey)} />

          <CashbackClaimRow
            amountLabel={t("panel.claimableAmount")}
            amount={formatCashbackCurrency(panel.claimableThb)}
            statusHint={t(panel.statusHintKey)}
            claimLabel={t(panel.claimButtonLabelKey)}
            canClaim={panel.canClaim && panel.claimableThb > 0}
            onClaim={handleClaim}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          <CashbackInsightPeriodTabs activeId={insightPeriod} onSelect={setInsightPeriod} />

          <CashbackHighlightCard
            primaryLabel={t("panel.accumulatedThisCycle")}
            primaryValue={formatCashbackCurrency(panel.claimableThb)}
            secondaryValue={formatCashbackPercent(panel.ratePercent)}
            secondaryHint={t("rules.rate")}
          />

          <CashbackRulesTableSection title={t("rules.title")} rows={ruleRows} />
        </CashbackPanelShell>

        {tab === "loss" ? <CashbackLossRebateExtraSections /> : null}
      </TabPanelTransition>
    </div>
  );
}
