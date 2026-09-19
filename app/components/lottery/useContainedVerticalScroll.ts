"use client";

import { useEffect, type RefObject } from "react";

/**
 * ให้ scroll ล้อเมาส์อยู่ใน element นี้ ไม่ลาก scroll ทั้งหน้า (ใช้กับ lottery step 2)
 */
export function useContainedVerticalScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;

      const deltaY = event.deltaY;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const canScroll = scrollHeight > clientHeight + 1;
      if (!canScroll) return;

      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);
}
