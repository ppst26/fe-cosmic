import React from "react";
import { IntroStats } from "../../types/lobby";

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
  title = "อาณาจักรแห่งความมันส์",
}: CosmicIntroProps) {
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
          เกมมากกว่า <strong>{numberFormatter.format(stats.gamesCount)}</strong> เกม
          ผู้ให้บริการมากกว่า <strong>{numberFormatter.format(stats.providersCount)}</strong> ราย
          การแข่งขันกีฬาทั่วโลก
        </p>
      </div>
    </section>
  );
}
