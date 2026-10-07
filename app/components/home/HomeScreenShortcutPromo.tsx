"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { BRAND_LOGO_SRC } from "@/app/components/ui/Icons";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

/** โลโก้กลมในวง glow — public/cmb-rounded.avif */
const HOME_A2HS_ROUND_LOGO_SRC = "/cmb-rounded.avif";

type InstallPlatform = "android" | "ios";

const INSTALL_STEP_LAUNCH =
  "กดเข้า หน้าเว็ปผ่านไอคอนแอพของเราได้ทันที";

const INSTALL_STEPS: Record<InstallPlatform, string[]> = {
  android: [
    "แตะเมนู ⋮ ที่มุมบนขวาของ Chrome",
    "เลือก「ติดตั้งแอป」หรือ「เพิ่มไปที่หน้าจอหลัก」",
    "กด「ติดตั้ง」หรือ「เพิ่ม」เพื่อยืนยัน",
    INSTALL_STEP_LAUNCH,
  ],
  ios: [
    "แตะปุ่ม「แชร์」ที่ด้านล่าง Safari",
    "เลือก「เพิ่มที่หน้าโฮม」",
    "กด「เพิ่ม」มุมขวาบนเพื่อยืนยัน",
    INSTALL_STEP_LAUNCH,
  ],
};

/** ไอคอน Android สำหรับปุ่มเลือกแพลตฟอร์ม */
function AndroidGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        d="M17.6 11.5c0-.9-.1-1.7-.4-2.5l1.4-1.1a.35.35 0 0 0-.1-.55l-1.3-2.3a.35.35 0 0 0-.5-.1l-1.6 1.2a7.2 7.2 0 0 0-4.2-1.2 7.2 7.2 0 0 0-4.2 1.2L5.6 4.9a.35.35 0 0 0-.5.1L3.8 7.3a.35.35 0 0 0-.1.55l1.4 1.1c-.3.8-.4 1.6-.4 2.5v1h12.9v-1Zm-8.1 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm6.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM6.2 13.5v5.1c0 .6.5 1.1 1.1 1.1h.9v2.1c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4v-2.1h2.6v2.1c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4v-2.1h.9c.6 0 1.1-.5 1.1-1.1v-5.1H6.2Z"
      />
    </svg>
  );
}

/** ไอคอน Apple สำหรับปุ่มเลือกแพลตฟอร์ม */
function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        d="M16.7 12.6c.02 2.2 1.93 2.94 1.95 2.95-.02.06-.31 1.05-1.02 2.08-.62.9-1.26 1.8-2.27 1.82-.99.02-1.31-.58-2.45-.58-1.14 0-1.5.56-2.44.6-1 .04-1.76-.92-2.39-1.82-1.3-1.88-2.3-5.3-.96-7.6.67-1.16 1.86-1.9 3.16-1.92 1-.02 1.94.67 2.45.67.5 0 1.62-.83 2.73-.71.46.02 1.76.19 2.59 1.43-.07.04-1.55.9-1.53 2.68ZM14.2 4.2c.55-.66.92-1.58.82-2.5-.79.03-1.74.53-2.31 1.18-.51.59-.96 1.54-.84 2.45.89.07 1.8-.45 2.33-1.13Z"
      />
    </svg>
  );
}

/** ไอคอน chevron สำหรับ accordion */
function AccordionChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "home-a2hs-accordion__chevron size-4 shrink-0 transition-transform duration-200",
        expanded && "rotate-180",
      )}
      aria-hidden="true"
    >
      <path d="M5 7.5 10 12.5 15 7.5" />
    </svg>
  );
}

/** ตรวจว่าเปิดจาก PWA / หน้าโฮมแล้วหรือยัง */
function useIsInstalledPwa() {
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const iosStandalone =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const sync = () => {
      setInstalled(standaloneMedia.matches || iosStandalone);
    };

    sync();
    standaloneMedia.addEventListener("change", sync);
    return () => standaloneMedia.removeEventListener("change", sync);
  }, []);

  return installed;
}

/**
 * การ์ดชวนเพิ่มปุ่มลัดหน้าโฮม — มือถือเท่านั้น (lg:hidden)
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx
 */
export function HomeScreenShortcutPromo({ className }: { className?: string }) {
  const isInstalled = useIsInstalledPwa();
  const [platform, setPlatform] = useState<InstallPlatform>("ios");
  const [stepsOpen, setStepsOpen] = useState(false);

  if (isInstalled) return null;

  const steps = INSTALL_STEPS[platform];
  const stepsPanelId = "home-a2hs-steps-panel";

  return (
    <section
      className={cn("home-a2hs-promo w-full min-w-0 lg:hidden", className)}
      aria-labelledby="home-a2hs-section-title"
    >
      <SectionHeader title="เพิ่มปุ่มลัดหน้าโฮม" titleId="home-a2hs-section-title" className="mb-2" />

      <div className="home-a2hs-card">
        <div className="home-a2hs-card__body">
          <div className="home-a2hs-card__lead">
            <div className="home-a2hs-card__chip">
              <Image
                src={BRAND_LOGO_SRC}
                alt=""
                width={44}
                height={44}
                className="home-a2hs-card__chip-img"
              />
            </div>
            <div className="min-w-0">
              <p className="home-a2hs-card__title">เพิ่มปุ่มลัดได้แล้ววันนี้!</p>
              <p className="home-a2hs-card__subtitle">
                สัมผัสประสบการณ์ที่เหนือกว่า เพิ่มปุ่มเลย
              </p>
            </div>
          </div>

          <div className="home-a2hs-card__platforms" role="group" aria-label="เลือกระบบปฏิบัติการ">
            <button
              type="button"
              className="home-a2hs-platform-btn"
              data-active={platform === "android"}
              aria-pressed={platform === "android"}
              onClick={() => setPlatform("android")}
            >
              <AndroidGlyph />
              Android
            </button>
            <button
              type="button"
              className="home-a2hs-platform-btn"
              data-active={platform === "ios"}
              aria-pressed={platform === "ios"}
              onClick={() => setPlatform("ios")}
            >
              <AppleGlyph />
              iOS
            </button>
          </div>
        </div>

        <div className="home-a2hs-card__hero" aria-hidden="true">
          <div className="home-a2hs-card__hero-aura" />
          <Image
            src={HOME_A2HS_ROUND_LOGO_SRC}
            alt=""
            width={136}
            height={136}
            className="home-a2hs-card__hero-img"
          />
        </div>
      </div>

      <div className="home-a2hs-accordion">
        <button
          type="button"
          className="home-a2hs-accordion__trigger"
          aria-expanded={stepsOpen}
          aria-controls={stepsPanelId}
          onClick={() => setStepsOpen((open) => !open)}
        >
          <span>วิธีเพิ่มปุ่มลัด ({platform === "ios" ? "iOS" : "Android"})</span>
          <AccordionChevron expanded={stepsOpen} />
        </button>
        <div
          id={stepsPanelId}
          className={cn("home-a2hs-accordion__panel", stepsOpen && "is-open")}
          hidden={!stepsOpen}
        >
          <ol className="home-a2hs-steps-list" aria-live="polite">
            {steps.map((step, index) => (
              <li key={`${platform}-${index}`} className="home-a2hs-steps-list__item">
                <span className="home-a2hs-steps-list__num" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="home-a2hs-steps-list__text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
