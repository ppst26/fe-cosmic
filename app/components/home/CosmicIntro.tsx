import React from "react";
import { IntroStats } from "../../types/lobby";
import { GoldStarIcon, SaturnIcon } from "../ui/Icons";

interface CosmicIntroProps {
  stats: IntroStats;
  title?: string;
}

/**
 * CosmicIntro — ดาวสี่แฉกซ้าย ดาวเสาร์ขวา และข้อความ "อาณาจักรแห่งความมันส์"
 * Cosmic background (nebula + ดาวเล็ก) ใช้เฉพาะส่วนนี้ตาม design.md หมวด 6
 * ตัวเลขใน stats ต้องมาจากข้อมูลจริง — ค่า mock เป็นตัวอย่างจัดวาง
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function CosmicIntro({
  stats,
  title = "อาณาจักรแห่งความมันส์",
}: CosmicIntroProps) {
  const numberFormatter = new Intl.NumberFormat("en-US");

  return (
    <section
      className="cosmic-intro-bg relative my-4 w-full min-w-0 overflow-hidden rounded-[var(--radius-panel)] px-2 py-5 sm:my-6 sm:px-6 sm:py-8"
      aria-labelledby="cosmic-intro-title"
    >
      {/* ดาวเล็กประดับพื้นหลัง (decorative) */}
      <div className="cosmic-intro-stars pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative flex min-w-0 items-center gap-1 sm:gap-6">
        {/* ดาวทองสี่แฉกด้านซ้าย (decorative) */}
        <div className="pointer-events-none shrink-0 select-none" aria-hidden="true">
          <GoldStarIcon className="h-12 w-12 sm:h-20 sm:w-20" />
        </div>

        {/* ข้อความแนะนำตรงกลาง — โทน cosmic title ตาม mockup */}
        <div className="min-w-0 flex-1 text-center">
          <h2
            id="cosmic-intro-title"
            className="text-balance text-[20px] font-extrabold leading-[1.2] tracking-tight text-[var(--text-primary)] drop-shadow-[0_0_24px_rgba(129,140,248,0.35)] sm:text-[32px] lg:text-[40px]"
          >
            {title}
          </h2>
          <p className="mt-1.5 text-[11px] leading-[1.45] text-[var(--text-secondary)] sm:mt-2 sm:text-base">
            เกมมากกว่า{" "}
            <strong className="font-bold text-[var(--text-primary)] tabular-nums">
              {numberFormatter.format(stats.gamesCount)}
            </strong>{" "}
            เกม ผู้ให้บริการมากกว่า{" "}
            <strong className="font-bold text-[var(--text-primary)] tabular-nums">
              {numberFormatter.format(stats.providersCount)}
            </strong>{" "}
            ราย การแข่งขันกีฬาทั่วโลก
          </p>
        </div>

        {/* ดาวเสาร์ด้านขวา (decorative) */}
        <div className="pointer-events-none shrink-0 select-none" aria-hidden="true">
          <SaturnIcon className="h-12 w-12 sm:h-20 sm:w-20" />
        </div>
      </div>
    </section>
  );
}
