import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { cn } from "@/lib/utils";

interface Menu3DIconProps {
  iconId: string;
  className?: string;
  /** ขนาด intrinsic (แสดงจริงด้วย className) */
  size?: number;
  /** ไอคอนบนจอแรก — CategoryNav ดึงทันที ไม่รอ lazy */
  priority?: boolean;
}

/**
 * ไอคอน 3D จาก public/assets/3d/menuicon — ใช้ร่วม CategoryNav · MenuDrawer · sidebar
 * ใช้ img ตรง ไม่ผ่าน /_next/image (ไฟล์ avif พร้อมเสิร์ฟแล้ว)
 */
export function Menu3DIcon({
  iconId,
  className,
  size = 48,
  priority = false,
}: Menu3DIconProps) {
  const src = getMenuIconSrc(iconId);
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn(
        "pointer-events-none shrink-0 select-none object-contain",
        className,
      )}
      draggable={false}
    />
  );
}
