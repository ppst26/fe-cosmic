import { cn } from "@/lib/utils";

interface MenuDrawerPromoBannerProps {
  className?: string;
}

/**
 * พื้นที่แบนเนอร์ mock บนเมนูเต็มจอมือถือ — รอ asset/ลิงก์โปรโมจริง
 * ใช้ใน RightMenuDrawer.tsx
 */
export function MenuDrawerPromoBanner({ className }: MenuDrawerPromoBannerProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[2.35/1] w-full items-center justify-center overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 bg-[var(--surface-elevated)]",
        className,
      )}
      role="img"
      aria-label="แบนเนอร์โปรโมชั่น"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_20%_0%,rgba(119,71,229,0.22),transparent_65%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(56,189,248,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <span className="relative z-[1] text-xs font-medium text-[var(--text-muted)]">
        แบนเนอร์โปรโมชั่น
      </span>
    </div>
  );
}
