"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { VipModalTabId } from "@/app/types/vip";
import {
  OVERLAY_LAYER_KEY,
  OVERLAY_VIP_TAB_KEY,
  parseVipModalTab,
} from "@/lib/overlayUrl";
import {
  getVipRankTier,
  VIP_PLAYER_MOCK,
  VIP_RANK_TIERS,
} from "@/app/data/vipMockData";
import { CloseIcon } from "../ui/Icons";
import {
  RESPONSIVE_SHEET_HANDLE_CLASS,
  responsiveSheetCloseButtonClass,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { COSMIC_SEGMENT_GLASS_WHITE } from "../ui/cosmicButtonClasses";
import { VipBenefitsComparisonTable } from "./VipBenefitsComparisonTable";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipModalDesktopLayout } from "./VipModalDesktopLayout";
import { VipRankRequirementsPanel } from "./VipRankRequirementsPanel";
import { VipRankCarousel } from "./VipRankCarousel";
import { VipRankEmblem } from "./VipRankEmblem";

const VIP_TABS: { id: VipModalTabId; label: string }[] = [
  { id: "my-level", label: "ระดับของฉัน" },
  { id: "rank", label: "แร็งค์" },
  { id: "benefits", label: "สิทธิประโยชน์" },
];

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal ข้อมูล VIP — responsive sheet แบบคูปอง · desktop แบ่งคอลัมน์ + ตารางสิทธิประโยชน์
 */
export function VipModal({ isOpen, onClose }: VipModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<VipModalTabId>("my-level");
  const player = VIP_PLAYER_MOCK;
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;
  const currentRankIndex = VIP_RANK_TIERS.findIndex((t) => t.id === player.currentRankId);
  const [rankFocusIndex, setRankFocusIndex] = useState(
    currentRankIndex >= 0 ? currentRankIndex : 0,
  );

  useEffect(() => {
    if (!isOpen) return;
    const fromUrl = parseVipModalTab(searchParams.get(OVERLAY_VIP_TAB_KEY));
    if (fromUrl) setTab(fromUrl);
  }, [isOpen, searchParams]);

  const selectTab = (id: VipModalTabId) => {
    setTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set(OVERLAY_LAYER_KEY, "vip");
    params.set(OVERLAY_VIP_TAB_KEY, id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTab("my-level");
      setRankFocusIndex(currentRankIndex >= 0 ? currentRankIndex : 0);
      onClose();
    }
  };

  const tabList = (
    <div
      role="tablist"
      aria-label="เมนู VIP"
      className={`${COSMIC_SEGMENT_GLASS_WHITE} vip-modal__segment-track grid shrink-0 grid-cols-3 gap-1.5`}
    >
      {VIP_TABS.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => selectTab(item.id)}
            className={`cosmic-segment-btn px-1 py-2 text-xs leading-snug sm:text-sm lg:py-2 ${
              active ? "is-active" : ""
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass()} />

        <Dialog.Content
          aria-describedby="vip-modal-desc"
          className={responsiveSheetContentClass(
            "hub-modal-shell vip-modal flex flex-col overflow-hidden max-lg:max-h-[min(92dvh,640px)]",
            { variant: "hubWide" },
          )}
        >
          <div className={RESPONSIVE_SHEET_HANDLE_CLASS} aria-hidden="true" />

          <header
            className="vip-modal__header responsive-sheet-header--hub responsive-sheet-header--hub-shell w-full shrink-0 pb-1 pt-0.5 max-lg:space-y-2 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,28rem)_auto] lg:items-center lg:gap-x-4 lg:pb-2"
          >
            <div className="flex min-w-0 items-start justify-between gap-3 lg:contents">
              <div className="min-w-0 text-left lg:col-start-1 lg:row-start-1">
                <Dialog.Title className="text-2xl font-medium tracking-tight lg:text-[1.625rem]">
                  VIP
                </Dialog.Title>
                <p id="vip-modal-desc" className="vip-modal-subtitle mt-1 text-sm leading-snug">
                  ระดับ แร็งค์ และสิทธิประโยชน์
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={`${responsiveSheetCloseButtonClass()} lg:col-start-3 lg:row-start-1 lg:self-center`}
                  aria-label="ปิด VIP"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <div className="w-full min-w-0 lg:col-start-2 lg:row-start-1 lg:justify-self-center">
              {tabList}
            </div>
          </header>

          <div className="cosmic-modal-shell--hub vip-modal-typography vip-modal__scroll min-h-0 flex-1 overflow-hidden pt-1 lg:pt-0">
            <div className="vip-modal__body hidden min-h-0 flex-1 overflow-hidden lg:flex lg:flex-col">
              <VipModalDesktopLayout
                tab={tab}
                player={player}
                rankFocusIndex={rankFocusIndex}
                onRankFocusChange={setRankFocusIndex}
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pb-1 lg:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {tab === "my-level" && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">ระดับปัจจุบัน</p>
                  <VipRankEmblem rankId={player.currentRankId} size="lg" />
                  <p
                    className="text-2xl font-medium tracking-[0.2em]"
                    style={{ color: currentTier.accent }}
                  >
                    {currentTier.label}
                  </p>
                  {nextTier && (
                    <p className="text-sm text-[var(--text-secondary)]">
                      ระดับถัดไป{" "}
                      <span className="font-medium text-[var(--text-primary)]">
                        {nextTier.label}
                      </span>
                    </p>
                  )}

                  <div className="w-full pt-2">
                    <VipRankRequirementsPanel
                      player={player}
                      focusRankId={player.currentRankId}
                      sectionTitle="ภารกิจเลื่อนระดับ"
                      sectionSubtitle="ทำภารกิจให้ครบตามเป้าหมาย"
                    />
                  </div>

                  <VipMaintainRankPanel activeRankId={player.currentRankId} />
                </div>
              )}

              {tab === "rank" && (
                <div className="flex flex-col items-center gap-4">
                  <VipRankCarousel
                    focusIndex={rankFocusIndex}
                    onFocusChange={setRankFocusIndex}
                    playerRankId={player.currentRankId}
                  />

                  <div className="w-full border-t border-[var(--border-subtle)]/50 pt-4">
                    <VipRankRequirementsPanel
                      player={player}
                      focusRankId={VIP_RANK_TIERS[rankFocusIndex]?.id ?? player.currentRankId}
                    />
                  </div>
                </div>
              )}

              {tab === "benefits" && (
                <VipBenefitsComparisonTable currentRankId={player.currentRankId} />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
