import type { TransactionKind, TransactionKindTab } from "@/app/types/transaction";
import { CosmicLineTabs } from "../ui/CosmicLineTabs";

interface TransactionKindTabsProps {
  tabs: TransactionKindTab[];
  activeKind: TransactionKind;
  onSelect: (kind: TransactionKind) => void;
}

/**
 * แท็บฝาก / ถอน / โปรโมชัน / เดิมพัน — line underline (TransactionsPageContent)
 */
export function TransactionKindTabs({ tabs, activeKind, onSelect }: TransactionKindTabsProps) {
  return (
    <CosmicLineTabs
      tabs={tabs}
      activeId={activeKind}
      onSelect={onSelect}
      ariaLabel="ประเภทรายการธุรกรรม"
      columns={4}
    />
  );
}
