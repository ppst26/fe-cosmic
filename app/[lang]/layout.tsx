import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { AppProviders } from "@/app/providers";
import { CosmicFooterGate } from "@/app/components/layout/CosmicFooterGate";
import { LOCALES, hasLocale } from "@/lib/i18n/config";
import { localeFontClass } from "@/lib/i18n/fonts";
import { MessagesBoundary } from "@/lib/i18n/MessagesBoundary";
import { NAMESPACES } from "@/lib/i18n/messages";
import { getT } from "@/lib/i18n/server";
import "@/app/globals.css";

/** ฟอนต์หลักไทย/ลatin — โหลด self-host ผ่าน next/font จาก Google Fonts */
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500"],
  display: "optional", // ลด CLS — ไม่ swap font หลัง paint (จาก 'swap')
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((code) => ({ lang: code }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("meta");
  return {
    applicationName: "Cosmicbet",
    title: t("title"),
    description: t("description"),
    appleWebApp: {
      capable: true,
      title: "Cosmicbet",
      statusBarStyle: "black-translucent",
    },
    icons: {
      apple: "/pwa/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#141416",
};

/**
 * RootLayout ต่อภาษา — กำหนด lang, ฟอนต์ตามภาษา, Dark Theme และ dictionary ชุดพื้นฐานของ shell
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${notoSansThai.variable} ${geistMono.variable} ${localeFontClass(locale)} dark cosmic-page cosmic-bg h-full antialiased`}
    >
      <body className="flex min-h-dvh min-w-0 flex-col text-[var(--text-primary)]">
        {/* ส่งทุก namespace — hub modal เปิดได้ทุกโดเมนจากทุกหน้า · ตัดต่อ segment ภายหลังถ้าขนาดเป็นปัญหา */}
        <MessagesBoundary namespaces={NAMESPACES}>
          <AppProviders>
            <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
              <CosmicFooterGate />
            </div>
          </AppProviders>
        </MessagesBoundary>
      </body>
    </html>
  );
}
