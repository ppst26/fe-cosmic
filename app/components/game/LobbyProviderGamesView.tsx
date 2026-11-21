"use client";

import React, { useMemo, useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { ProviderCategoryToolbar } from "@/app/components/slots/ProviderCategoryToolbar";
import { ProviderGameGrid } from "@/app/components/slots/ProviderGameGrid";
import { ArrowLeftIcon } from "@/app/components/ui/Icons";
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
      {/* แถวหัวหน้า (เหมือนหน้ารายการค่าย): [ปุ่มกลับวงกลม · ชื่อค่าย (จำนวนเกม)] ชิดซ้าย · ช่องค้นหา pill เล็กชิดขวา */}
      <div className="flex min-w-0 items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="cosmic-back-btn shrink-0"
            aria-label={t("providerGames.backToCategory", { category: categoryLabel })}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 items-baseline gap-1.5">
            <h1 className="m-0 truncate text-base font-medium uppercase text-[var(--text-primary)] sm:text-lg">
              {providerInfo.name}
            </h1>
            <span className="whitespace-nowrap text-xs text-[var(--text-muted)]">
              {t("providerGames.gameCount", { count: filteredGames.length })}
            </span>
          </div>
        </div>
        <ProviderCategoryToolbar
          className="provider-category-toolbar--compact !m-0 min-w-0 !w-[38%] shrink-0"
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder={t("providerGames.searchPlaceholder")}
        />
      </div>

      <ProviderGameGrid key={providerId} games={filteredGames} />
    </div>
  );
}
