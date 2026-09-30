import type { StoredUser } from "@/app/types/auth";

const DEMO_PHONE = "0999999999";

/**
 * บัญชีเดโมที่มากับโค้ด — ล็อกอินบน production ได้แม้ไม่มีไฟล์ .data/users.json
 * ใช้จาก findUserByPhone / findUserById ใน lib/auth/userStore.ts
 */
export const DEMO_USER: StoredUser = {
  id: "demo-user-0999999999",
  phone: DEMO_PHONE,
  firstName: "Demo",
  lastName: "Player",
  bankAccountNumber: "1234567890",
  bankId: "scb",
  channelId: "facebook",
  passwordHash:
    "73c43eb2b9122e30a7a50a39bcdf8a7a:83a4d0c3c940a32fb8c8a6b1784e73b2f7a4a981301696af8f9669b9880c9519a06c37155a69d1be4ea77586a1326abf1eb74faa7630bbebfdea8f4bc1815045",
  createdAt: "2026-10-01T00:00:00.000Z",
};

/**
 * คืนบัญชีเดโมเมื่อเบอร์ตรงชุดที่ฝังไว้
 */
export function findDemoUserByPhone(phone: string): StoredUser | undefined {
  const digits = phone.replace(/\D/g, "");
  if (digits !== DEMO_PHONE) return undefined;
  return DEMO_USER;
}

/**
 * คืนบัญชีเดโมเมื่อ session ชี้มาที่ id คงที่
 */
export function findDemoUserById(id: string): StoredUser | undefined {
  if (id !== DEMO_USER.id) return undefined;
  return DEMO_USER;
}
