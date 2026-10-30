"use client";

import React, { useEffect, useState } from "react";
import { CosmicbetLogo } from "@/app/components/ui/Icons";

/** เวลาจางออก — ต้องตรงกับ transition ของ .app-splash.is-leaving ใน app-splash.css */
const SPLASH_FADE_MS = 320;
/** หน้าพร้อมใช้ (hydrate) แล้วแต่รูปยังโหลดไม่ครบ — รอ load ไม่เกินเท่านี้ (เน็ตช้าไม่ต้องค้างที่โลโก้นาน) */
const SPLASH_MAX_WAIT_MS = 1200;

/**
 * หน้าจอโลโก้ตอนเปิดเว็บครั้งแรก — อยู่ใน HTML จาก server จึงขึ้นทันที แล้วจางออกเมื่อหน้าโหลดเสร็จ (window load)
 * หรือหลัง hydrate ไม่เกิน SPLASH_MAX_WAIT_MS
 * mount ครั้งเดียวใน app/[lang]/layout.tsx — เปลี่ยนหน้าฝั่ง client ไม่แสดงซ้ำ
 * JS ไม่ทำงาน → CSS animation ซ่อนเองหลังไม่กี่วินาที (ดู app-splash.css)
 */
export function AppSplash() {
  const [phase, setPhase] = useState<"shown" | "leaving" | "gone">("shown");

  useEffect(() => {
    let timer: number | undefined;
    let left = false;
    const leave = () => {
      if (left) return;
      left = true;
      window.clearTimeout(maxWait);
      setPhase("leaving");
      timer = window.setTimeout(() => setPhase("gone"), SPLASH_FADE_MS);
    };
    const maxWait = window.setTimeout(leave, SPLASH_MAX_WAIT_MS);
    if (document.readyState === "complete") {
      leave();
    } else {
      window.addEventListener("load", leave, { once: true });
    }
    return () => {
      window.removeEventListener("load", leave);
      window.clearTimeout(maxWait);
      window.clearTimeout(timer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={phase === "leaving" ? "app-splash is-leaving" : "app-splash"} aria-hidden>
      <CosmicbetLogo className="app-splash__logo" />
      <span className="app-splash__bar" />
    </div>
  );
}
