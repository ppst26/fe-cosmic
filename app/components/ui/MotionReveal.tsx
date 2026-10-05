"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ลำดับ stagger (0–5 มีผล) */
  index?: number;
  style?: CSSProperties;
};

/** Fade-up ครั้งเดียวเมื่อเข้า viewport — ใช้คลาส .motion-reveal (motion.css) */
export default function MotionReveal({ children, as: Tag = "div", className = "", index = 0, style }: MotionRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`motion-reveal ${className}`.trim()}
      data-inview={inView}
      style={{ ...style, "--i": index } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
