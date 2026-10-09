"use client";

import React, { useMemo, useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { ProviderBreadcrumb } from "@/app/components/slots/ProviderBreadcrumb";
import { GameSearchBar } from "@/app/components/home/GameSearchBar";
import { ProviderGameGrid } from "@/app/components/slots/ProviderGameGrid";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
import {
  getGamesByProvider,
  PROVIDER_INFO_MAP,
} from "@/app/data/providerGamesData";
import { resolveCategoryProviderId } from "@/lib/categoryProviderPaths";

type CategoryProviderGamesPageProps = {
  category: "casino" | "fishing" | "cards";
  categoryLabel: string;
  backHref: string;
};

/**
 * หน้ารายการเกมในค่าย — คาสิโน · ยิงปลา · เกมไพ่ (กดเกม → /play mock)
 */
export function CategoryProviderGamesPage({
  category,
  categoryLabel,
  backHref,
}: CategoryProviderGamesPageProps) {
  const t = useT("games");
  const urlParams = useParams();
  const rawSlug = (urlParams?.provider as string) || "unknown";
  const providerId = resolveCategoryProviderId(category, rawSlug);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const providerInfo = useMemo(() => {
    return (
      PROVIDER_INFO_MAP[providerId] || {
        id: providerId,
        name: rawSlug.replace(/-/g, " ").toUpperCase(),
        totalGames: 100,
      }
    );
  }, [providerId, rawSlug]);

  const filteredGames = useMemo(() => {
    const all = getGamesByProvider(providerId);
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase().trim();
    return all.filter((game) => game.title.toLowerCase().includes(q));
  }, [providerId, searchQuery]);

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <ProviderBreadcrumb
        providerName={providerInfo.name}
        backHref={backHref}
        categoryLabel={categoryLabel}
      />

      <main className="mobile-standalone-main pt-2">
        <GameSearchBar
          placeholder={t("providerGames.searchPlaceholder")}
          onSearch={setSearchQuery}
        />

        <div className="mt-3 mb-1 flex items-center gap-2">
          <h1 className="text-xl font-medium uppercase tracking-tight text-white drop-shadow sm:text-2xl">
            {providerInfo.name}
          </h1>
        </div>

        <ProviderGameGrid games={filteredGames} />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
