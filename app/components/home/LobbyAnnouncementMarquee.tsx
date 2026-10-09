"use client";

import React from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface LobbyAnnouncementMarqueeProps {
  messages: readonly string[];
  className?: string;
  variant?: "default" | "mobile";
}

/**
 * แถบประกาศเลื่อน — มือถืออยู่ใต้ header (variant="mobile") · desktop อยู่ก่อน CategoryNav (variant="default")
 */
export function LobbyAnnouncementMarquee({
  messages,
  className,
  variant = "default",
}: LobbyAnnouncementMarqueeProps) {
  const t = useT("home");
  if (messages.length === 0) return null;

  const renderGroup = (groupKey: string, ariaHidden?: boolean) => (
    <ul
      className="lobby-announcement-marquee__group flex shrink-0 list-none items-center gap-8 p-0 m-0"
      aria-hidden={ariaHidden || undefined}
    >
      {messages.map((text, index) => (
        <li
          key={`${groupKey}-${index}`}
          className="lobby-announcement-marquee__item cosmic-type-marquee flex shrink-0 items-center gap-8 whitespace-nowrap"
        >
          <span>{text}</span>
          <span className="lobby-announcement-marquee__sep text-[var(--text-muted)]" aria-hidden="true">
            •
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className={cn(
        "lobby-announcement-marquee flex min-w-0 items-center gap-2.5",
        variant === "mobile"
          ? "lobby-announcement-marquee--mobile w-full min-w-0 gap-0"
          : "px-3 py-2 sm:gap-3 sm:px-3.5 sm:py-2.5",
        className,
      )}
      aria-label={t("announcement.ariaLabel")}
    >
      <div className="lobby-announcement-marquee__lead flex shrink-0 items-center gap-2">
        <span className="lobby-announcement-marquee__label cosmic-type-marquee-label shrink-0">
          {t("announcement.label")}
        </span>
        <MegaphoneGlyph className="lobby-announcement-marquee__icon h-4 w-4 shrink-0 text-[var(--icon-default)]" />
      </div>
      <div className="lobby-announcement-marquee__viewport min-w-0 flex-1 overflow-hidden">
        <div className="lobby-announcement-marquee__track flex">
          {renderGroup("a")}
          {renderGroup("b", true)}
        </div>
      </div>
    </section>
  );
}

/** ไอคอนโทรโล่ประกาศ — ใช้ใน LobbyAnnouncementMarquee เท่านั้น */
function MegaphoneGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10v4h3l5 4V6L7 10H4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a7.5 7.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
