/**
 * Mock แท็บและข้อความว่าง — NotificationCenterPanel
 */

export type NotificationTabId = "all" | "privileges" | "messages";

export const NOTIFICATION_TABS: { id: NotificationTabId; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "privileges", label: "สิทธิพิเศษ" },
  { id: "messages", label: "ข้อความ" },
];

export const NOTIFICATION_EMPTY_MESSAGE = "ไม่มีข้อความใหม่";
