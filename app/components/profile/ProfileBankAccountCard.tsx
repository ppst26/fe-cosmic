import type { ProfileUser } from "@/app/types/auth";
import { getSignUpBankById, signUpCoverToneClass } from "@/app/data/signupMockData";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";
import { valueClass } from "@/lib/semanticValue";

/**
 * จัดรูปเลขบัญชีสำหรับแสดงบนหน้าโปรไฟล์
 */
function formatBankAccountForDisplay(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  return digits || accountNumber;
}

/**
 * การ์ดบัญชีธนาคารเดียว — ข้อมูลจาก ProfileUser (ProfileAccountTabs)
 */
export function ProfileBankAccountCard({
  profile,
  embedded = false,
}: {
  profile: ProfileUser;
  /** อยู่ในการ์ดแท็บหลัก — ไม่ห่อ glass ซ้อน */
  embedded?: boolean;
}) {
  const bank = getSignUpBankById(profile.bankId);
  const bankMarkLabel = (bank?.label ?? profile.bankLabel).slice(0, 3);
  const bankToneClass = signUpCoverToneClass(bank?.coverTone ?? "emerald");
  const accountFormatted = formatBankAccountForDisplay(profile.bankAccountNumber);

  return (
    <article
      className={cn(
        "flex items-start gap-3",
        embedded
          ? "profile-account-inner-card px-3 py-3 sm:px-3.5 sm:py-3.5"
          : cn(COSMIC_PANEL_GLASS, "flex-col gap-3 px-3.5 py-3.5 sm:px-4 sm:py-4"),
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-medium uppercase text-white",
          bankToneClass,
        )}
        aria-hidden="true"
      >
        {bankMarkLabel}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-[var(--text-primary)]">{profile.bankLabel}</p>
        <p className={valueClass("emphasis", "mt-1.5 text-base tracking-tight")}>
          {accountFormatted}
        </p>
        <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">{profile.displayName}</p>
      </div>
    </article>
  );
}
