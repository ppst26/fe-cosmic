"use client";

import React from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import Link from "@/lib/i18n/navigation";
import { HOME_PROVIDER_LOGO_MARQUEE } from "../../data/homeProviderLogosData";
import { SectionIcon } from "../ui/SectionIcon";
import { SectionHeader } from "../ui/SectionHeader";
import { ProviderLogoMarquee } from "./ProviderLogoMarquee";

/**
 * ProvidersSection — marquee โลโก้ค่าย (ไม่มี glass card) + View All
 * เว้นด้านบน 48–56px มากกว่า section ปกติ เพื่อแยกจากชุดเกม (design.md หมวด 4)
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function ProvidersSection() {
  const t = useT("home");
  const logos = HOME_PROVIDER_LOGO_MARQUEE;

  return (
    <section className="providers-section mt-12 w-full min-w-0 max-w-full sm:mt-14" aria-label="Providers">
      <SectionHeader
        icon={<SectionIcon id="network" className="h-6 w-6 text-[var(--icon-default)]" />}
        title="Providers"
        actionContent={
          <Link href="/providers" className="glass-control glass-pill">
            View All
          </Link>
        }
      />

      {logos.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--text-muted)]">{t("providers.empty")}</p>
      ) : (
        <ProviderLogoMarquee items={logos} />
      )}
    </section>
  );
}
