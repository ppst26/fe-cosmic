/**
 * จำนวนคนออนไลน์ที่แสดงบนการ์ด most-online — สุ่มจาก id ค่ายให้คงที่ต่อการ์ด (ไม่กระพริบทุก render)
 * ใช้ใน MostOnlineProviderCard.tsx · ค่า base จาก API/mock เป็นแกน ± variance
 */

const DISPLAY_MIN = 1_200;
const DISPLAY_MAX = 48_000;

/** hash สตริงเป็นจำนวนเต็มไม่ติดลบ */
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * คืนจำนวนออนไลน์สำหรับแสดง — ถ้ามี onlineCount จาก API จะ jitter รอบค่านั้น ไม่มีจะสุ่มในช่วงมาตรฐาน
 */
export function getMostOnlineDisplayCount(item: { id: string; onlineCount: number }): number {
  const hash = hashString(item.id);
  const variance = 0.78 + (hash % 45) / 100;
  const bump = (hash % 97) * 17;

  let value: number;
  if (item.onlineCount > 0) {
    value = Math.round(item.onlineCount * variance + bump);
  } else {
    const span = DISPLAY_MAX - DISPLAY_MIN;
    value = DISPLAY_MIN + (hash % span);
  }

  return Math.min(DISPLAY_MAX, Math.max(DISPLAY_MIN, value));
}
