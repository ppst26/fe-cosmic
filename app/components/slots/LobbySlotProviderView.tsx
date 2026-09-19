"use client";

import React, { useMemo, useState } from "react";
import { CategorySectionHead } from "@/app/components/home/CategorySectionHead";
import { GameSearchBar } from "@/app/components/home/GameSearchBar";
import { ProviderGameGrid } from "@/app/components/slots/ProviderGameGrid";
import { ChevronLeftIcon } from "@/app/components/ui/Icons";
import { getGamesByProvider, PROVIDER_INFO_MAP } from "@/app/data/providerGamesData";

interface LobbySlotProviderViewProps {
  providerId: string;
  onBack: () => void;
}

/**
 * รายการเกมในค่ายสล็อต — ใช้ใน lobby ไม่เปลี่ยนหน้า · ไม่มี feature card
 * ถูกเรียกใช้ใน LobbyCategoryProviders.tsx
 */
export function LobbySlotProviderView({ providerId, onBack }: LobbySlotProviderViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const providerInfo = useMemo(() => {
    return (
      PROVIDER_INFO_MAP[providerId] || {
        id: providerId,
        name: providerId.replace(/-/g, " ").toUpperCase(),
        totalGames: 100,
      }
    );
  }, [providerId]);

  const filteredGames = useMemo(() => {
    const all = getGamesByProvider(providerId);
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase().trim();
    return all.filter((game) => game.title.toLowerCase().includes(q));
  }, [providerId, searchQuery]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <CategorySectionHead
        start={
          <nav className="flex min-w-0 items-center gap-1.5 text-sm sm:text-base" aria-label="breadcrumb">
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--icon-active)] transition-colors hover:bg-[var(--surface-hover)] active:scale-95"
              aria-label="กลับไปรายการค่ายสล็อต"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <ol className="flex min-w-0 items-center gap-2">
              <li>
                <button
                  type="button"
                  onClick={onBack}
                  className="font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--text-secondary)]"
                >
                  สล็อต
                </button>
              </li>
              <li className="font-light text-[var(--text-muted)]" aria-hidden="true">
                /
              </li>
              <li
                className="truncate font-medium uppercase tracking-tight text-[var(--text-primary)]"
                aria-current="page"
              >
                {providerInfo.name}
              </li>
            </ol>
          </nav>
        }
        meta={
          <span className="font-medium text-[var(--text-muted)]">
            ({filteredGames.length} เกม)
          </span>
        }
      />

      <GameSearchBar placeholder="ค้นหาเกมในค่ายนี้" onSearch={setSearchQuery} />

      <ProviderGameGrid games={filteredGames} />
    </div>
  );
}
