import { CategoryProviderGamesPage } from "@/app/components/game/CategoryProviderGamesPage";

/** รายการเกมในค่ายยิงปลา — /fishing/[provider] */
export default function FishingProviderGamesRoutePage() {
  return (
    <CategoryProviderGamesPage
      category="fishing"
      categoryLabel="ยิงปลา"
      backHref="/fishing"
    />
  );
}
