import type { CategoryId, CategoryItem } from "@/app/types/lobby";

/**
 * หา category id จาก pathname — path ยาวก่อน เพื่อไม่ให้ "/" match ทุกหน้า
 * ใช้ใน CategoryNav.tsx และ HomeLobbyPage.tsx
 */
export function resolveLobbyCategoryFromPath(
  pathname: string,
  categories: CategoryItem[],
): CategoryId | null {
  const sorted = [...categories].sort((a, b) => b.href.length - a.href.length);

  for (const category of sorted) {
    if (!category.href.startsWith("/")) continue;
    if (category.href === "/") {
      if (pathname === "/") return category.id;
      continue;
    }
    if (pathname === category.href || pathname.startsWith(`${category.href}/`)) {
      return category.id;
    }
  }
  return null;
}
