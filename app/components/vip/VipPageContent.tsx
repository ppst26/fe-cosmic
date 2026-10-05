"use client";

import React, { useState } from "react";
import type { VipModalTabId } from "@/app/types/vip";
import { fetchVipPlayer, fetchVipRanks } from "@/lib/api/vip";
import { cn } from "@/lib/utils";
import { VipModalDesktopLayout } from "./VipModalDesktopLayout";
import { VipMobileTabPanels } from "./VipMobileTabPanels";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { VipTabList } from "./VipTabList";
import { VIP_PAGE_TABS } from "./vipTabConfig";

interface VipPageContentProps {
  activeTab: VipModalTabId;
  onSelectTab: (tab: VipModalTabId) => void;
  /** hub modal บน desktop — สลับแท็บใน modal ไม่เปลี่ยน route */
  embedded?: boolean;
}

/**
 * เนื้อหาหน้า VIP standalone — line tabs · desktop/mobile layout
 */
export function VipPageContent({
  activeTab,
  onSelectTab,
  embedded = false,
}: VipPageContentProps) {
  const player = fetchVipPlayer();
  const vipRankTiers = fetchVipRanks().tiers;
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
            rankFocusIndex={rankFocusIndex}
            onRankFocusChange={setRankFocusIndex}
          />
        </div>

        <div className="min-h-0 pb-1 lg:hidden">
          <VipMobileTabPanels
            tab={tab}
            player={player}
            rankFocusIndex={rankFocusIndex}
            onRankFocusChange={setRankFocusIndex}
          />
        </div>
      </TabPanelTransition>
    </div>
  );
}
