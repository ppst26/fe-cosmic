import type { SiteBrand } from "@/lib/api/siteBrand";

/**
 * ข้อมูลแบรนด์ของเว็บ (mock) — ใช้เป็นทั้งค่าจาก fetchSiteBrand() ตอนยังไม่มี backend
 * และค่าสำรองเมื่อ API ล้มเหลว / ส่งค่าไม่ครบ (ดู lib/api/siteBrand.ts)
 */
export const SITE_BRAND_MOCK: SiteBrand = {
  title: "cosmicbet - รวมความสนุก ปลุกพลังโชค",
  faviconUrl: "/brand/favicon.png",
  appleTouchIconUrl: "/pwa/apple-touch-icon.png",
};
