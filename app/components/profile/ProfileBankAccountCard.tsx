import type { ProfileUser } from "@/app/types/auth";
import { getSignUpBankById, signUpCoverToneClass } from "@/app/data/signupMockData";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

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
export function ProfileBankAccountCard({ profile }: { profile: ProfileUser }) {
  const bank = getSignUpBankById(profile.bankId);
  const bankMarkLabel = (bank?.label ?? profile.bankLabel).slice(0, 3);
  const bankToneClass = signUpCoverToneClass(bank?.coverTone ?? "emerald");
  const accountFormatted = formatBankAccountForDisplay(profile.bankAccountNumber);

  return (
    <article className={cn(COSMIC_PANEL_GLASS, "flex flex-col gap-3 px-3.5 py-3.5 sm:px-4 sm:py-4")}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[10px] font-medium uppercase text-white",
            bankToneClass,
          )}
          aria-hidden="true"
        >
          {bankMarkLabel}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-[var(--text-primary)]">{profile.bankLabel}</p>
          <p className="mt-1.5 text-base font-medium tabular-nums tracking-tight text-[var(--accent-highlight)]">
            {accountFormatted}
          </p>
          <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">{profile.displayName}</p>
        </div>
      </div>
    </article>
  );
}
