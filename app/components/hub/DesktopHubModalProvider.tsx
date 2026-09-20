"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { DesktopHubModal } from "./DesktopHubModal";
import type { DesktopHubId, OpenHubOptions } from "./hubModalRegistry";
import { HUB_REQUIRES_AUTH, isDesktopHubId } from "./hubModalRegistry";
import {
  OVERLAY_HUB_KEY,
  OVERLAY_LAYER_KEY,
  clearLayerParams,
  readOverlayLayer,
} from "@/lib/overlayUrl";

interface HubModalState {
  id: DesktopHubId;
  options?: OpenHubOptions;
}

interface DesktopHubModalContextValue {
  openHub: (id: DesktopHubId, options?: OpenHubOptions) => void;
  closeHub: () => void;
  activeHub: DesktopHubId | null;
}

const DesktopHubModalContext = createContext<DesktopHubModalContextValue | null>(null);

/**
 * เปิด/ปิด hub modal บน desktop — sync ?layer=hub&hub=
 */
export function DesktopHubModalProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<HubModalState | null>(null);

  useEffect(() => {
    const layer = readOverlayLayer(searchParams);
    if (layer !== "hub") {
      setState(null);
      return;
    }
    const hubId = searchParams.get(OVERLAY_HUB_KEY);
    if (!isDesktopHubId(hubId)) {
      setState(null);
      return;
    }
    setState((prev) =>
      prev?.id === hubId ? prev : { id: hubId, options: undefined },
    );
  }, [searchParams]);

  const closeHub = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    clearLayerParams(params, "hub");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setState(null);
  }, [pathname, router, searchParams]);

  const openHub = useCallback(
    (id: DesktopHubId, options?: OpenHubOptions) => {
      if (HUB_REQUIRES_AUTH.has(id) && !isLoading && !isAuthenticated) {
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set(OVERLAY_LAYER_KEY, "hub");
      params.set(OVERLAY_HUB_KEY, id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setState({ id, options });
    },
    [isAuthenticated, isLoading, pathname, router, searchParams],
  );

  const value = useMemo(
    () => ({
      openHub,
      closeHub,
      activeHub: state?.id ?? null,
    }),
    [openHub, closeHub, state?.id],
  );

  return (
    <DesktopHubModalContext.Provider value={value}>
      {children}
      <DesktopHubModal
        hubId={state?.id ?? null}
        options={state?.options}
        onClose={closeHub}
      />
    </DesktopHubModalContext.Provider>
  );
}

export function useDesktopHubModal(): DesktopHubModalContextValue {
  const ctx = useContext(DesktopHubModalContext);
  if (!ctx) {
    throw new Error("useDesktopHubModal ต้องใช้ภายใน DesktopHubModalProvider");
  }
  return ctx;
}
