import { cn } from "@/lib/utils";

type ResponsiveSheetVariant =
  | "default"
  | "auth"
  | "signup"
  | "wide"
  | "profile"
  | "hub"
  | "hubWide"
  | "hubCompact"
  | "hubNarrow";

/**
 * Overlay — มือถือ sheet · desktop modal (lg+)
 * ใช้กับ Deposit / Withdraw / Coupon / Login / SignUp / Transactions drawer
 */
export function responsiveSheetOverlayClass(zIndexClass = "z-[70]") {
  return cn(
    "cosmic-dialog-overlay fixed inset-0",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
    zIndexClass,
  );
}

/**
 * Dialog.Content — bottom sheet มือถือ · modal กลางจอ desktop
 */
export function responsiveSheetContentClass(
  extra?: string,
  options?: { variant?: ResponsiveSheetVariant },
) {
  const variant = options?.variant ?? "default";
  const lgWidth =
    variant === "hubWide"
      ? "lg:w-[min(94vw,1040px)]"
      : variant === "hub"
        ? "lg:w-[min(92vw,720px)]"
        : variant === "hubCompact"
          ? "lg:w-[min(94vw,640px)]"
          : variant === "hubNarrow"
            ? "lg:w-[min(92vw,480px)]"
            : variant === "wide"
            ? "lg:w-[min(92vw,520px)]"
            : variant === "signup"
              ? "lg:w-[min(92vw,480px)]"
              : variant === "profile"
                ? "lg:w-[min(92vw,360px)]"
                : "lg:w-[min(92vw,440px)]";

  const lgMaxHeight =
    variant === "hubWide"
      ? "lg:max-h-[min(92dvh,880px)]"
      : variant === "hub"
        ? "lg:max-h-[min(90dvh,800px)]"
        : "lg:max-h-[min(90dvh,680px)]";

  const isHubSheet =
    variant === "hub" ||
    variant === "hubWide" ||
    variant === "hubCompact" ||
    variant === "hubNarrow";
  const isProfileSheet = variant === "profile";
  const isSignupSheet = variant === "signup";

  const sheetSurfaceChrome = "rounded-t-[20px] border-0";

  return cn(
    "cosmic-mobile-sheet cosmic-modal-shell bottom-sheet relative fixed inset-x-0 bottom-0 z-[70] flex flex-col outline-none",
    sheetSurfaceChrome,
    isSignupSheet
      ? "p-0"
      : "px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:px-5",
    "text-[var(--text-primary)] shadow-[0_-16px_48px_rgba(0,0,0,0.55)]",
    "data-[state=closed]:animate-out data-[state=open]:animate-in duration-300",
    "max-lg:data-[state=closed]:slide-out-to-bottom max-lg:data-[state=open]:slide-in-from-bottom",
    "lg:inset-auto lg:left-1/2 lg:top-1/2 lg:bottom-auto lg:-translate-x-1/2 lg:-translate-y-1/2",
    lgWidth,
    lgMaxHeight,
    "lg:min-h-0 lg:overflow-hidden lg:rounded-[var(--radius-panel)] lg:border-0",
    isHubSheet && "max-lg:max-h-[min(92dvh,900px)] max-lg:overflow-hidden",
    "lg:shadow-[0_24px_56px_rgba(0,0,0,0.65),0_0_32px_rgba(119,112,183,0.12)]",
    "lg:data-[state=closed]:zoom-out-95 lg:data-[state=open]:zoom-in-95 lg:duration-200",
    extra,
  );
}

/** มือถือ — แถบลาก sheet · desktop ซ่อน */
export const RESPONSIVE_SHEET_HANDLE_CLASS =
  "responsive-sheet-handle mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-[var(--cosmic-mobile-sheet-handle)] lg:hidden";

/**
 * ปุ่มปิด sheet — ไม่ใช้ Tailwind ring (โฟกัสดูแลใน globals ภายใน .cosmic-mobile-sheet)
 */
export function responsiveSheetCloseButtonClass(extra?: string) {
  return cn(
    "glass-control glass-icon-btn !h-9 !w-9 shrink-0 text-[var(--icon-default)]",
    "outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none",
    extra,
  );
}

/** ปุ่มกลับสเต็ป — คู่กับ ResponsiveSheetHeader */
export function responsiveSheetBackButtonClass(extra?: string) {
  return cn(
    "glass-control glass-icon-btn !h-9 !w-9 shrink-0 text-[var(--icon-default)]",
    "outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none",
    extra,
  );
}

/** แถวหัว sheet — 3 คอลัมน์: กลับ | หัวข้อ | ปิด */
export function RESPONSIVE_SHEET_HEADER_ROW_CLASS(extra?: string) {
  return cn(
    "grid shrink-0 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-start gap-x-1 pb-2 pt-0.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_2.5rem]",
    extra,
  );
}

/** cosmic-sheet-shell + responsive modal desktop */
export function responsiveAuthSheetContentClass(
  extra?: string,
  options?: { variant?: "auth" | "signup" },
) {
  const variant = options?.variant ?? "signup";
  return cn(
    responsiveSheetContentClass(undefined, { variant }),
    "cosmic-sheet-shell shadow-[0_-12px_40px_rgba(0,0,0,0.45)]",
    "lg:shadow-[0_24px_56px_rgba(0,0,0,0.6),0_0_32px_rgba(119,112,183,0.12)]",
    extra,
  );
}
