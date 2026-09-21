/**

 * class ปุ่มหลัก Cosmicbet — อ้างอิง design.md § ปุ่มหลัก และ globals.css

 */



/** ชั้น 1 — outline glass: View All, carousel arrows */

export const COSMIC_BTN_GLASS_PILL = "glass-control glass-pill";

/** outline glass ขนาดเล็ก — สถานะรอง / inactive (เช็คอิน รับแล้ว·ล็อค) */
export const COSMIC_BTN_GLASS_PILL_SM =
  "glass-control glass-pill !min-h-0 !py-1.5 !px-2.5 !text-[0.6875rem] sm:!text-xs";



/** ชั้น 1 — outline glass: ปุ่มวงกลมเลื่อน carousel */

export const COSMIC_BTN_GLASS_ICON = "glass-control glass-icon-btn";



/** ชั้น 2 — white solid: ลิงก์ไปหน้าอื่น / external */

export const COSMIC_BTN_NAV = "cosmic-btn-nav";



/** ชั้น 3 — gradient CTA: สมัคร, ส่งฟอร์ม, รับโบนัส */

export const COSMIC_BTN_PRIMARY = "cosmic-cta-primary";



/** ชั้น 3 — ยืนยันใน mobile bottom sheet (ฝาก/ถอน/คูปอง/login) */

export const COSMIC_SHEET_SUBMIT = "cosmic-sheet-submit";



/** panel ข้อมูลใน bottom sheet — soft glass */

export const COSMIC_SHEET_SOFT_GLASS = "cosmic-sheet-soft-glass";



/** การ์ด glass หน้าโปรไฟล์ / standalone mobile */

export const COSMIC_PANEL_GLASS = "glass-card--soft rounded-[var(--radius-panel)]";



/** แท็บ 2 ช่อง — track glass · active white solid */

export const COSMIC_SEGMENT_GLASS_WHITE =
  "cosmic-segment-track cosmic-segment-track--glass-white";



/** วงไอคอนในแถวเมนู / รายการ — ขนาด 40px */

export const COSMIC_PANEL_GLASS_ICON =
  "glass-control glass-icon-btn !h-10 !w-10 shrink-0 text-[var(--icon-default)]";



/** ปุ่มออกจากระบบ — glass outline โทน destructive */

export const COSMIC_BTN_LOGOUT =
  "glass-control flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-panel)] border border-[color-mix(in_srgb,var(--destructive)_55%,transparent)] text-sm font-medium text-[var(--destructive)] transition-[background,color,box-shadow] duration-[var(--motion-fast)] hover:bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";



/** panel กดได้ (บัญชี / ช่องทางฝาก) */

export const COSMIC_SHEET_SOFT_GLASS_INTERACTIVE =

  "cosmic-sheet-soft-glass cosmic-sheet-soft-glass--interactive transition-[background,transform] duration-[var(--motion-fast)]";



/** แถว input มาตรฐาน sheet — พื้น --sheet-field-* ใน modals.css */

export const COSMIC_SHEET_FIELD_ROW =

  "cosmic-sheet-field flex h-12 items-center gap-2.5 px-3";



/** ช่องกรอกยอดฝาก (มี addon ฿) */

export const COSMIC_SHEET_FIELD_AMOUNT =

  "cosmic-sheet-field cosmic-sheet-field--amount flex items-center gap-0 overflow-hidden";



/** chip เลือกยอด — มุม panel · ใน sheet ใช้โทน soft glass */

export const COSMIC_CHOICE_BTN = "cosmic-choice-btn";


