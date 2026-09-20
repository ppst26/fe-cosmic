import Link from "next/link";
import { ChevronLeftIcon } from "../ui/Icons";
import { COSMIC_BTN_GLASS_ICON } from "../ui/cosmicButtonClasses";

/**
 * แถบหัวหน้าโปรไฟล์ — ปุ่มย้อน + ชื่อหน้า
 * ถูกเรียกใช้ใน app/profile/page.tsx
 */
export function ProfilePageHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 -mx-[var(--page-gutter)] bg-[color-mix(in_srgb,var(--cosmic-page-base)_88%,transparent)] px-[var(--page-gutter)] pb-3 pt-2 backdrop-blur-md">
      <div className="mx-auto flex max-w-[var(--content-max)] items-center gap-3">
        <Link
          href="/"
          className={`${COSMIC_BTN_GLASS_ICON} !h-10 !w-10 text-[var(--icon-active)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]`}
          aria-label="กลับหน้าแรก"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-medium text-[var(--text-primary)]">{title}</h1>
      </div>
    </header>
  );
}
