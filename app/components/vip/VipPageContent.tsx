"use client";

import React, { useState } from "react";
import type { VipModalTabId, VipPlayerState, VipRankTier } from "@/app/types/vip";
import { usePrefetchVipTabs, useVipPlayer, useVipRanks } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { cn } from "@/lib/utils";
import { VipModalDesktopLayout } from "./VipModalDesktopLayout";
import { VipMobileTabPanels } from "./VipMobileTabPanels";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { VipTabList } from "./VipTabList";
import { VIP_PAGE_TABS } from "./vipTabConfig";
import { useT } from "@/lib/i18n/I18nProvider";

interface VipPageContentProps {
  activeTab: VipModalTabId;
  onSelectTab: (tab: VipModalTabId) => void;
  /** hub modal บน desktop — สลับแท็บใน modal ไม่เปลี่ยน route */
  embedded?: boolean;
}

/**
 * เนื้อหาหน้า VIP standalone — โหลดข้อมูลผู้เล่น + ตารางระดับ แล้วส่งต่อให้ VipPageContentInner
 */
export function VipPageContent(props: VipPageContentProps) {
  const player = useVipPlayer();
  const ranks = useVipRanks();
  usePrefetchVipTabs();
  const t = useT("vip");

  return (
    <ResourceGate resource={player} loadingLabel={t("status.playerLoading")} errorTitle={t("status.playerError")}>
      {(playerData) => (
        <ResourceGate resource={ranks} loadingLabel={t("status.ranksLoading")} errorTitle={t("status.ranksError")}>
          {(ranksData) => (
            <VipPageContentInner {...props} player={playerData} vipRankTiers={ranksData.tiers} />
          )}
        </ResourceGate>
      )}
    </ResourceGate>
  );
}

/**
 * line tabs · desktop/mobile layout — mount หลังมีข้อมูลแล้ว (useState ตั้งแรงค์เริ่มจาก player ได้ตรง)
 */
function VipPageContentInner({
  activeTab,
  onSelectTab,
  embedded = false,
  player,
  vipRankTiers,
}: VipPageContentProps & { player: VipPlayerState; vipRankTiers: VipRankTier[] }) {
  const currentRankIndex = vipRankTiers.findIndex((t) => t.id === player.currentRankId);
  const [rankFocusIndex, setRankFocusIndex] = useState(
    currentRankIndex >= 0 ? currentRankIndex : 0,
  );
  const [embeddedTab, setEmbeddedTab] = useState(activeTab);
  const tab = embedded ? embeddedTab : activeTab;
  const selectTab = embedded ? setEmbeddedTab : onSelectTab;

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", embedded && "lg:min-h-0 lg:flex-1")}>
      <VipTabList activeTab={tab} onSelect={selectTab} />

      <TabPanelTransition
        tabKey={tab}
        order={VIP_PAGE_TABS.map((t) => t.id)}
        className="vip-page vip-modal vip-modal-typography flex min-h-0 flex-col lg:min-h-0 lg:flex-1"
      >
        <div className="vip-modal__body hidden min-h-0 flex-1 lg:flex lg:flex-col">
          <VipModalDesktopLayout
            tab={tab}
            player={player}
            vipRankTiers={vipRankTiers}
            rankFocusIndex={rankFocusIndex}
            onRankFocusChange={setRankFocusIndex}
          />
        </div>

        <div className="min-h-0 pb-1 lg:hidden">
          <VipMobileTabPanels
            tab={tab}
            player={player}
            vipRankTiers={vipRankTiers}
            rankFocusIndex={rankFocusIndex}
            onRankFocusChange={setRankFocusIndex}
          />
        </div>
      </TabPanelTransition>
    </div>
  );
}
