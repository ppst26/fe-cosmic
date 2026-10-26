"use client";

import React, { useState } from "react";
import type { VipModalTabId, VipPlayerState, VipRankTier } from "@/app/types/vip";
import { usePrefetchVipTabs, useVipPlayer, useVipRanks } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { getVipRankTier } from "@/app/data/vipMockData";
import { cn } from "@/lib/utils";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipTabList } from "./VipTabList";
import { VipTabPanels } from "./VipTabPanels";
import { VIP_PAGE_TABS } from "./vipTabConfig";
import { useT } from "@/lib/i18n/I18nProvider";
import s from "./vip-page.module.css";

/** ฝุ่นดาวหลังตรา hero — ตำแหน่ง/ขนาด/จังหวะคงที่ (ไม่สุ่ม เพื่อให้ SSR กับ client ตรงกัน) */
const HERO_DUST = [
  { "--x": "-52px", "--drift": "-10px", "--s": "3px", "--t": "4.2s", "--d": "0s" },
  { "--x": "-30px", "--drift": "8px", "--s": "2px", "--t": "5.1s", "--d": "0.9s" },
  { "--x": "-12px", "--drift": "-6px", "--s": "2.5px", "--t": "3.8s", "--d": "1.7s" },
  { "--x": "6px", "--drift": "12px", "--s": "2px", "--t": "4.6s", "--d": "0.4s" },
  { "--x": "24px", "--drift": "-14px", "--s": "3px", "--t": "5.4s", "--d": "2.3s" },
  { "--x": "42px", "--drift": "6px", "--s": "2px", "--t": "4s", "--d": "1.2s" },
  { "--x": "58px", "--drift": "-8px", "--s": "2.5px", "--t": "4.9s", "--d": "2.9s" },
  { "--x": "-40px", "--drift": "16px", "--s": "1.5px", "--t": "5.8s", "--d": "3.4s" },
  { "--x": "16px", "--drift": "-18px", "--s": "1.5px", "--t": "4.4s", "--d": "2s" },
  { "--x": "36px", "--drift": "10px", "--s": "2px", "--t": "5s", "--d": "0.2s" },
];

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
          {(ranksData) => <VipPageContentInner {...props} player={playerData} vipRankTiers={ranksData.tiers} />}
        </ResourceGate>
      )}
    </ResourceGate>
  );
}

/**
 * hero · แท็บ · เนื้อหา — mount หลังมีข้อมูลแล้ว (useState ตั้งแรงค์เริ่มจาก player ได้ตรง)
 */
function VipPageContentInner({
  activeTab,
  onSelectTab,
  embedded = false,
  player,
  vipRankTiers,
}: VipPageContentProps & { player: VipPlayerState; vipRankTiers: VipRankTier[] }) {
  const t = useT("vip");
  const currentRankIndex = vipRankTiers.findIndex((tier) => tier.id === player.currentRankId);
  const [rankFocusIndex, setRankFocusIndex] = useState(currentRankIndex >= 0 ? currentRankIndex : 0);
  const [embeddedTab, setEmbeddedTab] = useState(activeTab);
  const tab = embedded ? embeddedTab : activeTab;
  const selectTab = embedded ? setEmbeddedTab : onSelectTab;
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;

  return (
    <div className={cn("vip-root", s.root, embedded && s.embedded)}>
      <section className={cn("vip-hero", s.hero)}>
        <div className={s.heroText}>
          <h2 className={s.heroVip}>VIP</h2>
          <p className={s.heroTag}>{t("hero.tagline")}</p>
          <p className={s.heroSub}>{t("hero.sub")}</p>
        </div>
        <div
          className={s.heroEmblem}
          aria-label={t("level.currentAriaLabel")}
          style={{ "--vip-glow": currentTier.accent } as React.CSSProperties}
        >
          <span className={s.dust} aria-hidden>
            {HERO_DUST.map((p, i) => (
              <i key={i} style={p as React.CSSProperties} />
            ))}
          </span>
          <div className={s.emblemWrap}>
            <VipRankEmblem rankId={player.currentRankId} size="xl" />
          </div>
          <div className={s.pedestal} aria-hidden />
          <div className={s.heroPlate}>
            <p className={s.heroRank} style={{ "--rank-accent": currentTier.accent } as React.CSSProperties}>
              <span className={s.heroRankText}>{currentTier.label}</span>
            </p>
            {nextTier ? (
              <p className={s.heroNext}>
                {t("level.next")} <b>{nextTier.label}</b>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <VipTabList activeTab={tab} onSelect={selectTab} />

      <TabPanelTransition tabKey={tab} order={VIP_PAGE_TABS.map((item) => item.id)} className="min-h-0 pb-1">
        <VipTabPanels
          tab={tab}
          player={player}
          vipRankTiers={vipRankTiers}
          rankFocusIndex={rankFocusIndex}
          onRankFocusChange={setRankFocusIndex}
          onSelectTab={selectTab}
        />
      </TabPanelTransition>
    </div>
  );
}
