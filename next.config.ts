import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

/**
 * host รูปจาก backend / CDN สำหรับ next/image
 * NEXT_PUBLIC_IMAGE_HOSTS = รายการ origin คั่นด้วย comma เช่น "https://cdn.cosmicbet.com,https://img.provider.io"
 * origin ของ NEXT_PUBLIC_API_BASE_URL ถูกเพิ่มให้อัตโนมัติ
 */
function imageRemotePatterns(): RemotePattern[] {
  const origins = [
    ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "").split(","),
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  ]
    .map((value) => value.trim())
    .filter(Boolean);

  const patterns = new Map<string, RemotePattern>();
  for (const origin of origins) {
    try {
      const url = new URL(origin);
      const protocol = url.protocol.replace(":", "") as "http" | "https";
      patterns.set(`${protocol}://${url.host}`, {
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/**",
      });
    } catch {
      throw new Error(`NEXT_PUBLIC_IMAGE_HOSTS / NEXT_PUBLIC_API_BASE_URL ไม่ใช่ URL ที่ถูกต้อง: "${origin}"`);
    }
  }
  return [...patterns.values()];
}

/**
 * security headers ทุกหน้า — กันฝัง iframe, กัน sniff ชนิดไฟล์, จำกัด referrer และสิทธิ์อุปกรณ์
 * CSP แบบเต็ม (script-src) ยังไม่ใส่ เพราะต้องใช้ nonce กับ inline script ของ Next — ทำตอนรู้โดเมน backend/CDN จริง
 */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: imageRemotePatterns(),
    /**
     * ความกว้างที่ srcset จะสร้าง — ตัดจาก default (640…3840 + 32…384) ให้เหลือเท่าที่ใช้จริง
     * หน้า lobby มีรูปเกิน 150 ใบ/หน้า srcset ยาวทุกใบทำให้ HTML บวมเกิน 1 ใน 3
     * เพดาน 1920 พอสำหรับจอ desktop ที่กว้างสุดใน design.md (--lobby-desktop-center-width)
     */
    deviceSizes: [360, 640, 828, 1080, 1920],
    imageSizes: [48, 96, 160, 256],
    /** รูปใน public/ เป็น avif/webp นิ่งแล้ว — ยืดอายุ cache จาก default 4 ชม. เป็น 31 วัน ไม่ต้อง re-encode ซ้ำ */
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
