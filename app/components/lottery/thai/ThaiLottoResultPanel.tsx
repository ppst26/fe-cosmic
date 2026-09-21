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
    <section
      className="thai-lotto-panel flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:p-5"
      aria-labelledby="thai-lotto-result-title"
    >
      <div className="thai-lotto-panel__head flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2
          id="thai-lotto-result-title"
          className="thai-lotto-panel__title inline-flex items-center gap-2 m-0 leading-[1.4]"
        >
          ผลรางวัลงวดก่อน
        </h2>
        <span className="thai-lotto-panel__meta">{result.drawLabel}</span>
      </div>

      <div className="thai-lotto-result__first flex flex-col items-center gap-1 p-3">
        <span className="thai-lotto-result__label">รางวัลที่ 1</span>
        <span className="thai-lotto-result__first-value">{result.firstPrize}</span>
      </div>

      <dl className="thai-lotto-result__grid grid grid-cols-3 gap-2 m-0">
        {subPrizes.map((prize) => (
          <div
            key={prize.id}
            className="thai-lotto-result__cell flex flex-col items-center gap-1 px-1 py-3"
          >
            <dt className="thai-lotto-result__label">{prize.label}</dt>
            <dd className="thai-lotto-result__values flex flex-wrap justify-center gap-x-2 gap-y-[0.15rem] m-0">
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
