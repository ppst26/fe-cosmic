import React from "react";

/** กราฟิกเหรียญรางวัลเช็คอิน — DailyCheckInPageContent · DailyCheckInDesktopLayout */
export function CheckInCoinGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="24" cy="40" rx="14" ry="4" fill="#000" opacity="0.35" />
      <circle cx="24" cy="22" r="14" fill="url(#checkInCoin)" stroke="#fde047" strokeWidth="1.5" />
      <path d="M24 14v16M18 22h12" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="checkInCoin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** กราฟิกปฏิทินเช็คอิน — แบนเนอร์ desktop */
export function DailyCheckInCalendarGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 96" className={className} aria-hidden="true">
      <circle cx="92" cy="18" r="6" fill="#6366f1" opacity="0.6" />
      <circle cx="8" cy="28" r="2" fill="#fff" opacity="0.5" />
      <rect x="28" y="20" width="56" height="52" rx="8" fill="#1e1b4b" stroke="var(--accent-muted)" strokeWidth="1.5" />
      <rect x="28" y="20" width="56" height="14" rx="8" fill="#4c1d95" />
      <path d="M40 14v8M72 14v8" stroke="var(--accent-highlight)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="56" cy="48" r="10" fill="#facc15" />
      <path d="M52 48 55 51 61 44" stroke="#422006" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function TreasureChestGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <rect x="12" y="36" width="56" height="32" rx="4" fill="#78350f" stroke="#facc15" strokeWidth="1.5" />
      <path d="M12 44h56" stroke="#facc15" strokeWidth="1" opacity="0.6" />
      <path d="M28 36V28a12 12 0 0 1 24 0v8" fill="#92400e" stroke="#fde047" strokeWidth="1.5" />
      <circle cx="28" cy="24" r="5" fill="#fde047" />
      <circle cx="52" cy="22" r="4" fill="#facc15" />
      <circle cx="40" cy="18" r="3" fill="#fde047" opacity="0.8" />
    </svg>
  );
}
