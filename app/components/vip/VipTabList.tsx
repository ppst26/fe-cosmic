"use client";

import type { VipModalTabId } from "@/app/types/vip";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";
import { VIP_PAGE_TABS } from "./vipTabConfig";

interface VipTabListProps {
  activeTab: VipModalTabId;
  onSelect: (tab: VipModalTabId) => void;
}

/**
 * แท็บ VIP — line underline (หน้า /vip)
 */
export function VipTabList({ activeTab, onSelect }: VipTabListProps) {
  return (
    <CosmicLineTabs
      tabs={VIP_PAGE_TABS}
      activeId={activeTab}
      onSelect={onSelect}
      ariaLabel="เมนู VIP"
      columns={3}
    />
  );
}
