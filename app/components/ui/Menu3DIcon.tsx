import Image from "next/image";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { cn } from "@/lib/utils";

interface Menu3DIconProps {
  iconId: string;
  className?: string;
  /** ขนาด intrinsic สำหรับ next/image (แสดงจริงด้วย className) */
  size?: number;
}

/**
 * ไอคอน 3D จาก public/assets/3d/menuicon — ใช้ร่วม CategoryNav · MenuDrawer · sidebar
 */
export function Menu3DIcon({
  iconId,
  className,
  size = 48,
}: Menu3DIconProps) {
  const src = getMenuIconSrc(iconId);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn(
        "pointer-events-none shrink-0 select-none object-contain",
        className,
      )}
      draggable={false}
    />
  );
}
