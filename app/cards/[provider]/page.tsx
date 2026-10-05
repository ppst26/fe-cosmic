import { CategoryProviderGamesPage } from "@/app/components/game/CategoryProviderGamesPage";

/** รายการเกมในค่ายเกมไพ่ — /cards/[provider] */
export default function CardsProviderGamesRoutePage() {
  return (
    <CategoryProviderGamesPage
      category="cards"
      categoryLabel="เกมไพ่"
      backHref="/cards"
    />
  );
}
