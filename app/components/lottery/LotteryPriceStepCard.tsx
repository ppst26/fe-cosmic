"use client";

import React from "react";

interface LotteryPriceStepCardProps {
  /** รายการโพย — เลื่อนภายในการ์ด */
  children: React.ReactNode;
  /** แถบใส่ราคา — sticky ล่างการ์ด */
  controls: React.ReactNode;
}

/**
 * การ์ดใส่ราคา+โพยชิ้นเดียว — ส่วนบน scroll · แถบควบคุม sticky ล่าง
 * ใช้ใน ThaiLottoBetBoard · YikiBetBoard ขั้น price
 */
export function LotteryPriceStepCard({ children, controls }: LotteryPriceStepCardProps) {
  return (
    <div className="thai-lotto-panel lottery-price-step-card">
      <div className="lottery-price-step-card__scroll">{children}</div>
      <div className="lottery-price-step-card__dock">{controls}</div>
    </div>
  );
}
