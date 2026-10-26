import { LotteryMarketsLayout } from "@/app/components/lottery/LotteryMarketsLayout";

/** /lottery/* — หน้ารายการรอบทุกตลาดใช้ shell เดียวกันที่คงอยู่ข้ามการเปลี่ยนตลาด */
export default function LotteryLayout({ children }: { children: React.ReactNode }) {
  return <LotteryMarketsLayout>{children}</LotteryMarketsLayout>;
}
