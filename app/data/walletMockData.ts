/** ยอดกระเป๋าหลัก mock — ใช้ใน Header notch จนกว่าจะมี API จริง */
export const MOCK_MAIN_WALLET_BALANCE = 12_450;

/** ไอคอนกระเป๋าใน Header / เมนู */
export const HEADER_WALLET_ICON_SRC = "/assets/deposit/Wallet2.avif";

/** จัดรูปแบบยอดกระเป๋า — ไม่มีสัญลักษณ์เงิน · ไม่มีทศนิยม (comma คั่นหลัก) */
export function formatHeaderWalletBalance(amount: number): string {
  const whole = Math.round(amount);
  return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
