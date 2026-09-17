import type { TransactionKind, TransactionKindTab } from "@/app/types/transaction";

interface TransactionKindTabsProps {
  tabs: TransactionKindTab[];
  activeKind: TransactionKind;
  onSelect: (kind: TransactionKind) => void;
}

/**
 * แท็บฝาก / ถอน — 2 ช่องเท่ากัน ไม่มีปุ่ม filter เพิ่ม
 * แท็บฝาก / ถอน — ใช้ในหน้า /transactions
 */
export function TransactionKindTabs({ tabs, activeKind, onSelect }: TransactionKindTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="ประเภทรายการธุรกรรม"
      className="cosmic-segment-track grid grid-cols-2 gap-2"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeKind;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={`cosmic-segment-btn py-2.5 text-sm ${isActive ? "is-active" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
