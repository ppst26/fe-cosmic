import type { Metadata } from "next";
import { StatusState } from "@/app/components/ui/StatusState";
import { StatusPageShell } from "@/app/components/ui/StatusPageShell";

export const metadata: Metadata = {
  title: "ไม่พบหน้านี้ — Cosmicbet",
};

/**
 * 404 — URL ไม่ตรง route ใด ๆ หรือหน้าเรียก notFound()
 */
export default function NotFound() {
  return (
    <StatusPageShell>
      <StatusState
        variant="card"
        icon={<span className="text-lg font-medium tabular-nums">404</span>}
        title="ไม่พบหน้าที่คุณต้องการ"
        description="ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายไปแล้ว"
        primaryAction={{ label: "กลับหน้าแรก", href: "/" }}
        secondaryAction={{ label: "ดูโปรโมชัน", href: "/promotions" }}
      />
    </StatusPageShell>
  );
}
