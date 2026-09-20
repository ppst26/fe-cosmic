"use client";

import React, { useCallback, useState } from "react";
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
 * ใช้ใน lottery .../[roundId]/page.tsx ทุกประเภท
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
