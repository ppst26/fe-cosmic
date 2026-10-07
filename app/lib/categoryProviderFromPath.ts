import type { CategoryId } from "@/app/types/lobby";

/** drilldown ค่ายใน lobby — /slots|fishing|cards/[provider] */
export type CategoryProviderRoute = {
  categoryId: "slots" | "fishing" | "cards";
  slug: string;
  listHref: string;
};

const CATEGORY_PROVIDER_PREFIXES: {
  prefix: string;
  categoryId: CategoryProviderRoute["categoryId"];
  listHref: string;
}[] = [
  { prefix: "/slots/", categoryId: "slots", listHref: "/slots" },
  { prefix: "/fishing/", categoryId: "fishing", listHref: "/fishing" },
  { prefix: "/cards/", categoryId: "cards", listHref: "/cards" },
];

/**
 * อ่าน slug ค่ายจาก pathname — ใช้ใน LobbyCategoryProviders
 */
export function parseCategoryProviderFromPath(pathname: string): CategoryProviderRoute | null {
  for (const { prefix, categoryId, listHref } of CATEGORY_PROVIDER_PREFIXES) {
    if (!pathname.startsWith(prefix)) continue;
    const segment = pathname.slice(prefix.length).split("/")[0];
    if (!segment) continue;
    return {
      categoryId,
      slug: decodeURIComponent(segment).toLowerCase(),
      listHref,
    };
  }
  return null;
}

export function categoryProviderMatchesLobbyCategory(
  route: CategoryProviderRoute,
  categoryId: CategoryId,
): boolean {
  return route.categoryId === categoryId;
}
