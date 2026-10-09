"use client";

import { LobbyProviderGamesView } from "@/app/components/game/LobbyProviderGamesView";
import { useT } from "@/lib/i18n/I18nProvider";

interface LobbySlotProviderViewProps {
  providerId: string;
  onBack: () => void;
}

/** รายการเกมค่ายสล็อตใน lobby — wrapper ของ LobbyProviderGamesView */
export function LobbySlotProviderView({ providerId, onBack }: LobbySlotProviderViewProps) {
  const t = useT("games");
  return (
    <LobbyProviderGamesView
      categoryLabel={t("slots.title")}
      providerSlug={providerId}
      onBack={onBack}
    />
  );
}
