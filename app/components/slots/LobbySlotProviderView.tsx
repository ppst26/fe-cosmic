"use client";

import { LobbyProviderGamesView } from "@/app/components/game/LobbyProviderGamesView";

interface LobbySlotProviderViewProps {
  providerId: string;
  onBack: () => void;
}

/** รายการเกมค่ายสล็อตใน lobby — wrapper ของ LobbyProviderGamesView */
export function LobbySlotProviderView({ providerId, onBack }: LobbySlotProviderViewProps) {
  return (
    <LobbyProviderGamesView
      categoryLabel="สล็อต"
      providerSlug={providerId}
      onBack={onBack}
    />
  );
}
