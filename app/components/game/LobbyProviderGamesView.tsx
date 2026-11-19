"use client";

import React, { useMemo, useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
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
  const t = useT("games");
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
      {/* แถวเดียว: ปุ่มกลับ pill (ชื่อหมวด) · ชื่อค่ายตรงกลาง · จำนวนเกมเป็นชิปขวา */}
      <div className="flex min-w-0 items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 min-w-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--surface-solid-inner)] py-0 pl-2.5 pr-4 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-95"
          aria-label={t("providerGames.backToCategory", { category: categoryLabel })}
        >
          <ChevronLeftIcon className="h-5 w-5 shrink-0 text-[var(--icon-active)]" />
          <span className="cosmic-type-body truncate">{categoryLabel}</span>
        </button>
        <h1 className="min-w-0 flex-1 truncate text-center text-lg font-medium uppercase leading-tight tracking-tight text-[var(--text-primary)]">
          {providerInfo.name}
        </h1>
        <span className="cosmic-type-caption shrink-0 rounded-[var(--radius-pill)] bg-[var(--surface-solid-inner)] px-3 py-1.5 text-[var(--text-secondary)]">
          {t("providerGames.gameCountPlain", { count: filteredGames.length })}
        </span>
      </div>

      <GameSearchBar placeholder={t("providerGames.searchPlaceholder")} onSearch={setSearchQuery} />

      <ProviderGameGrid key={providerId} games={filteredGames} />
    </div>
  );
}
