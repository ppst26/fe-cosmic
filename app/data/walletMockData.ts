/** ยอดกระเป๋าหลัก mock — ใช้ใน Header notch จนกว่าจะมี API จริง */
export const MOCK_MAIN_WALLET_BALANCE = 12_450;

/** จัดรูปแบบยอด THB สำหรับแถบ Header (สัญลักษณ์ชิดตัวเลข) — ไม่ใช้ toLocaleString เพื่อลด hydration mismatch */
export function formatHeaderWalletBalance(amount: number): string {
  const [whole, frac = "00"] = amount.toFixed(2).split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `฿${withCommas}.${frac}`;
}
