import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { AppProviders } from "./providers";
import { CosmicFooterGate } from "./components/layout/CosmicFooterGate";
import "./globals.css";

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

export const metadata: Metadata = {
  applicationName: "Cosmicbet",
  title: "Cosmicbet — อาณาจักรแห่งความมันส์",
  description: "Cosmicbet Front-end Gaming Lobby",
  appleWebApp: {
    capable: true,
    title: "Cosmicbet",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/pwa/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#141416",
};

/**
 * RootLayout หลักของระบบ กำหนดโครงร่าง Dark Theme และฟอนต์มาตรฐาน
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${geistMono.variable} dark cosmic-page cosmic-bg h-full antialiased`}
    >
      <body className="flex min-h-dvh min-w-0 flex-col text-[var(--text-primary)]">
        <AppProviders>
          <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
            <CosmicFooterGate />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
