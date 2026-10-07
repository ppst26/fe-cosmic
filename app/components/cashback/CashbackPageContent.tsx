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
  return (
    <ResourceGate resource={cashbackPanels} loadingLabel="กำลังโหลดคืนยอด…" errorTitle="โหลดข้อมูลคืนยอดไม่สำเร็จ">
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
  const [tab, setTab] = useState<CashbackTabId>(initialTab);
  const [insightPeriod, setInsightPeriod] = useState<CashbackInsightPeriodId>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [playPanel, setPlayPanel] = useState(cashbackPanels.play);
  const [lossPanel, setLossPanel] = useState(cashbackPanels.loss);

  const panel = tab === "play" ? playPanel : lossPanel;

  const ruleRows = useMemo(
    () => [
      { id: "rate", label: "อัตราคืน", value: formatCashbackPercent(panel.ratePercent) },
      { id: "min", label: "ขั้นต่ำ", value: formatCashbackCurrency(panel.minThb) },
      { id: "max", label: "สูงสุดต่อครั้ง", value: formatCashbackCurrency(panel.maxPerClaimThb) },
      { id: "cycle", label: "รอบคำนวณ", value: panel.cycleLabel },
    ],
    [panel],
  );

  const handleClaim = () => {
    if (!panel.canClaim || panel.claimableThb <= 0) return;
    const reset = (prev: CashbackPanelMock) => ({
      ...prev,
      claimableThb: 0,
      canClaim: false,
      statusHint: "รับแล้ว",
      claimButtonLabel: "รับแล้ว",
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
        tabs={cashbackPanels.tabs}
        activeId={tab}
        onSelect={setTab}
        ariaLabel="ประเภทคืนยอด"
        columns={2}
      />

      <TabPanelTransition
        tabKey={tab}
        order={cashbackPanels.tabs.map((t) => t.id)}
        className="flex flex-col gap-5"
      >
        <CashbackPanelShell embedded={embedded}>
          <CashbackPanelHeader title={panel.title} subtitle={panel.subtitle} />

          <CashbackClaimRow
            amountLabel="ยอดคืนที่รับได้"
            amount={formatCashbackCurrency(panel.claimableThb)}
            statusHint={panel.statusHint}
            claimLabel={panel.claimButtonLabel}
            canClaim={panel.canClaim && panel.claimableThb > 0}
            onClaim={handleClaim}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          <CashbackInsightPeriodTabs activeId={insightPeriod} onSelect={setInsightPeriod} />

          <CashbackHighlightCard
            primaryLabel="ยอดคืนสะสม (รอบนี้)"
            primaryValue={formatCashbackCurrency(panel.claimableThb)}
            secondaryValue={formatCashbackPercent(panel.ratePercent)}
            secondaryHint="อัตราคืน"
          />

          <CashbackRulesTableSection title="รายละเอียดเงื่อนไข" rows={ruleRows} />
        </CashbackPanelShell>

        {tab === "loss" ? <CashbackLossRebateExtraSections /> : null}
      </TabPanelTransition>
    </div>
  );
}
