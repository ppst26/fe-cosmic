"use client";

import React, { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import type { LotteryFlagTone } from "@/app/types/lottery";
import type {
  YikiBetEntry,
  YikiBetType,
  YikiDigitGroup,
  YikiRound,
  YikiSettlementTypeId,
  YikiSettlementType,
} from "@/app/types/yiki";
import { LotteryNumberPad } from "../LotteryNumberPad";
import { LotteryNumberGrid } from "../LotteryNumberGrid";
import { LotteryInputModeTabs, type LotteryInputMode } from "../LotteryInputModeTabs";
import { YikiRoundStrip } from "./YikiRoundStrip";
import { YikiTypeChips } from "./YikiTypeChips";
import { YikiSlip } from "./YikiSlip";
import { YikiPricePanel } from "./YikiPricePanel";
import { YikiPriceControls } from "./YikiPriceControls";
import { YikiActionBar } from "./YikiActionBar";
import { YikiHowToBet } from "./YikiHowToBet";
import { uniquePermutations } from "../lotteryUtils";

interface YikiBetBoardProps {
  round: YikiRound;
  groups: { id: YikiDigitGroup; label: string }[];
  betTypes: YikiBetType[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  /** กลับหน้าก่อนหน้า — รายการรอบของยี่กี หรือหน้าเลือกหวยของตลาดที่ไม่มีรายการรอบ */
  backHref: string;
  /** ตราตลาด — ค่าเริ่มต้นเป็นยี่กี (YK/gold) ตลาดหวยหุ้นอื่นส่งธงของตัวเองมาแทน */
  flagLabel?: string;
  flagTone?: LotteryFlagTone;
  /** ส่งโพย+ราคาไป API — ยังไม่เชื่อม ถ้าไม่ส่งมาปุ่ม "ยืนยันการแทง" จะถูกปิด */
  onSubmit?: (entries: YikiBetEntry[]) => void;
}

const YIKI_INPUT_MODES: { id: LotteryInputMode; label: string }[] = [
  { id: "manual", label: "กดเลือกเอง" },
  { id: "grid", label: "ชุดตัวเลข" },
];

/** เป้าหมายของ keydown เป็นช่องพิมพ์หรือไม่ — กันไม่ให้แป้นพิมพ์ไปแย่งช่องราคา */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}

/**
 * กระดานแทงหวยแบบ "โพยซ้าย/ใส่เลขขวา" — ถือ state ทั้งหมด (ประเภท · เลขที่กด · โพย · ขั้นใส่ราคา)
 * ใช้ร่วมกันทั้งยี่กี (15/30 นาที ผ่าน app/lottery/yiki-15|yiki-30/[roundId]/page.tsx)
 * และตลาดหวยหุ้นอื่น (ผ่าน app/lottery/[marketId]/page.tsx) — ต่างกันแค่ round/flag ที่ส่งเข้ามา
 * ทุกขนาดจอ: โพย/ใส่ราคาคอลัมน์ซ้าย (sticky) + เลือกเลขคอลัมน์ขวา อยู่คู่กันตลอด ไม่ซ้อนแนวตั้ง
 */
export function YikiBetBoard({
  round,
  groups,
  betTypes,
  settlementTypes,
  backHref,
  flagLabel,
  flagTone,
  onSubmit,
}: YikiBetBoardProps) {
  const firstTypeOf = useCallback(
    (group: YikiDigitGroup) => betTypes.find((type) => type.group === group)?.id,
    [betTypes],
  );

  const [activeGroup, setActiveGroup] = useState<YikiDigitGroup>(groups[0].id);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(() => firstTypeOf(groups[0].id) ?? "");
  const [inputMode, setInputMode] = useState<LotteryInputMode>("manual");
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<YikiBetEntry[]>([]);
  const [lastAddedIds, setLastAddedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [step, setStep] = useState<"pick" | "price">("pick");
  // ขั้นใส่ราคา: เลือก 1 รายการ (หรือติ๊ก "ราคาเท่ากันทั้งหมด") แล้วกดชิปราคา + "แก้ไข" เพื่อใส่ราคา
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [sameForAll, setSameForAll] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const entryCounter = useRef(0);

  // นับถอยหลังหลัง mount เท่านั้น เพื่อให้ markup จาก server ตรงกับ client
  useEffect(() => {
    const closeAt = new Date(round.closeAt).getTime();
    const tick = () => setRemainingMs(closeAt - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [round.closeAt]);

  const isClosed = remainingMs !== null && remainingMs <= 0;
  const activeType = betTypes.find((type) => type.id === selectedTypeId);
  const digits = activeType?.digits ?? 3;

  /** เพิ่มเลขที่กรอกครบลงโพยตามประเภทที่เลือก (+ กลับเลขถ้าประเภทนั้นเป็น "กลับ") ข้ามรายการที่ซ้ำ */
  const addToSlip = (number: string) => {
    if (!activeType) return;
    const numbers = activeType.reverse ? uniquePermutations(number) : [number];
    const candidates = activeType.settlementTypeIds.flatMap((settlementTypeId) =>
      numbers.map((value) => ({ settlementTypeId, number: value })),
    );
    const fresh = candidates.filter(
      (candidate) =>
        !entries.some(
          (entry) => entry.settlementTypeId === candidate.settlementTypeId && entry.number === candidate.number,
        ),
    );

    if (fresh.length === 0) {
      setFeedback(`${number} มีในโพยแล้ว`);
      return;
    }

    const added = fresh.map((candidate) => {
      entryCounter.current += 1;
      return { id: `yiki-${entryCounter.current}`, ...candidate, amount: null };
    });
    setEntries((prev) => [...added, ...prev]);
    setLastAddedIds(added.map((entry) => entry.id));
    setFeedback(`เพิ่ม ${number} ลงโพย ${fresh.length} รายการ`);
  };

  const handleDigit = (digit: string) => {
    if (isClosed || !activeType) return;
    const next = input + digit;
    if (next.length >= digits) {
      addToSlip(next);
      setInput("");
    } else {
      setInput(next);
      setFeedback("");
    }
  };

  const handleBackspace = () => setInput((prev) => prev.slice(0, -1));

  /** เลขในโพยของประเภทที่เลือกอยู่ — ใช้ไฮไลต์ปุ่มในแผงเลข */
  const selectedNumbers = new Set(
    activeType
      ? entries
          .filter(
            (entry) => activeType.settlementTypeIds.includes(entry.settlementTypeId) && entry.number.length === digits,
          )
          .map((entry) => entry.number)
      : [],
  );

  /** แผงเลข: กดเลขที่ยังไม่มี = เพิ่มลงโพย · กดเลขที่มีแล้ว = เอาออก (เฉพาะประเภทที่เลือกอยู่) */
  const handleGridToggle = (number: string) => {
    if (isClosed || !activeType) return;
    if (!selectedNumbers.has(number)) {
      addToSlip(number);
      return;
    }
    setEntries((prev) =>
      prev.filter(
        (entry) => !(entry.number === number && activeType.settlementTypeIds.includes(entry.settlementTypeId)),
      ),
    );
    setFeedback(`เอา ${number} ออกจากโพย`);
  };

  const handleInputModeChange = (mode: LotteryInputMode) => {
    setInputMode(mode);
    setInput("");
    setFeedback("");
  };

  // รองรับแป้นพิมพ์จริงบนจอใหญ่ (เฉพาะแท็บกดเลือกเอง ขั้นเลือกเลข) — useEffectEvent อ่าน state ล่าสุดโดยไม่ต้องผูก listener ใหม่
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (step !== "pick" || inputMode !== "manual") return;
    if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      handleDigit(event.key);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      handleBackspace();
    }
  });
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleGroupChange = (group: YikiDigitGroup) => {
    if (group === activeGroup) return;
    setActiveGroup(group);
    setSelectedTypeId(firstTypeOf(group) ?? "");
    setInput("");
    setFeedback("");
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedTypeId(typeId);
    setInput("");
    setFeedback("");
  };

  const handleUndo = () => {
    setEntries((prev) => prev.filter((entry) => !lastAddedIds.includes(entry.id)));
    setLastAddedIds([]);
  };

  const handleClearAll = () => {
    setEntries([]);
    setLastAddedIds([]);
    setFeedback("");
  };

  const handleGoToPrice = () => {
    if (entries.length === 0 || isClosed) return;
    // เข้าขั้นใส่ราคาแบบว่างเปล่าเสมอ (ไม่เติมราคาเริ่มต้นให้) — เลือกรายการแรกไว้ก่อนให้เริ่มใส่ราคาได้ทันที
    setSelectedEntryId(entries[0]?.id ?? null);
    setSameForAll(false);
    setPendingAmount(null);
    setStep("price");
  };

  /** กดชิปราคา — เก็บเป็นค่าที่ "รอใส่" ยังไม่ลงโพยจนกว่าจะกด "แก้ไข" */
  const handleSelectPendingAmount = (amount: number) => setPendingAmount(amount);

  /** กด "แก้ไข" — ใส่ราคาที่เลือกไว้ลงรายการที่เลือกอยู่ หรือทุกรายการถ้าติ๊ก "ราคาเท่ากันทั้งหมด" */
  const handleApplyPendingAmount = () => {
    if (pendingAmount === null) return;
    setEntries((prev) =>
      prev.map((entry) =>
        sameForAll || entry.id === selectedEntryId ? { ...entry, amount: pendingAmount } : entry,
      ),
    );
  };

  const activeGroupTypes = betTypes.filter((type) => type.group === activeGroup);
  const canConfirm = Boolean(onSubmit) && !isClosed && entries.length > 0 && entries.every((entry) => (entry.amount ?? 0) > 0);
  const priceTotal = entries.reduce((sum, entry) => sum + (entry.amount ?? 0), 0);
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) ?? null;

  return (
    <>
      <div className={`yiki-layout${step === "price" ? " yiki-layout--price" : ""}`}>
        <div className="yiki-layout__round">
          <YikiRoundStrip round={round} remainingMs={remainingMs} flagLabel={flagLabel} flagTone={flagTone} />
        </div>

        <div className="yiki-layout__slip">
          {step === "pick" ? (
            <YikiSlip
              entries={entries}
              settlementTypes={settlementTypes}
              canUndo={lastAddedIds.length > 0}
              onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
              onUndo={handleUndo}
              onClearAll={handleClearAll}
            />
          ) : (
            <YikiPricePanel
              entries={entries}
              settlementTypes={settlementTypes}
              selectedEntryId={selectedEntryId}
              onSelectEntry={setSelectedEntryId}
              onAmountChange={(entryId, amount) =>
                setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, amount } : entry)))
              }
              onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
            />
          )}
        </div>

        {step === "price" ? (
          <div className="yiki-layout__input">
            <YikiPriceControls
              selectedEntry={selectedEntry}
              settlementTypes={settlementTypes}
              sameForAll={sameForAll}
              onToggleSameForAll={setSameForAll}
              pendingAmount={pendingAmount}
              onSelectPendingAmount={handleSelectPendingAmount}
              onApply={handleApplyPendingAmount}
              canApply={pendingAmount !== null && (sameForAll || selectedEntryId !== null)}
              total={priceTotal}
            />
          </div>
        ) : null}

        {step === "pick" ? (
          <section className="thai-lotto-panel yiki-layout__input" aria-label="เลือกเลข">
            <LotteryInputModeTabs
              modes={YIKI_INPUT_MODES}
              activeMode={inputMode}
              onChange={handleInputModeChange}
              panelId="yiki-input-panel"
            />

            <div className="cosmic-segment-track grid grid-cols-3 gap-1" role="group" aria-label="จำนวนหลัก">
              {groups.map((group) => {
                const isActive = group.id === activeGroup;
                return (
                  <button
                    key={group.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleGroupChange(group.id)}
                    className={`cosmic-segment-btn min-h-11 text-sm ${
                      isActive ? "is-active" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>

            <YikiTypeChips
              betTypes={activeGroupTypes}
              settlementTypes={settlementTypes}
              activeTypeId={selectedTypeId}
              onSelect={handleTypeSelect}
            />

            <div id="yiki-input-panel" role="tabpanel" aria-labelledby={`thai-lotto-mode-${inputMode}`}>
              {inputMode === "manual" ? (
                <LotteryNumberPad
                  digits={digits}
                  value={input}
                  onDigit={handleDigit}
                  onBackspace={handleBackspace}
                  onClear={() => setInput("")}
                />
              ) : (
                <LotteryNumberGrid
                  digits={digits}
                  selectedNumbers={selectedNumbers}
                  disabled={isClosed}
                  onToggle={handleGridToggle}
                />
              )}
            </div>

            <p className="thai-lotto-feedback" aria-live="polite">
              {feedback}
            </p>
          </section>
        ) : null}

        {step === "pick" ? (
          <div className="yiki-layout__howto">
            <YikiHowToBet />
          </div>
        ) : null}
      </div>

      <YikiActionBar
        secondary={
          step === "pick"
            ? { label: "กลับหน้าก่อนหน้า", href: backHref }
            : { label: "กลับแก้ไขเลข", onClick: () => setStep("pick") }
        }
        primary={
          step === "pick"
            ? { label: "ใส่ราคา", onClick: handleGoToPrice, disabled: entries.length === 0 || isClosed }
            : { label: "ส่งโพย", onClick: () => onSubmit?.(entries), disabled: !canConfirm }
        }
      />
    </>
  );
}
