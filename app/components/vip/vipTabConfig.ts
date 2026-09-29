import type { VipModalTabId } from "@/app/types/vip";

/** แท็บหลักหน้า VIP — ใช้ร่วม VipTabList · VipPageContent */
export const VIP_PAGE_TABS: { id: VipModalTabId; label: string }[] = [
  { id: "my-level", label: "ระดับของฉัน" },
  { id: "rank", label: "แร็งค์" },
  { id: "benefits", label: "สิทธิประโยชน์" },
];
