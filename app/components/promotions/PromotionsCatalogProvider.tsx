"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { fetchPromotionDetail, fetchPromotionsCatalog } from "@/lib/api/promotions";
import type {
  PromotionDetailContent,
  PromotionDetailId,
  PromotionsCatalogResponse,
} from "@/app/types/promotions";

interface PromotionsCatalogContextValue {
  catalog: PromotionsCatalogResponse | null;
  loading: boolean;
  error: string | null;
  fetchDetail: (id: PromotionDetailId) => Promise<PromotionDetailContent | null>;
  getCachedDetail: (id: PromotionDetailId) => PromotionDetailContent | null;
}

const PromotionsCatalogContext = createContext<PromotionsCatalogContextValue | null>(null);

/**
 * โหลด catalog จาก /api/promotions — ใช้ห่อ PromotionsHubPageContent
 */
const PROMOTIONS_LOAD_ERROR = "โหลดโปรโมชั่นไม่สำเร็จ";

export function PromotionsCatalogProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState<PromotionsCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detailCacheRef = useRef<Partial<Record<PromotionDetailId, PromotionDetailContent>>>({});
  const loadErrorToastedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void fetchPromotionsCatalog().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setCatalog(res.data);
      } else {
        setError(PROMOTIONS_LOAD_ERROR);
        if (!loadErrorToastedRef.current) {
          loadErrorToastedRef.current = true;
          showToast(PROMOTIONS_LOAD_ERROR, "error");
        }
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const getCachedDetail = useCallback((id: PromotionDetailId) => detailCacheRef.current[id] ?? null, []);

  const fetchDetail = useCallback(async (id: PromotionDetailId) => {
    const cached = detailCacheRef.current[id];
    if (cached) return cached;

    const detail = await fetchPromotionDetail(id);
    if (detail) detailCacheRef.current[id] = detail;
    return detail;
  }, []);

  const value = useMemo(
    () => ({ catalog, loading, error, fetchDetail, getCachedDetail }),
    [catalog, loading, error, fetchDetail, getCachedDetail],
  );

  return (
    <PromotionsCatalogContext.Provider value={value}>{children}</PromotionsCatalogContext.Provider>
  );
}

export function usePromotionsCatalog() {
  const ctx = useContext(PromotionsCatalogContext);
  if (!ctx) {
    throw new Error("usePromotionsCatalog ต้องใช้ภายใน PromotionsCatalogProvider");
  }
  return ctx;
}
