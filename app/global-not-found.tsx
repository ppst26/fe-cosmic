import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { StatusState } from "@/app/components/ui/StatusState";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500"],
  display: "optional",
});

export const metadata: Metadata = {
  title: "ไม่พบหน้านี้ · Page not found — Cosmicbet",
};

/**
 * 404 ของ URL ที่ไม่ตรง route ใดเลย (เช่น /xx/yy) — root layout อยู่ใต้ [lang] จึงต้องมีไฟล์นี้
 * ไม่ผ่าน layout ของแอป: ต้องมี <html> ฟอนต์ และ CSS เอง · ไม่รู้ภาษา จึงแสดงไทย + อังกฤษ
 * ลิงก์ไป "/" ให้ proxy เลือกภาษาที่ถูกเอง
 */
export default function GlobalNotFound() {
  return (
    <html lang="th" className={`${notoSansThai.variable} dark`}>
      <body className="status-page-solid flex min-h-dvh items-center justify-center px-4 antialiased">
        <StatusState
          variant="card"
          icon={<span className="text-lg font-medium tabular-nums">404</span>}
          title="ไม่พบหน้าที่คุณต้องการ · Page not found"
          description="ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายไปแล้ว"
          primaryAction={{ label: "กลับหน้าแรก · Home", href: "/" }}
        />
      </body>
    </html>
  );
}
