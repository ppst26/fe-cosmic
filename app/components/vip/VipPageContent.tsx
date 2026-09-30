"use client";

import React, { useState } from "react";
import type { VipModalTabId } from "@/app/types/vip";
import { VIP_PLAYER_MOCK, VIP_RANK_TIERS } from "@/app/data/vipMockData";
import { VipModalDesktopLayout } from "./VipModalDesktopLayout";
import { VipMobileTabPanels } from "./VipMobileTabPanels";
import { VipTabList } from "./VipTabList";

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
  const player = VIP_PLAYER_MOCK;
  const currentRankIndex = VIP_RANK_TIERS.findIndex((t) => t.id === player.currentRankId);
  const [rankFocusIndex, setRankFocusIndex] = useState(
    currentRankIndex >= 0 ? currentRankIndex : 0,
  );
  const [embeddedTab, setEmbeddedTab] = useState(activeTab);
  const tab = embedded ? embeddedTab : activeTab;
  const selectTab = embedded ? setEmbeddedTab : onSelectTab;

  return (
    <div className="flex flex-col gap-4">
      <VipTabList activeTab={tab} onSelect={selectTab} />

      <div className="vip-page vip-modal vip-modal-typography min-h-0">
        <div className="vip-modal__body hidden min-h-0 lg:flex lg:flex-col">
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
      </div>
    </div>
  );
}
