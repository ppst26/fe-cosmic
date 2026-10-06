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

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns(),
  },
};

export default nextConfig;
