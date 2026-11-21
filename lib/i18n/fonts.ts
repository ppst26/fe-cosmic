import { Noto_Sans, Noto_Sans_Khmer, Noto_Sans_Myanmar, Noto_Sans_SC } from "next/font/google";
import localFont from "next/font/local";
import type { Locale } from "./config";

/**
 * ฟอนต์เสริมตามภาษา — ทุกตัวใช้ตัวแปร --font-locale แต่ใส่ class ของภาษาปัจจุบันตัวเดียว
 * preload: false เพื่อไม่ให้หน้าไทยดึงฟอนต์ CJK/พม่า · display: swap เพราะเครื่องอาจไม่มีฟอนต์ระบบของอักษรเหล่านี้
 * th / en / id / fil ใช้ Noto Sans Thai (latin) ที่โหลดอยู่แล้ว
 */
/**
 * ลาว: ใช้ไฟล์ใน repo แทน next/font/google — Turbopack บน Vercel resolve ไฟล์ Noto Sans Lao จาก Google ไม่ได้
 * ("next/font/google queries have exactly one entry") แม้ build ในเครื่องจะผ่าน
 * ไฟล์คือ subset ลาวของ Noto Sans Lao v33 (variable 400–500) · ตัวละตินตกไปใช้ Noto Sans Thai ตาม --font-sans
 */
const lao = localFont({
  src: "./font-files/noto-sans-lao-lao.woff2",
  variable: "--font-locale",
  weight: "400 500",
  style: "normal",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0E81-0EDF, U+200C-200D, U+25CC" }],
});

const myanmar = Noto_Sans_Myanmar({
  variable: "--font-locale",
  subsets: ["myanmar", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const khmer = Noto_Sans_Khmer({
  variable: "--font-locale",
  subsets: ["khmer", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const chinese = Noto_Sans_SC({
  variable: "--font-locale",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const vietnamese = Noto_Sans({
  variable: "--font-locale",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const LOCALE_FONT_CLASS: Partial<Record<Locale, string>> = {
  lo: lao.variable,
  my: myanmar.variable,
  km: khmer.variable,
  zh: chinese.variable,
  vi: vietnamese.variable,
};

export function localeFontClass(locale: Locale): string {
  return LOCALE_FONT_CLASS[locale] ?? "";
}
