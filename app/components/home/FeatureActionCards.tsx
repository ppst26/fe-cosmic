import React from "react";
import { FeatureActionItem } from "../../types/lobby";
import { FeatureActionCard } from "../ui/FeatureActionCard";

interface FeatureActionCardsProps {
  items: FeatureActionItem[];
}

/**
 * FeatureActionCards — สามการ์ดเรียงแนวตั้ง หลัง Providers
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function FeatureActionCards({ items }: FeatureActionCardsProps) {
  return (
    <section className="mt-10 w-full min-w-0 space-y-3 sm:mt-12" aria-label="ฟีเจอร์พิเศษ">
      {items.map((item) => (
        <FeatureActionCard key={item.id} item={item} />
      ))}
    </section>
  );
}
