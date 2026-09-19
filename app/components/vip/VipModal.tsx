"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import type { VipModalTabId } from "@/app/types/vip";
import {
  getVipRankTier,
  VIP_PLAYER_MOCK,
  VIP_RANK_TIERS,
} from "@/app/data/vipMockData";
import { CloseIcon } from "../ui/Icons";
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
 * Modal ข้อมูล VIP — mobile แนวตั้ง · desktop แบ่งคอลัมน์ + ตารางสิทธิประโยชน์
 */
export function VipModal({ isOpen, onClose }: VipModalProps) {
  const [tab, setTab] = useState<VipModalTabId>("my-level");
  const player = VIP_PLAYER_MOCK;
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;
  const currentRankIndex = VIP_RANK_TIERS.findIndex((t) => t.id === player.currentRankId);
  const [rankFocusIndex, setRankFocusIndex] = useState(
    currentRankIndex >= 0 ? currentRankIndex : 0,
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTab("my-level");
      setRankFocusIndex(currentRankIndex >= 0 ? currentRankIndex : 0);
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="cosmic-dialog-overlay fixed inset-0 z-[65] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />

        <Dialog.Content
          aria-describedby={undefined}
          className="cosmic-modal-shell cosmic-modal-shell--hub vip-modal fixed left-1/2 top-1/2 z-[70] flex w-[min(calc(100vw-1.5rem),400px)] max-h-[min(90dvh,640px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-[var(--text-primary)] shadow-[0_22px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
        >
          <div className="relative shrink-0 px-4 pb-3 pt-4 lg:px-5 lg:pb-4">
            <Dialog.Title className="text-center text-lg font-medium tracking-wide lg:text-xl">
              VIP
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--icon-active)] lg:right-4 lg:top-4"
                aria-label="ปิด VIP"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </Dialog.Close>

            <div
              role="tablist"
              aria-label="เมนู VIP"
              className="hub-modal-segment-track mt-3 grid grid-cols-3 lg:mt-4 lg:mx-auto lg:max-w-xl"
            >
              {VIP_TABS.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(item.id)}
                    className={`hub-modal-segment-btn px-1 py-2 text-[11px] leading-tight sm:text-xs lg:py-2.5 ${
                      active ? "is-active" : ""
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="vip-modal__body hidden min-h-0 flex-1 overflow-hidden px-4 pb-5 lg:flex lg:flex-col">
            <VipModalDesktopLayout
              tab={tab}
              player={player}
              rankFocusIndex={rankFocusIndex}
              onRankFocusChange={setRankFocusIndex}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tab === "my-level" && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs text-[var(--text-muted)]">ระดับปัจจุบัน</p>
                <VipRankEmblem rankId={player.currentRankId} size="lg" />
                <p
                  className="text-2xl font-medium tracking-[0.2em]"
                  style={{ color: currentTier.accent }}
                >
                  {currentTier.label}
                </p>
                {nextTier && (
                  <p className="text-xs text-[var(--text-secondary)]">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
