"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../auth/AuthProvider";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** การ์ดโปรไฟล์โหลดแยก chunk ตอนเปิดครั้งแรก — ไม่ติดไป bundle แรกของทุกหน้า */
const ProfileSlideOverCard = dynamic(() =>
  import("../auth/ProfileSlideOverCard").then((m) => m.ProfileSlideOverCard),
);

/**
 * เปิด ProfileSlideOverCard — ต้องอยู่ใต้ AuthProvider
 */
function ProfileSlideOverHost() {
  const { isProfileOpen, closeProfile } = useAuth();
  const cardMounted = useLazyOverlayMount(isProfileOpen);
  if (!cardMounted) return null;
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
