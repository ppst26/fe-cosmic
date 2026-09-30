"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchHomeBanners } from "@/lib/api/lobby";

interface HomeDesktopHeroRowProps {
  onCtaClick?: () => void;
}

/**
 * แถวแบนเนอร์คู่บน desktop — ใช้สไลด์ welcome + โปรโมจาก mock data
 * ถูกเรียกใช้ใน app/page.tsx (ซ่อนบนมือถือ)
 */
export function HomeDesktopHeroRow({ onCtaClick }: HomeDesktopHeroRowProps) {
  const { welcomeSlides, promoCarousel } = fetchHomeBanners();
  const primary = welcomeSlides[0];
  const secondary = promoCarousel[0] ?? welcomeSlides[1];

  if (!primary) {
    return null;
  }

  return (
    <section
      className="home-desktop-hero mb-3 hidden w-full min-w-0 lg:grid lg:grid-cols-2 lg:gap-3"
      aria-label="แบนเนอร์โปรโมชันหลัก"
    >
      <article className="home-desktop-hero__card relative min-h-[220px] overflow-hidden rounded-[var(--radius-panel)] xl:min-h-[260px]">
        <Image
          src={primary.bannerSrc}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 50vw, 40vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#090b18]/75 via-[#090b18]/25 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-center px-6 py-8 xl:min-h-[260px] xl:px-8">
          <h2 className="text-2xl font-medium tracking-tight text-white xl:text-3xl">
            {primary.title}
          </h2>
          <p className="mt-1 max-w-xs text-sm text-[var(--text-secondary)] xl:text-base">
            {primary.subtitle}
          </p>
          {primary.ctaText ? (
            <button
              type="button"
              onClick={onCtaClick}
              className="cosmic-action-btn mt-4 w-fit cursor-pointer px-6 py-2.5 text-sm"
            >
              ดูรายละเอียด
            </button>
          ) : null}
        </div>
      </article>

      {secondary ? (
        <Link
          href={secondary.href}
          className="home-desktop-hero__card group relative block min-h-[220px] overflow-hidden rounded-[var(--radius-panel)] xl:min-h-[260px]"
        >
          {secondary.bannerSrc ? (
            <Image
              src={secondary.bannerSrc}
              alt=""
              fill
              sizes="(min-width: 1280px) 50vw, 40vw"
              className="object-cover object-center transition duration-200 group-hover:brightness-110"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #161838 0%, #101128 100%)",
              }}
              aria-hidden="true"
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#090b18]/70 via-transparent to-transparent"
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-center px-6 py-8 xl:min-h-[260px] xl:px-8">
            <h2 className="text-xl font-medium tracking-tight text-white xl:text-2xl">
              {secondary.title}
            </h2>
            {secondary.subtitle ? (
              <p className="mt-1 max-w-xs text-sm text-[var(--text-secondary)]">
                {secondary.subtitle}
              </p>
            ) : null}
            <span className="cosmic-action-btn mt-4 inline-flex w-fit px-6 py-2.5 text-sm">
              ดูรายละเอียด
            </span>
          </div>
        </Link>
      ) : null}
    </section>
  );
}
