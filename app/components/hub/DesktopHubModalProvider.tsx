"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { DesktopHubModal } from "./DesktopHubModal";
import type { DesktopHubId, OpenHubOptions } from "./hubModalRegistry";
import { HUB_REQUIRES_AUTH } from "./hubModalRegistry";

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
 * เปิด/ปิด hub modal บน desktop — mount ใน AppProviders
 */
export function DesktopHubModalProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [state, setState] = useState<HubModalState | null>(null);

  const closeHub = useCallback(() => setState(null), []);

  const openHub = useCallback(
    (id: DesktopHubId, options?: OpenHubOptions) => {
      if (HUB_REQUIRES_AUTH.has(id) && !isLoading && !isAuthenticated) {
        return;
      }
      setState({ id, options });
    },
    [isAuthenticated, isLoading],
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
