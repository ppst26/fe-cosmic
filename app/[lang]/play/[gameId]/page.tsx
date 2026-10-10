"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { MockGameViewport } from "@/app/components/game/MockGameViewport";

/**
 * หน้า mock เล่นเกม — Header หลักอย่างเดียว · ไม่มีแถบชื่อหน้า (page title) / footer / bottom nav · พื้นที่เกมเต็มจอ
 * ปุ่มเต็มจอในพื้นที่เกม (MockGameViewport) ใช้ Fullscreen API ก่อน · ไม่รองรับ (เช่น iPhone Safari) → โหมดเต็มจอแบบ CSS
 */
export default function GamePlayMockPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const gameId = decodeURIComponent((params?.gameId as string) || "unknown");
  const title = searchParams.get("title")?.trim() || gameId;
  const provider = searchParams.get("provider")?.trim() || undefined;

  return (
    <div className="mobile-standalone-page game-play-page flex h-dvh max-h-dvh flex-col overflow-hidden">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="mobile-standalone-main game-play-page__main min-h-0 flex-1">
        <MockGameViewport gameId={gameId} title={title} provider={provider} />
      </main>
    </div>
  );
}
