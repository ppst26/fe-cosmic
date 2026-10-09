"use client";

import React from "react";
import { IntroStats } from "../../types/lobby";
import { useT } from "@/lib/i18n/I18nProvider";

interface CosmicIntroProps {
  stats: IntroStats;
  title?: string;
}

/**
 * CosmicIntro — ข้อความ "อาณาจักรแห่งความมันส์" (พื้นหลังตาม .cosmic-bg บน <html>)
 * ตัวเลขใน stats ต้องมาจากข้อมูลจริง — ค่า mock เป็นตัวอย่างจัดวาง
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function CosmicIntro({
  stats,
  title: titleProp,
}: CosmicIntroProps) {
  const t = useT("home");
  const title = titleProp ?? t("intro.title");
  const numberFormatter = new Intl.NumberFormat("en-US");

  return (
    <section
      className="relative w-full min-w-0 py-4 sm:py-6"
      aria-labelledby="cosmic-intro-title"
    >
      <div className="min-w-0 text-center">
        <h2
          id="cosmic-intro-title"
          className="text-balance text-[20px] font-medium leading-[1.2] tracking-tight text-[var(--text-primary)] drop-shadow-[0_0_24px_rgba(129,140,248,0.35)] sm:text-[32px] lg:text-[40px]"
        >
          {title}
        </h2>
        <p className="cosmic-intro__stats mt-1.5 sm:mt-2">
          {t("intro.gamesBefore")} <strong>{numberFormatter.format(stats.gamesCount)}</strong>{" "}
          {t("intro.gamesAfter")} {t("intro.providersBefore")}{" "}
          <strong>{numberFormatter.format(stats.providersCount)}</strong> {t("intro.providersAfter")}{" "}
          {t("intro.sports")}
        </p>
      </div>
    </section>
  );
}
