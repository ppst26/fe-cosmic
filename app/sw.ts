/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import { NetworkOnly, type PrecacheEntry, type SerwistGlobalConfig, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Service worker ของ PWA มือถือ
 * API และคำขอข้าม origin ไม่ถูก cache — กันยอดเงิน/เซสชันค้าง
 * ถูก build โดย app/serwist/[path]/route.ts
 */
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ sameOrigin, url: { pathname } }) => sameOrigin && pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ sameOrigin }) => !sameOrigin,
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
