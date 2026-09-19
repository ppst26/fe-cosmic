/**
 * โลโก้ค่ายสำหรับ marquee หน้าแรก — ไฟล์ใน public/provider logo
 * ถูกเรียกใช้โดย ProviderLogoMarquee.tsx / ProvidersSection.tsx
 */

const PROVIDER_LOGO_DIR = "/provider%20logo";

export interface HomeProviderLogoItem {
  id: string;
  name: string;
  logoSrc: string;
  href: string;
}

function providerLogo(file: string): string {
  return `${PROVIDER_LOGO_DIR}/${file}`;
}

/** รายการโลโก้เลื่อนแนวนอน — ลำดับตามไฟล์ในโฟลเดอร์ */
export const HOME_PROVIDER_LOGO_MARQUEE: HomeProviderLogoItem[] = [
  { id: "pp", name: "Pragmatic Play", logoSrc: providerLogo("pp.webp"), href: "/slots" },
  { id: "pg-soft", name: "PG Soft", logoSrc: providerLogo("logo-horizontal-dark-smm-pg-soft.webp"), href: "/slots" },
  { id: "jili", name: "JILI", logoSrc: providerLogo("logo-horizontal-dark-wt-jili.webp"), href: "/slots" },
  { id: "cq9", name: "CQ9", logoSrc: providerLogo("logo-horizontal-dark-wt-cq9.webp"), href: "/slots" },
  { id: "habanero", name: "Habanero", logoSrc: providerLogo("logo-horizontal-dark-wt-habanero.webp"), href: "/slots" },
  { id: "evo-play", name: "Evo Play", logoSrc: providerLogo("logo-horizontal-dark-wt-evo-play.webp"), href: "/slots" },
  { id: "red-tiger", name: "Red Tiger", logoSrc: providerLogo("logo-horizontal-dark-wt-red-tiger.webp"), href: "/slots" },
  { id: "netent", name: "NetEnt", logoSrc: providerLogo("logo-horizontal-dark-wt-netent-slot.webp"), href: "/slots" },
  { id: "endorphina", name: "Endorphina", logoSrc: providerLogo("logo-horizontal-dark-wtm-endorphina.webp"), href: "/slots" },
  { id: "joker", name: "Joker", logoSrc: providerLogo("logo-horizontal-dark-wt-joker.webp"), href: "/slots" },
  { id: "fa-chai", name: "Fa Chai", logoSrc: providerLogo("logo-horizontal-dark-wt-fa-chai.webp"), href: "/slots" },
  { id: "rich88", name: "Rich88", logoSrc: providerLogo("logo-horizontal-dark-wt-rich88.webp"), href: "/slots" },
  { id: "kalamba", name: "Kalamba", logoSrc: providerLogo("logo-horizontal-dark-wt-kalamba.webp"), href: "/slots" },
  { id: "only-play", name: "Only Play", logoSrc: providerLogo("logo-horizontal-dark-wt-only-play.webp"), href: "/slots" },
  { id: "advant-play", name: "Advant Play", logoSrc: providerLogo("logo-horizontal-dark-wt-advant-play.webp"), href: "/slots" },
  { id: "dragoon-soft", name: "Dragoon Soft", logoSrc: providerLogo("logo-horizontal-dark-wt-dragoon-soft.webp"), href: "/slots" },
  { id: "wm-slot", name: "WM Slot", logoSrc: providerLogo("logo-horizontal-dark-wt-wm-slot.webp"), href: "/slots" },
  { id: "goldy", name: "Goldy", logoSrc: providerLogo("logo-horizontal-dark-wt-goldy.webp"), href: "/slots" },
  { id: "ps", name: "PlayStar", logoSrc: providerLogo("logo-horizontal-dark-wt-ps.webp"), href: "/slots" },
  { id: "sp", name: "Spadegaming", logoSrc: providerLogo("logo-horizontal-dark-sp.webp"), href: "/slots" },
  { id: "yggdrasil", name: "Yggdrasil", logoSrc: providerLogo("logo-horizontal-dark-sm-ygr.webp"), href: "/slots" },
  { id: "hot-dog", name: "Hot Dog", logoSrc: providerLogo("logo-horizontal-dark-sm-hot-dog.webp"), href: "/slots" },
  { id: "kingmaker", name: "Kingmaker", logoSrc: providerLogo("logo-horizontal-dark-sm-kingmaker.webp"), href: "/slots" },
  { id: "bt-gaming", name: "BT Gaming", logoSrc: providerLogo("logo-horizontal-dark-sm-bt-gaming.webp"), href: "/slots" },
];
