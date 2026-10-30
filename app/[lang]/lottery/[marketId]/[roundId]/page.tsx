import { LotteryYikiPlayPage } from "@/app/components/lottery/LotteryYikiPlayPage";

/**
 * รอบสร้างตามเวลา — ไม่ prerender ตอน build แต่ render ครั้งแรกแล้วแคชเป็นหน้า static
 * (เดิมเป็น dynamic → <Link> ไม่ prefetch กดรอบแล้วต้องรอ server render ทุกครั้ง)
 */
export function generateStaticParams() {
  return [];
}

/** Step 3 — แทงหวยตลาดรายวัน (/lottery/[marketId]/[roundId]) */
export default function LotteryMarketPlayPage() {
  return <LotteryYikiPlayPage />;
}
