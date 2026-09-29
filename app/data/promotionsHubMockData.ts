/**
 * @deprecated ใช้ /api/promotions + app/types/promotions — คง re-export type/filter ให้ import เดิม
 */
export type {
  PromoHubCategoryId,
  PromoHubCategoryFilterId,
  PromoHubHero,
  PromoHubFeaturedItem,
  PromoHubActivityItem,
  PromoHubMobileCategoryId,
  PromoHubMobileCategoryFilterId,
  PromoHubMobileListItem,
} from "@/app/types/promotions";

export {
  matchesPromoHubCategory,
  matchesPromoHubMobileCategory,
} from "@/lib/promotions/promotionFilters";
