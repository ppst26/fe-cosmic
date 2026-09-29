"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
export function PromotionsCatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<PromotionsCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detailCacheRef = useRef<Partial<Record<PromotionDetailId, PromotionDetailContent>>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/promotions");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as PromotionsCatalogResponse;
        if (!cancelled) setCatalog(data);
      } catch {
        if (!cancelled) setError("โหลดโปรโมชั่นไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCachedDetail = useCallback((id: PromotionDetailId) => detailCacheRef.current[id] ?? null, []);

  const fetchDetail = useCallback(async (id: PromotionDetailId) => {
    const cached = detailCacheRef.current[id];
    if (cached) return cached;

    const res = await fetch(`/api/promotions/${id}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { detail: PromotionDetailContent };
    detailCacheRef.current[id] = data.detail;
    return data.detail;
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
