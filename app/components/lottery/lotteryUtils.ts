/**
 * คืนเลขกลับทุกแบบ (permutation ไม่ซ้ำ) เช่น "123" → 123,132,213,231,312,321
 * ใช้ตอนเปิด "กลับเลข" ใน ThaiLottoBetBoard / YikiBetBoard
 */
export function uniquePermutations(value: string): string[] {
  if (value.length <= 1) return [value];
  const result = new Set<string>();
  for (let i = 0; i < value.length; i += 1) {
    const rest = value.slice(0, i) + value.slice(i + 1);
    for (const tail of uniquePermutations(rest)) {
      result.add(value[i] + tail);
    }
  }
  return [...result];
}

/** แสดงเลขโพยแบบมีช่องว่างระหว่างหลัก — อ่านง่ายในแถบสรุป (เช่น 655 → 6 5 5) */
export function formatLotteryDigitsDisplay(value: string): string {
  return value.replace(/\s/g, "").split("").join(" ");
}

/** แปลงยอดเงินเป็นรูปแบบ 1,234.50 — ใช้ในโพยและสรุปยอด */
export function formatBaht(value: number): string {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** วันเวลาแบบสรุปโพย — เช่น 20 ก.ย. 2569 08:52 */
export function formatLotterySlipDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  });
}

export {
  BANGKOK_OFFSET_MS,
  dateFromBangkokWall,
  formatBangkokTimeHHmm,
  getBangkokWallParts,
} from "@/app/lib/bangkokTime";

/** แปลงมิลลิวินาทีคงเหลือเป็น "3 วัน 04:12:09" — ใช้ใน ThaiLottoDrawCard / YikiRoundCard */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "ปิดรับแทงแล้ว";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const hms = [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  return days > 0 ? `${days} วัน ${hms}` : hms;
}
