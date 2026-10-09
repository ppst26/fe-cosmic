"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface MockGameViewportProps {
  gameId: string;
  title: string;
  provider?: string;
  className?: string;
}

/** ไอคอนเข้า/ออกโหมดเต็มจอ */
function FullscreenToggleIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M9 4H5v4M15 4h4v4M9 20H5v-4M15 20h4v-4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 9 5 5M15 9l4-4M9 15l-4 4M15 15l4 4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 4 4 9M15 4l5 5M9 20l-5-5M15 20l5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * พื้นที่ mock เกมกลางจอ — แนว iframe สำหรับ prototype (หน้า /play/[gameId])
 */
export function MockGameViewport({
  gameId,
  title,
  provider,
  className,
}: MockGameViewportProps) {
  const t = useT("games");
  const rootRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = rootRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      /* Fullscreen API ไม่พร้อมในบาง webview */
    }
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn("mock-game-viewport", className)}
      aria-label={t("play.playingAriaLabel", { title })}
    >
      <button
        type="button"
        className="mock-game-viewport__fullscreen"
        onClick={() => void toggleFullscreen()}
        aria-label={isFullscreen ? t("play.exitFullscreen") : t("play.fullscreen")}
        aria-pressed={isFullscreen}
      >
        <FullscreenToggleIcon active={isFullscreen} />
      </button>

      <div className="mock-game-viewport__frame">
        <p className="mock-game-viewport__badge">MOCK</p>
        <h2 className="mock-game-viewport__title">{title}</h2>
        {provider ? (
          <p className="mock-game-viewport__meta">{provider}</p>
        ) : null}
        <p className="mock-game-viewport__hint">
          {t("play.iframePlaceholder")}
        </p>
        <p className="mock-game-viewport__id">gameId: {gameId}</p>
      </div>
    </section>
  );
}
