"use client";

import { LoadingState } from "@/app/components/ui/StatusState";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * สถานะรอระหว่างเปลี่ยนหน้า (Suspense ของทุก route) — แสดงทันทีขณะโหลด segment ถัดไป
 */
export default function Loading() {
  const t = useT("common");
  return (
    <main className="flex min-h-[60dvh] w-full items-center justify-center px-(--page-gutter)">
      <LoadingState label={t("loading")} />
    </main>
  );
}
