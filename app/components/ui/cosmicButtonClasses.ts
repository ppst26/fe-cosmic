/**

 * class ปุ่มหลัก Cosmicbet — อ้างอิง design.md § ปุ่มหลัก และ globals.css

 */



/** ชั้น 1 — outline glass: View All, carousel arrows */

export const COSMIC_BTN_GLASS_PILL = "glass-control glass-pill";

/** outline glass ขนาดเล็ก — สถานะรอง / inactive (เช็คอิน รับแล้ว·ล็อค) */
export const COSMIC_BTN_GLASS_PILL_SM =
  "glass-control glass-pill !min-h-0 !py-1.5 !px-2.5 !text-xs";



/** ชั้น 1 — outline glass: ปุ่มวงกลมเลื่อน carousel */

export const COSMIC_BTN_GLASS_ICON = "glass-control glass-icon-btn";



/** ชั้น 2 — white solid: ลิงก์ไปหน้าอื่น / external */

export const COSMIC_BTN_NAV = "cosmic-btn-nav";



/** ชั้น 3 — main action (gradient neon) — สมัคร, ส่งฟอร์ม, ค้นหา, รับโบนัส */

export const COSMIC_BTN_PRIMARY = "btn-primary";

/** วงไอคอนซ้ายในปุ่ม main action */

export const COSMIC_BTN_PRIMARY_ICON = "btn-primary__icon";



/** ชั้น 3 — ยืนยันใน bottom sheet (pill glow) */

export const COSMIC_SHEET_SUBMIT = "btn-confirm-glow btn-confirm-glow--centered";

/** วงไอคอน + ข้อความในปุ่ม sheet glow */

export const COSMIC_BTN_CONFIRM_ICON = "btn-confirm-glow__icon";

export const COSMIC_BTN_CONFIRM_TEXT = "btn-confirm-glow__text";

export const COSMIC_BTN_CONFIRM_COMPACT =
  "btn-confirm-glow btn-confirm-glow--compact btn-confirm-glow--centered";

export const COSMIC_BTN_CONFIRM_INLINE = "btn-confirm-glow btn-confirm-glow--inline";



/** panel ข้อมูลใน bottom sheet — พื้น solid inner (--sheet-row-fill ใน .cosmic-mobile-sheet) */

export const COSMIC_SHEET_SOFT_GLASS = "cosmic-sheet-soft-glass";



/** การ์ด glass หน้าโปรไฟล์ / standalone mobile */

export const COSMIC_PANEL_GLASS = "glass-card--soft rounded-[var(--radius-panel)]";



/** แท็บ 2 ช่อง — track glass · active white solid */

export const COSMIC_SEGMENT_GLASS_WHITE =
  "cosmic-segment-track cosmic-segment-track--glass-white";



/** วงไอคอนในแถวเมนู / รายการ — ขนาด 40px */

export const COSMIC_PANEL_GLASS_ICON =
  "glass-control glass-icon-btn !h-10 !w-10 shrink-0 text-[var(--icon-default)]";



/** ปุ่มออกจากระบบ — กึ่งกลาง ไม่มีพื้น / การ์ด */

export const COSMIC_BTN_LOGOUT =
  "cosmic-btn-logout mx-auto flex h-auto w-fit items-center justify-center gap-2 py-3 text-sm font-medium text-[var(--destructive)] transition-opacity duration-[var(--motion-fast)] hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] [&_svg]:shrink-0 [&_svg]:text-[var(--destructive)]";



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


