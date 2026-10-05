"use client";

import React from "react";
import { Popover } from "radix-ui";
import { NotificationCenterPanel } from "./NotificationCenterPanel";
import { NotificationBellButton } from "./NotificationBellButton";

/**
 * กล่องแจ้งเตือน desktop — Popover ชิดปุ่มกระดิ่งใน Header
 */
export function NotificationDesktopPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <NotificationBellButton
          className="h-(--header-control-height)! w-(--header-control-height)!"
          ariaHaspopup="dialog"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="notification-popover"
          side="bottom"
          align="end"
          sideOffset={10}
          collisionPadding={12}
        >
          <NotificationCenterPanel variant="popover" />
          <Popover.Arrow className="notification-popover__arrow" width={14} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
