"use client";

import React from "react";
import { FeatureActionItem } from "../../types/lobby";
import { FeatureActionCard } from "../ui/FeatureActionCard";
import { useT } from "@/lib/i18n/I18nProvider";

interface FeatureActionCardsProps {
  items: FeatureActionItem[];
}

/**
 * FeatureActionCards — มือถือเรียงแนวตั้ง · desktop (lg+) 3 คอลัมน์ใต้ Hall of Fame
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function FeatureActionCards({ items }: FeatureActionCardsProps) {
  const t = useT("home");
  return (
    <section
      className="feature-action-cards mt-6 w-full min-w-0 space-y-3 sm:mt-8 lg:mt-8 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0"
      aria-label={t("featureActions.ariaLabel")}
    >
      {items.map((item) => (
        <FeatureActionCard key={item.id} item={item} />
      ))}
    </section>
  );
}
