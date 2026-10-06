"use client";

import { useEffect } from "react";
import { ErrorState } from "@/app/components/ui/StatusState";
import "./globals.css";

/**
 * Error boundary สุดท้าย — root layout พัง (เช่น provider throw) แทนที่ทั้งเอกสาร
 * ไม่มี layout / font ของแอป จึงต้องมี <html> <body> และ CSS เอง · พื้นทึบ ไม่ใช้ gradient ของแอป
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // TODO(monitoring): ส่งไป error reporting service เมื่อเลือกเครื่องมือแล้ว
    console.error(error);
  }, [error]);

  return (
    <html lang="th" className="dark">
      <body className="status-page-solid flex min-h-dvh items-center justify-center px-4 antialiased">
        <title>เกิดข้อผิดพลาด — Cosmicbet</title>
        <ErrorState
          variant="card"
          title="ระบบขัดข้องชั่วคราว"
          description="ขออภัย เว็บไซต์โหลดไม่สำเร็จ ลองใหม่อีกครั้งในอีกสักครู่"
          primaryAction={{ label: "ลองใหม่", onClick: retry }}
          code={error.digest}
        />
      </body>
    </html>
  );
}
