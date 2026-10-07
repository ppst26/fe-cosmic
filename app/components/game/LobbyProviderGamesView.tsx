"use client";

import React, { useMemo, useState } from "react";
import { CategorySectionHead } from "@/app/components/home/CategorySectionHead";
import { GameSearchBar } from "@/app/components/home/GameSearchBar";
import { ProviderGameGrid } from "@/app/components/slots/ProviderGameGrid";
import { ChevronLeftIcon } from "@/app/components/ui/Icons";
import { getGamesByProvider, PROVIDER_INFO_MAP } from "@/app/data/providerGamesData";
import { resolveCategoryProviderId } from "@/lib/categoryProviderPaths";

type LobbyProviderGamesViewProps = {
  categoryLabel: string;
  providerSlug: string;
  /** สล็อตใช้ slug ตรง · หมวดอื่นแปลงผ่าน resolveCategoryProviderId */
  resolveCategory?: "fishing" | "cards" | "casino";
  onBack: () => void;
};

/**
 * รายการเกมในค่าย — อยู่ใน lobby shell (สล็อต · ยิงปลา · เกมไพ่)
 * ถูกเรียกใช้ใน LobbyCategoryProviders.tsx
 */
export function LobbyProviderGamesView({
  categoryLabel,
  providerSlug,
  resolveCategory,
  onBack,
}: LobbyProviderGamesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const providerId = useMemo(() => {
    if (resolveCategory) return resolveCategoryProviderId(resolveCategory, providerSlug);
    return providerSlug;
  }, [resolveCategory, providerSlug]);

  const providerInfo = useMemo(() => {
    return (
      PROVIDER_INFO_MAP[providerId] || {
        id: providerId,
        name: providerSlug.replace(/-/g, " ").toUpperCase(),
        totalGames: 100,
      }
    );
  }, [providerId, providerSlug]);

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
              aria-label={`กลับไปหน้ารวม${categoryLabel}`}
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
                  {categoryLabel}
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

      <ProviderGameGrid key={providerId} games={filteredGames} />
    </div>
  );
}
