import React from "react";

interface WelcomeBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

/**
 * WelcomeBanner ส่วน Hero Banner โปรโมชันต้อนรับ
 * มีตัวละครตกแต่งซ้าย-ขวา (Zeus, Dealer, Raccoon / Soldier, Footballer, Gummy Bear)
 * และข้อความต้อนรับ Welcome Pack พร้อมปุ่ม Sign Up
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function WelcomeBanner({
  title = "Welcome Pack",
  subtitle = "Rakeback Up to 100%",
  ctaText = "Sign Up",
  onCtaClick,
}: WelcomeBannerProps) {
  return (
    <section
      className="relative my-2 w-full min-w-0 overflow-hidden rounded-[var(--radius-panel)] py-6 sm:py-8"
      aria-label="โปรโมชันต้อนรับ Welcome Pack"
    >
      {/* Cosmic background glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none rounded-[var(--radius-panel)] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, #1e1b4b 0%, #0d0c22 65%, #090b18 100%)",
        }}
      />
      {/* Top cosmic spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />

      {/* Decorative characters - ซ้าย (Zeus, Dealer, Raccoon) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-0 flex w-[26%] max-w-[92px] select-none flex-col justify-between py-1 opacity-70 sm:max-w-[150px] sm:w-1/3 sm:opacity-85"
        aria-hidden="true"
      >
        <svg viewBox="0 0 160 220" className="w-full h-full object-contain">
          <defs>
            <radialGradient id="zeus-glow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="45" r="40" fill="url(#zeus-glow)" />

          {/* Zeus (มงกุฎลอเรล + หนวดเคราขาว + สายฟ้า) */}
          <g transform="translate(10, 10)">
            {/* กายวิภาคซุส */}
            <circle cx="45" cy="35" r="18" fill="#fed7aa" />
            {/* ผมและเคราสีขาว */}
            <path d="M30 30 Q45 15 60 30 Q65 55 45 60 Q25 55 30 30 Z" fill="#f8fafc" />
            {/* มงกุฎทอง */}
            <path d="M32 25 L45 18 L58 25" stroke="#facc15" strokeWidth="3" fill="none" />
            {/* ลำตัวและสายรัดสีทอง */}
            <path d="M28 50 L62 50 L68 85 L22 85 Z" fill="#e0e7ff" />
            <path d="M28 50 L68 85" stroke="#eab308" strokeWidth="4" />
            {/* สายฟ้าสีฟ้า */}
            <polygon points="65,20 58,40 68,40 55,75 75,35 65,35" fill="#38bdf8" />
          </g>

          {/* ดีลเลอร์สาวถือไพ่ */}
          <g transform="translate(5, 95)">
            <circle cx="40" cy="30" r="14" fill="#fbcfe8" />
            {/* ผมยาวสีน้ำตาลทอง */}
            <path d="M24 24 Q40 10 56 24 Q58 60 40 55 Q22 60 24 24 Z" fill="#78350f" />
            {/* ชุดราตรีสีทองวิบวับ */}
            <path d="M28 44 Q40 50 52 44 L56 90 L24 90 Z" fill="#d97706" />
            {/* ไพ่ในมือ */}
            <rect x="52" y="42" width="10" height="15" rx="1.5" fill="#ffffff" transform="rotate(15 52 42)" />
            <rect x="58" y="45" width="10" height="15" rx="1.5" fill="#ef4444" transform="rotate(30 58 45)" />
          </g>

          {/* แรคคูนการ์ตูน */}
          <g transform="translate(60, 140)">
            <circle cx="25" cy="25" r="16" fill="#64748b" />
            {/* ลายหน้ากากดำรอบตา */}
            <ellipse cx="25" cy="24" rx="14" ry="7" fill="#1e293b" />
            <circle cx="20" cy="24" r="3" fill="#ffffff" />
            <circle cx="30" cy="24" r="3" fill="#ffffff" />
            <circle cx="20" cy="24" r="1.5" fill="#000000" />
            <circle cx="30" cy="24" r="1.5" fill="#000000" />
            <polygon points="23,28 27,28 25,31" fill="#000000" />
          </g>
        </svg>
      </div>

      {/* Decorative characters - ขวา (Soldier, Footballer, Gummy Bear) */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 flex w-[26%] max-w-[92px] select-none flex-col justify-between py-1 opacity-70 sm:max-w-[150px] sm:w-1/3 sm:opacity-85"
        aria-hidden="true"
      >
        <svg viewBox="0 0 160 220" className="w-full h-full object-contain">
          <defs>
            <radialGradient id="soldier-glow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="110" cy="45" r="40" fill="url(#soldier-glow)" />

          {/* ทหารติดอาวุธ (Soldier) */}
          <g transform="translate(80, 10)">
            {/* หมวกทหารและแว่นยุทธวิธี */}
            <ellipse cx="40" cy="30" rx="16" ry="12" fill="#334155" />
            <circle cx="40" cy="35" r="13" fill="#fdba74" />
            <rect x="28" y="32" width="24" height="6" rx="2" fill="#0f172a" />
            {/* เสื้อเกราะยุทธวิธี */}
            <path d="M24 46 L56 46 L60 85 L20 85 Z" fill="#1e293b" />
            {/* ปืนยาว */}
            <rect x="5" y="48" width="55" height="5" rx="1.5" fill="#020617" transform="rotate(-15 5 48)" />
          </g>

          {/* นักฟุตบอลชุดแดง */}
          <g transform="translate(60, 105)">
            <circle cx="40" cy="25" r="13" fill="#fcd34d" />
            {/* ผมสั้น */}
            <path d="M28 20 Q40 10 52 20 Z" fill="#451a03" />
            {/* เสื้อแข่งสีแดง */}
            <path d="M26 38 L54 38 L58 75 L22 75 Z" fill="#dc2626" />
            <polygon points="38,42 42,42 40,50" fill="#facc15" />
            {/* กำปั้นดีใจ */}
            <circle cx="20" cy="42" r="5" fill="#fcd34d" />
          </g>

          {/* น้องหมีกัมมี่สีชมพูโบกมือ */}
          <g transform="translate(100, 125)">
            {/* หูหมี */}
            <circle cx="18" cy="18" r="6" fill="#f43f5e" />
            <circle cx="42" cy="18" r="6" fill="#f43f5e" />
            {/* หัวและตัวหมี */}
            <circle cx="30" cy="30" r="16" fill="#fb7185" />
            <ellipse cx="30" cy="55" rx="15" ry="18" fill="#f43f5e" />
            {/* ตาและปากหมี */}
            <circle cx="25" cy="28" r="2" fill="#881337" />
            <circle cx="35" cy="28" r="2" fill="#881337" />
            <ellipse cx="30" cy="34" rx="3" ry="2" fill="#ffe4e6" />
            {/* แขนโบก */}
            <ellipse cx="48" cy="35" rx="6" ry="10" fill="#fb7185" transform="rotate(35 48 35)" />
          </g>
        </svg>
      </div>

      {/* เนื้อหาใจกลาง Hero (Welcome Pack & CTA) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-sm mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 drop-shadow-md">
          {title}
        </h1>
        <p className="text-sm sm:text-base font-medium text-[var(--text-secondary)] mb-5 drop-shadow">
          {subtitle}
        </p>

        {/* ปุ่ม CTA Sign Up ขนาดใหญ่ */}
        <button
          type="button"
          onClick={onCtaClick}
          className="cursor-pointer rounded-[var(--radius-control)] px-8 py-2.5 text-sm font-extrabold tracking-wide text-white shadow-[0_4px_20px_rgba(9,104,248,0.5)] transition-all duration-150 hover:brightness-110 active:scale-95 sm:px-10 sm:py-3 sm:text-base"
          style={{ background: "var(--action-gradient)" }}
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
}
