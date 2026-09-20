import React from "react";
import type { ThaiLottoResult } from "@/app/types/lottery";

/**
 * ผลรางวัลงวดก่อน — รางวัลที่ 1 · 3 ตัวหน้า · 3 ตัวท้าย · 2 ตัวล่าง
 * ใช้ใน LotteryMarketRoundsView (หน้ารายการรอบ) ไม่แสดงในหน้าแทง/ใส่ราคา
 * ใช้ใน app/lottery/thai-government/page.tsx
 */
export function ThaiLottoResultPanel({ result }: { result: ThaiLottoResult }) {
  const subPrizes = [
    { id: "front3", label: "3 ตัวหน้า", values: result.front3 },
    { id: "back3", label: "3 ตัวท้าย", values: result.back3 },
    { id: "bottom2", label: "2 ตัวล่าง", values: [result.bottom2] },
  ];

  return (
    <section className="thai-lotto-panel" aria-labelledby="thai-lotto-result-title">
      <div className="thai-lotto-panel__head">
        <h2 id="thai-lotto-result-title" className="thai-lotto-panel__title">
          ผลรางวัลงวดก่อน
        </h2>
        <span className="thai-lotto-panel__meta">{result.drawLabel}</span>
      </div>

      <div className="thai-lotto-result__first">
        <span className="thai-lotto-result__label">รางวัลที่ 1</span>
        <span className="thai-lotto-result__first-value">{result.firstPrize}</span>
      </div>

      <dl className="thai-lotto-result__grid">
        {subPrizes.map((prize) => (
          <div key={prize.id} className="thai-lotto-result__cell">
            <dt className="thai-lotto-result__label">{prize.label}</dt>
            <dd className="thai-lotto-result__values">
              {prize.values.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
