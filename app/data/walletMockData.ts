/** ยอดกระเป๋าหลัก mock — ใช้ใน Header notch จนกว่าจะมี API จริง */
export const MOCK_MAIN_WALLET_BALANCE = 12_450;

/** จัดรูปแบบยอด THB สำหรับแถบ Header (สัญลักษณ์ชิดตัวเลข) */
export function formatHeaderWalletBalance(amount: number): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `฿${formatted}`;
}
