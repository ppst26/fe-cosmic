/**
 * แสดงเบอร์แบบ mask — 08• ••• 4567
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return phone;
  return `${digits.slice(0, 2)}• ••• ${digits.slice(-4)}`;
}

/**
 * รหัสสมาชิกแบบ CBxxxxxx จาก uuid
 */
export function formatMemberId(userId: string): string {
  const hex = userId.replace(/-/g, "").slice(0, 8);
  const num = Number.parseInt(hex, 16) % 1_000_000;
  return `CB${String(num).padStart(6, "0")}`;
}

/**
 * ชื่อแสดงบนโปรไฟล์ — จากชื่อ + suffix สั้น
 */
export function formatDisplayName(firstName: string, userId: string): string {
  const base = firstName.trim().toLowerCase().replace(/\s+/g, "_") || "cosmic";
  const suffix = userId.replace(/-/g, "").slice(0, 4);
  return `${base}_${suffix}`;
}

/**
 * วันที่สมัครภาษาไทย
 */
export function formatJoinedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * เลขบัญชีแบบ mask
 */
export function maskBankAccount(account: string): string {
  const digits = account.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  return `•••• ${digits.slice(-4)}`;
}
