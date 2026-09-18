"use client";

import React from "react";
import { LUCKY_WHEEL_BENEFITS, LUCKY_WHEEL_TAGLINE, type WheelBenefitCard } from "@/app/data/luckyWheelMockData";

interface LuckyWheelIntroColumnProps {
  embedded?: boolean;
}

/**
 * คอลัมน์ซ้ายหน้าวงล้อ — หัวข้อ การ์ดสิทธิประโยชน์ และคำโปรย
 * ใช้ใน LuckyWheelPageContent
 */
export function LuckyWheelIntroColumn({ embedded = false }: LuckyWheelIntroColumnProps) {
  return (
    <div className="lucky-wheel-intro flex min-h-0 flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
      {!embedded ? (
        <header className="lucky-wheel-intro__hero">
          <span className="lucky-wheel-intro__crown" aria-hidden="true">
            <CrownIcon className="h-7 w-7" />
          </span>
          <h1 className="lucky-wheel-intro__title">หมุนวันนี้ ลุ้นรางวัลใหญ่</h1>
          <p className="lucky-wheel-intro__lead">
            รางวัลพิเศษรอคุณอยู่ทุกช่อง — ใช้เพชรหรือตั๋วหมุนได้ทันที ไม่ต้องรอโปร
          </p>
        </header>
      ) : (
        <header className="lucky-wheel-intro__hero lucky-wheel-intro__hero--compact">
          <h2 className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg">หมุนลุ้นรางวัล</h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">เลือกวิธีหมุนและจำนวนครั้งด้านขวา</p>
        </header>
      )}

      <ul className="lucky-wheel-benefits" aria-label="สิทธิประโยชน์">
        {LUCKY_WHEEL_BENEFITS.map((card) => (
          <li key={card.id}>
            <BenefitCard card={card} />
          </li>
        ))}
      </ul>

      <p className="lucky-wheel-intro__tagline">{LUCKY_WHEEL_TAGLINE}</p>
    </div>
  );
}

function BenefitCard({ card }: { card: WheelBenefitCard }) {
  return (
    <article className="lucky-wheel-benefit cosmic-inset-card">
      <span className="lucky-wheel-benefit__icon" aria-hidden="true">
        <BenefitIcon iconId={card.iconId} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="lucky-wheel-benefit__title">{card.title}</h3>
        <p className="lucky-wheel-benefit__subtitle">{card.subtitle}</p>
      </div>
    </article>
  );
}

function BenefitIcon({ iconId }: { iconId: WheelBenefitCard["iconId"] }) {
  switch (iconId) {
    case "prize":
      return <GemOutlineIcon className="h-5 w-5" />;
    case "check-in":
      return <TicketIcon className="h-5 w-5" />;
    case "fair":
      return <SparkIcon className="h-5 w-5" />;
    case "vip":
      return <CrownIcon className="h-5 w-5" />;
    default:
      return null;
  }
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 18h16v2H4v-2ZM6 8l3 4 3-6 3 6 3-4 2 8H4l2-8Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function GemOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 4 19 10 15 20 9 20 5 10Z" strokeLinejoin="round" />
    </svg>
  );
}

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path
        d="M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" strokeLinecap="round" />
    </svg>
  );
}
