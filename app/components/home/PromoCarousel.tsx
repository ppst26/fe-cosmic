"use client";

import React, { useId, useState, useRef } from "react";
import Link from "next/link";
import { PromoItem } from "../../types/lobby";

interface PromoCarouselProps {
  items: PromoItem[];
}

/**
 * PromoCarousel แบนเนอร์โปรโมชันแบบเลื่อนแนวนอน
 * มีการ์ด Loyalty v2.0, Play with Gift Cards และจุดแสดงหน้า 5 dots
 * กฎ design.md: ใช้ dots เท่านั้น ห้ามเพิ่มลูกศร arrow หรือปุ่ม View All
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function PromoCarousel({ items }: PromoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loyaltyArtId = useId();

  /**
   * ความกว้างหนึ่งสไลด์ (การ์ด + gap) ให้ตรงกับ CSS บนมือถือ
   */
  const getSlideStride = () => {
    const container = scrollContainerRef.current;
    if (!container?.firstElementChild) return 0;
    const first = container.firstElementChild as HTMLElement;
    const gap = 8;
    return first.offsetWidth + gap;
  };

  /**
   * เลื่อนการ์ดไปยัง index ที่เลือกเมื่อคลิกจุด pagination
   */
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (scrollContainerRef.current) {
      const stride = getSlideStride();
      if (stride <= 0) return;
      scrollContainerRef.current.scrollTo({
        left: index * stride,
        behavior: "smooth",
      });
    }
  };

  /**
   * อัปเดต activeIndex ตามตำแหน่งที่ผู้ใช้สไลด์จริง
   */
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const stride = getSlideStride();
      if (stride <= 0) return;
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / stride);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <section
      className="relative my-3 w-full min-w-0 overflow-hidden"
      aria-label="แบนเนอร์โปรโมชันและสิทธิพิเศษ"
    >
      {/* เลื่อนในกรอบ page-shell — ไม่ดันทั้ง viewport แนวนอน */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
        tabIndex={0}
        aria-label="รายการโปรโมชัน"
      >
        {items.map((item) => {
          const isLoyalty = item.id === "promo-loyalty-v2";
          const shieldGradId = `${loyaltyArtId}-shield-gold`;
          const goldGlowId = `${loyaltyArtId}-gold-glow`;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative w-[85%] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[var(--radius-panel)] p-4 transition-all duration-150 hover:brightness-110 sm:w-[78%] sm:p-5"
              style={{
                background: isLoyalty
                  ? "linear-gradient(135deg, #10163a 0%, #0d1a45 40%, #151336 100%)"
                  : "linear-gradient(135deg, #161838 0%, #101128 100%)",
              }}
            >
              {/* แสงนีออนฟ้าอมเขียวด้านล่างซ้ายสำหรับการ์ด Loyalty */}
              {isLoyalty && (
                <div className="absolute -bottom-8 -left-8 w-44 h-24 bg-cyan-500/25 blur-2xl rounded-full pointer-events-none" />
              )}
              {/* แสงสีม่วงมุมขวาบน */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-600/20 blur-2xl rounded-full pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between min-h-[100px]">
                {/* ข้อมูลข้อความด้านซ้าย */}
                <div className="flex-1 pr-3">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1 tracking-tight group-hover:text-blue-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* อาร์ตเวิร์กด้านขวา */}
                <div className="w-28 sm:w-32 h-24 shrink-0 relative flex items-center justify-center">
                  {isLoyalty ? (
                    // สมุดโล่ทองคำ v2 และธนบัตรลอย
                    <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id={shieldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fffbeb" />
                          <stop offset="30%" stopColor="#fde047" />
                          <stop offset="70%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#78350f" />
                        </linearGradient>
                        <filter id={goldGlowId}>
                          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.5" />
                        </filter>
                      </defs>

                      {/* ธนบัตรลอยรอบ ๆ */}
                      <g fill="#d1fae5" stroke="#059669" strokeWidth="0.8">
                        <rect x="5" y="10" width="22" height="12" rx="1" transform="rotate(-25 5 10)" />
                        <rect x="15" y="65" width="20" height="11" rx="1" transform="rotate(15 15 65)" />
                        <rect x="85" y="12" width="22" height="12" rx="1" transform="rotate(30 85 12)" />
                        <rect x="95" y="55" width="20" height="11" rx="1" transform="rotate(-15 95 55)" />
                      </g>

                      {/* โล่/สมุดทองคำหลัก */}
                      <path
                        d="M35 22 Q60 12 85 22 Q88 55 60 88 Q32 55 35 22 Z"
                        fill={`url(#${shieldGradId})`}
                        filter={`url(#${goldGlowId})`}
                        stroke="#fef08a"
                        strokeWidth="1.5"
                      />
                      {/* ขอบด้านในโล่ */}
                      <path
                        d="M40 27 Q60 18 80 27 Q82 52 60 80 Q38 52 40 27 Z"
                        fill="#fffbeb"
                        opacity="0.9"
                      />

                      {/* ตัวอักษร v2 เด่นชัด */}
                      <text
                        x="60"
                        y="58"
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="24"
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        v2
                      </text>
                    </svg>
                  ) : (
                    // Gift Card / Generic Card
                    <div className="flex h-14 w-20 rotate-6 items-center justify-center rounded-[var(--radius-control)] bg-gradient-to-tr from-purple-700 to-indigo-500 text-xs font-bold text-white shadow-lg">
                      GIFT
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination Dots 5 จุดตามแบบเป๊ะ */}
      <div className="flex items-center justify-center gap-1.5 mt-3" aria-hidden="true">
        {items.slice(0, 5).map((_, idx) => {
          const isDotActive = idx === activeIndex;
          return (
            <button
              key={`dot-${idx}`}
              type="button"
              onClick={() => handleDotClick(idx)}
              className={`transition-all duration-200 rounded-full ${
                isDotActive
                  ? "w-7 h-2 bg-[#0968f8] shadow-[0_0_8px_rgba(9,104,248,0.6)]"
                  : "w-2 h-2 bg-[#2d294e] hover:bg-[#433e70]"
              }`}
              aria-label={`ไปยังสไลด์ที่ ${idx + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
