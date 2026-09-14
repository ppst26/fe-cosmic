import React from "react";
import { ProviderItem } from "../../types/lobby";
import { Carousel } from "../ui/Carousel";
import { ProviderCard } from "../ui/ProviderCard";
import { SectionIcon } from "../ui/SectionIcon";

interface ProvidersSectionProps {
  providers: ProviderItem[];
}

/**
 * ProvidersSection — แถวโลโก้ค่ายเกม พร้อม View All + arrows
 * เว้นด้านบน 48–56px มากกว่า section ปกติ เพื่อแยกจากชุดเกม (design.md หมวด 4)
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function ProvidersSection({ providers }: ProvidersSectionProps) {
  return (
    <Carousel
      title="Providers"
      icon={<SectionIcon id="network" className="h-6 w-6 text-[var(--icon-default)]" />}
      viewAllHref="/providers"
      trackClassName="carousel-providers"
      className="mt-12 sm:mt-14"
      isEmpty={providers.length === 0}
      emptyMessage="ยังไม่มีผู้ให้บริการ"
    >
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </Carousel>
  );
}
