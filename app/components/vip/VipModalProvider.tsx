"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { VipModal } from "./VipModal";

interface VipModalContextValue {
  openVipModal: () => void;
  closeVipModal: () => void;
}

const VipModalContext = createContext<VipModalContextValue | null>(null);

/**
 * เปิด/ปิด modal VIP — mount ใน AppProviders
 */
export function VipModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openVipModal = useCallback(() => setIsOpen(true), []);
  const closeVipModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openVipModal, closeVipModal }),
    [openVipModal, closeVipModal],
  );

  return (
    <VipModalContext.Provider value={value}>
      {children}
      <VipModal isOpen={isOpen} onClose={closeVipModal} />
    </VipModalContext.Provider>
  );
}

export function useVipModal(): VipModalContextValue {
  const ctx = useContext(VipModalContext);
  if (!ctx) {
    throw new Error("useVipModal ต้องใช้ภายใน VipModalProvider");
  }
  return ctx;
}
