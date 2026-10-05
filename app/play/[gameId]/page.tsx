"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { MockGameViewport } from "@/app/components/game/MockGameViewport";

/**
 * หน้า mock เล่นเกม — Header + แถบย้อนกลับ · ไม่มี footer / bottom nav (เต็มจอ)
 */
export default function GamePlayMockPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const gameId = decodeURIComponent((params?.gameId as string) || "unknown");
  const title = searchParams.get("title")?.trim() || gameId;
  const provider = searchParams.get("provider")?.trim() || undefined;

  const headerTitle = useMemo(() => {
    if (title.length > 28) return `${title.slice(0, 26)}…`;
    return title;
  }, [title]);

  return (
    <div className="mobile-standalone-page game-play-page flex h-dvh max-h-dvh flex-col overflow-hidden">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader
        title={headerTitle}
        backHref="/"
        onBackClick={() => router.back()}
      />

      <main className="mobile-standalone-main game-play-page__main min-h-0 flex-1">
        <MockGameViewport gameId={gameId} title={title} provider={provider} />
      </main>
    </div>
  );
}
