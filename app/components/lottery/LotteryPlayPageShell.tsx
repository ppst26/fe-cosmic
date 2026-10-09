"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";

interface LotteryPlayPageShellProps {
  title: string;
  backHref: string;
  mainClassName?: string;
  children: (props: {
    onStepChange: (step: "pick" | "price") => void;
  }) => React.ReactNode;
}

/**
 * กรอบหน้าแทง (step 3) — bottom nav บนมือถือตอนเลือกเลข · ซ่อนเมื่อเข้าขั้นใส่ราคา
 * ขั้นเลือกเลข (pick) บนมือถือซ่อน footer — เลื่อนหน้าลงไปเจอ footer ไม่ได้ ขนาด UI คงเดิม
 * (class is-viewport-locked บน <html> — ดู lottery.css) · ใช้ใน lottery .../[roundId]/page.tsx ทุกประเภท
 */
export function LotteryPlayPageShell({
  title,
  backHref,
  mainClassName,
  children,
}: LotteryPlayPageShellProps) {
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const onStepChange = useCallback((step: "pick" | "price") => {
    setHideBottomNav(step === "price");
  }, []);

  /** ล็อกเมื่อยังอยู่ขั้นเลือกเลข (hideBottomNav = false) — ปลดเมื่อเข้าขั้นราคาหรือออกจากหน้า */
  useEffect(() => {
    if (hideBottomNav) return;
    const root = document.documentElement;
    root.classList.add("is-viewport-locked");
    return () => root.classList.remove("is-viewport-locked");
  }, [hideBottomNav]);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title, backHref }}
      hideBottomNav={hideBottomNav}
      mainClassName={mainClassName}
    >
      {children({ onStepChange })}
    </LobbyDesktopPageShell>
  );
}
