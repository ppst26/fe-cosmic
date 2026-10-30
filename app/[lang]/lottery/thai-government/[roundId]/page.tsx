import { ThaiGovernmentPlayPage } from "@/app/components/lottery/thai/ThaiGovernmentPlayPage";

/**
 * รอบสร้างตามเวลา — ไม่ prerender ตอน build แต่ render ครั้งแรกแล้วแคชเป็นหน้า static
 * (เดิมเป็น dynamic → <Link> ไม่ prefetch กดรอบแล้วต้องรอ server render ทุกครั้ง)
 */
export function generateStaticParams() {
  return [];
}

/** Step 3 — แทงหวยรัฐบาลไทยตามรอบที่เลือก */
export default function ThaiGovernmentLotteryPlayPage() {
  return <ThaiGovernmentPlayPage />;
}
