import { withLocale } from "@/lib/i18n/routing";
import { getLocale, getT } from "@/lib/i18n/server";

/**
 * หน้าสำรองเมื่อเปิดแอปที่ติดตั้งแล้วแต่ไม่มีเน็ต
 * ถูกอ้างจาก fallback ของ service worker ใน app/sw.ts (precache ทุกภาษา)
 */
export default async function OfflinePage() {
  const locale = await getLocale();
  const t = await getT("errors");
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-medium text-[var(--text-primary)]">{t("offline.title")}</h1>
      <p className="max-w-xs text-sm text-[var(--text-secondary)]">
        {t("offline.description")}
      </p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- ตั้งใจโหลดใหม่ทั้งหน้า ไม่ใช้ client navigation ตอนออฟไลน์ */}
      <a
        href={withLocale("/", locale)}
        className="mt-2 inline-flex min-h-11 items-center rounded-full bg-[var(--action-solid)] px-5 text-sm font-medium text-white"
      >
        {t("backHome")}
      </a>
    </main>
  );
}
