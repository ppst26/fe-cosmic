"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import { CosmicbetLogo } from "./Icons";

/**
 * โครงหน้าสถานะเต็มจอ (404 / error ระดับ route) — โลโก้กลับหน้าแรก + เนื้อหากลางจอ
 * ใช้ใน app/not-found.tsx · app/error.tsx
 */
export function StatusPageShell({ children }: { children: React.ReactNode }) {
  const t = useT("nav");
  return (
    <main className="flex min-h-[70dvh] w-full flex-col items-center justify-center gap-6 px-(--page-gutter) py-12">
      <Link href="/" aria-label={t("footer.home")} className="inline-flex">
        <CosmicbetLogo className="h-6 w-auto" />
      </Link>
      {children}
    </main>
  );
}
