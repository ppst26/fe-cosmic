"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const SIDEBAR_STORAGE_KEY = "cosmicbet-lobby-sidebar-collapsed";

function readSidebarHiddenFromStorage(fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* ignore */
  }
  return fallback;
}

interface LobbyShellSidebarContextValue {
  /** true = ซ่อน sidebar + hub ทั้งคอลัมน์ซ้าย */
  sidebarHidden: boolean;
  setSidebarHidden: (hidden: boolean) => void;
  toggleSidebarHidden: () => void;
}

const LobbyShellSidebarContext = createContext<LobbyShellSidebarContextValue | null>(null);

/**
 * สถานะซ่อน/แสดงคอลัมน์ซ้าย desktop — ปุ่มอยู่ที่ Header · ใช้ใน HomeLobbyPage / LobbyDesktopPageShell
 */
export function LobbyShellSidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarHidden, setSidebarHiddenState] = useState(false);

  useEffect(() => {
    setSidebarHiddenState(readSidebarHiddenFromStorage(false));
  }, []);

  const setSidebarHidden = useCallback((hidden: boolean) => {
    setSidebarHiddenState(hidden);
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, hidden ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSidebarHidden = useCallback(() => {
    setSidebarHiddenState((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ sidebarHidden, setSidebarHidden, toggleSidebarHidden }),
    [sidebarHidden, setSidebarHidden, toggleSidebarHidden],
  );

  return (
    <LobbyShellSidebarContext.Provider value={value}>{children}</LobbyShellSidebarContext.Provider>
  );
}

export function useLobbyShellSidebar() {
  const ctx = useContext(LobbyShellSidebarContext);
  if (!ctx) {
    throw new Error("useLobbyShellSidebar must be used within LobbyShellSidebarProvider");
  }
  return ctx;
}

/** ใช้ใน Header — ไม่ throw ถ้าไม่มี provider (หน้านอก lobby) */
export function useLobbyShellSidebarOptional() {
  return useContext(LobbyShellSidebarContext);
}
