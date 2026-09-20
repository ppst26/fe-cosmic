"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  OVERLAY_LAYER_KEY,
  clearLayerParams,
  readOverlayLayer,
  type OverlayLayer,
} from "@/lib/overlayUrl";

/**
 * เปิด/ปิด overlay แล้ว sync ?layer= กับ URL (รองรับปุ่มย้อนในเบราว์เซอร์)
 */
export function useOverlayLayer(layer: OverlayLayer) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(readOverlayLayer(searchParams) === layer);
  }, [searchParams, layer]);

  const open = useCallback(
    (extra?: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(OVERLAY_LAYER_KEY, layer);
      if (extra) {
        for (const [key, value] of Object.entries(extra)) {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setIsOpen(true);
    },
    [layer, pathname, router, searchParams],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    clearLayerParams(params, layer);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setIsOpen(false);
  }, [layer, pathname, router, searchParams]);

  return { isOpen, open, close, setIsOpen };
}
