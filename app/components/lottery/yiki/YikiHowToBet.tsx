import React from "react";

const STEPS: { label: string; icon: React.ReactNode }[] = [
  { label: "เลือกประเภทการแทง", icon: <SelectIcon /> },
  { label: "คีย์เลขที่ต้องการ", icon: <KeyboardIcon /> },
  { label: "ใส่ราคา", icon: <PriceIcon /> },
  { label: "กดยืนยันส่งโพย", icon: <ConfirmIcon /> },
  { label: "เสร็จสิ้นรอลุ้น", icon: <CheckIcon /> },
];

/**
 * แถบ "วิธีการแทงหวย" 5 ขั้นตอน — เฉพาะจอใหญ่ (≥1024px) ตามดีไซน์อ้างอิง
 * ใช้ใน YikiBetBoard เฉพาะขั้นเลือกเลข (step "pick")
 */
export function YikiHowToBet() {
  return (
    <section className="yiki-howto p-5 text-center" aria-label="วิธีการแทงหวย">
      <h2 className="yiki-howto__title mb-4">วิธีการแทงหวย</h2>
      <ol className="yiki-howto__list grid grid-cols-5 gap-3 m-0 p-0 list-none">
        {STEPS.map((step, index) => (
          <li
            key={step.label}
            className="yiki-howto__item flex flex-col items-center gap-2"
          >
            <span
              className="yiki-howto__badge grid place-items-center w-5 h-5 rounded-full"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span
              className="yiki-howto__icon grid place-items-center w-11 h-11 rounded-[var(--radius-panel)]"
              aria-hidden="true"
            >
              {step.icon}
            </span>
            <span className="yiki-howto__label">{step.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SelectIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="m6 4 5 15 2.5-6.5L20 10 6 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 10h.01M11 10h.01M15 10h.01M17 10h.01M7 14h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M4 12V6a2 2 0 0 1 2-2h6l8 8-8 8-8-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="7.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

function ConfirmIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M5 11c1-3 3.5-5 7-5s6 2 7 5M6 14h12M9 18h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8.5 12.5 2.4 2.4L15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
