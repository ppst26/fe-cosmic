import type { MetadataRoute } from "next";

/**
 * Web App Manifest — ให้มือถือติดตั้ง Cosmicbet เป็นแอป (Add to Home Screen)
 * ไอคอนอยู่ที่ public/pwa · ใช้คู่กับ service worker ใน app/sw.ts
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cosmicbet",
    short_name: "Cosmicbet",
    description: "Cosmicbet — อาณาจักรแห่งความมันส์",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#121116",
    theme_color: "#141416",
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
