"use client";

import React from "react";
import { ProfileSlideOverCard } from "../auth/ProfileSlideOverCard";
import { useAuth } from "../auth/AuthProvider";

/**
 * เปิด ProfileSlideOverCard — ต้องอยู่ใต้ AuthProvider
 */
function ProfileSlideOverHost() {
  const { isProfileOpen, closeProfile } = useAuth();
  return <ProfileSlideOverCard isOpen={isProfileOpen} onClose={closeProfile} />;
}

/**
 * Provider สำหรับ UI ที่ผูกกับธุรกรรม/โปรไฟล์ (popover) — ครอบใน AppProviders
 */
export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProfileSlideOverHost />
    </>
  );
}
