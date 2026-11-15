"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/** shadcn/ui Popover (Radix) — พื้นทึบ ขอบบาง ไม่มีเงา · ชนขอบจอแล้วเลื่อนกลับเข้ามาเอง (collisionPadding) */
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
/** จุดอ้างอิงตำแหน่ง — ครอบทั้งแถบที่ต้องการให้ popover ยึดความกว้าง/ตำแหน่ง */
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 8, collisionPadding = 12, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "z-[400] max-w-[calc(100vw-1.5rem)] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-solid-inner)] p-3 text-[var(--text-primary)] outline-none",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverAnchor, PopoverTrigger, PopoverContent };
