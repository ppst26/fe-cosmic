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

/** Fullscreen API ที่เบราว์เซอร์นี้ใช้ได้ (รวมแบบ webkit) — iPhone Safari ไม่มีให้ element ทั่วไป → null */
type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

function nativeFullscreenElement(): Element | null {
  const doc = document as FullscreenCapableDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

/**
 * พื้นที่ mock เกมกลางจอ — แนว iframe สำหรับ prototype (หน้า /play/[gameId])
 * ปุ่มเต็มจอ: ใช้ Fullscreen API ก่อน · ถ้าไม่รองรับหรือเข้าไม่สำเร็จ (iPhone Safari / บาง webview)
 * → โหมดเต็มจอแบบ CSS (.is-pseudo-fullscreen: fixed คลุมทั้ง viewport รวม header) · ออกด้วยปุ่มเดิมหรือ Esc
 */
export function MockGameViewport({
  gameId,
  title,
  provider,
  className,
}: MockGameViewportProps) {
  const t = useT("games");
  const rootRef = useRef<HTMLElement>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const isFullscreen = isNativeFullscreen || isPseudoFullscreen;

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsNativeFullscreen(nativeFullscreenElement() === rootRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  /** โหมดเต็มจอแบบ CSS: ล็อกการเลื่อนของหน้า + ออกด้วย Esc */
  useEffect(() => {
    if (!isPseudoFullscreen) return;
    const root = document.documentElement;
    root.classList.add("is-game-fullscreen");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPseudoFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.classList.remove("is-game-fullscreen");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPseudoFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    const el = rootRef.current as FullscreenCapableElement | null;
    if (!el) return;

    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      return;
    }
    if (nativeFullscreenElement() === el) {
      const doc = document as FullscreenCapableDocument;
      try {
        await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
      } catch {
        /* ปล่อยให้ผู้ใช้ออกด้วยท่าทางของเบราว์เซอร์ */
      }
      return;
    }

    const request = el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el);
    if (request) {
      try {
        await request();
        // บาง webview ตอบรับแต่ไม่ได้เข้าโหมดจริง → ใช้แบบ CSS แทน
        if (nativeFullscreenElement() === el) return;
      } catch {
        /* ถูกปฏิเสธ — ใช้แบบ CSS */
      }
    }
    setIsPseudoFullscreen(true);
  }, [isPseudoFullscreen]);

  return (
    <section
      ref={rootRef}
      className={cn("mock-game-viewport", isPseudoFullscreen && "is-pseudo-fullscreen", className)}
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
