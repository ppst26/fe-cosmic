"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LoginRequestBody, RegisterRequestBody, SessionUser } from "@/app/types/auth";
import { fetchSession, loginUser, logoutUser, registerUser } from "@/lib/auth/client";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  register: (body: RegisterRequestBody) => Promise<{ ok: boolean; error?: string }>;
  login: (body: LoginRequestBody) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provider สถานะล็อกอิน — ครอบ layout หลัก
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    isOpen: isProfileOpen,
    open: openProfile,
    close: closeProfile,
  } = useOverlayLayer("profile");

  const refreshSession = useCallback(async () => {
    const sessionUser = await fetchSession();
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const sessionUser = await fetchSession();
        if (active) setUser(sessionUser);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const register = useCallback(async (body: RegisterRequestBody) => {
    const result = await registerUser(body);
    if (result.ok && result.user) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error ?? "สมัครไม่สำเร็จ" };
  }, []);

  const login = useCallback(async (body: LoginRequestBody) => {
    const result = await loginUser(body);
    if (result.ok && result.user) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error ?? "เข้าสู่ระบบไม่สำเร็จ" };
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    closeProfile();
  }, [closeProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isProfileOpen,
      openProfile,
      closeProfile,
      register,
      login,
      logout,
      refreshSession,
    }),
    [user, isLoading, isProfileOpen, openProfile, closeProfile, register, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * อ่านสถานะ auth — ต้องอยู่ภายใต้ AuthProvider
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth ต้องใช้ภายใน AuthProvider");
  }
  return ctx;
}

interface AuthGateProps {
  children: React.ReactNode;
  /** แสดงเมื่อยังไม่ล็อกอิน */
  fallback?: React.ReactNode;
}

/**
 * แสดง children เฉพาะเมื่อล็อกอินแล้ว — ใช้ซ่อนข้อมูลที่ต้องมีบัญชี
 */
export function AuthGate({ children, fallback = null }: AuthGateProps) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
}
