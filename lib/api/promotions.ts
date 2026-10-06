import type {
  PromotionDetailContent,
  PromotionDetailId,
  PromotionsCatalogResponse,
} from "@/app/types/promotions";
import { apiFetch, type ApiResult } from "./http";

/** catalog โปรโมชัน + กิจกรรม — ใช้ใน PromotionsCatalogProvider */
export function fetchPromotionsCatalog(): Promise<ApiResult<PromotionsCatalogResponse>> {
  return apiFetch<PromotionsCatalogResponse>("/api/promotions");
}

/** รายละเอียดโปรโมชันรายตัว — null เมื่อไม่พบหรือโหลดไม่ได้ */
export async function fetchPromotionDetail(
  id: PromotionDetailId,
): Promise<PromotionDetailContent | null> {
  const res = await apiFetch<{ detail: PromotionDetailContent }>(
    `/api/promotions/${encodeURIComponent(id)}`,
  );
  return res.ok ? (res.data?.detail ?? null) : null;
}
