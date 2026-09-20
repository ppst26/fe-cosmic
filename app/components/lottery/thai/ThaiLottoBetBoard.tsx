"use client";

import React, { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import Link from "next/link";
import type {
  ThaiLottoBetEntry,
  ThaiLottoBetType,
  ThaiLottoBetTypeId,
  ThaiLottoDigitGroup,
  ThaiLottoDraw,
} from "@/app/types/lottery";
import { ThaiLottoDrawCard } from "./ThaiLottoDrawCard";
import { ThaiLottoBetTypePicker } from "./ThaiLottoBetTypePicker";
import { LotteryNumberPad } from "../LotteryNumberPad";
import { LotteryNumberGrid } from "../LotteryNumberGrid";
import { LotteryInputModeTabs, type LotteryInputMode } from "../LotteryInputModeTabs";
import { ThaiLottoBetSlip } from "./ThaiLottoBetSlip";
import { ThaiLottoPricePanel } from "./ThaiLottoPricePanel";
import { LotteryPriceControls } from "../LotteryPriceControls";
import { LotteryPriceStepCard } from "../LotteryPriceStepCard";
import { uniquePermutations } from "../lotteryUtils";

/** ป้ายแท็บวิธีใส่เลขของหวยรัฐบาลไทย */
const THAI_INPUT_MODES: { id: LotteryInputMode; label: string }[] = [
  { id: "manual", label: "กรอกเลขเอง" },
  { id: "grid", label: "เลือกจากแผงเลข" },
];

interface ThaiLottoBetBoardProps {
  draw: ThaiLottoDraw;
  groups: { id: ThaiLottoDigitGroup; label: string }[];
  betTypes: ThaiLottoBetType[];
  backHref: string;
  /** ส่งโพยไป API — ยังไม่เชื่อม ถ้าไม่ส่งมาปุ่มยืนยันจะถูกปิด */
  onSubmit?: (entries: ThaiLottoBetEntry[]) => void;
  /** แจ้ง shell ซ่อน bottom nav ตอนขั้นใส่ราคา (มือถือ) */
  onStepChange?: (step: "pick" | "price") => void;
}

/** เป้าหมายของ keydown เป็นช่องพิมพ์หรือไม่ — กันไม่ให้แป้นพิมพ์ไปแย่งช่องราคา */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}

/**
 * หน้าแทงหวยรัฐบาลไทย — ถือ state ทั้งหมด (ประเภท · เลขที่กด · โพย · เวลาปิดรับ)
 * ใช้ใน app/lottery/thai-government/page.tsx
 * มือถือ: หัวงวด → แป้นเลข + โพยคู่กัน · จอใหญ่: โพยคอลัมน์ขวา (ผลหวยอยู่หน้ารายการรอบ)
 */
export function ThaiLottoBetBoard({
  draw,
  groups,
  betTypes,
  backHref,
  onSubmit,
  onStepChange,
}: ThaiLottoBetBoardProps) {
  const firstTypeOf = useCallback(
    (group: ThaiLottoDigitGroup) => betTypes.find((type) => type.group === group)?.id,
    [betTypes],
  );

  const [activeGroup, setActiveGroup] = useState<ThaiLottoDigitGroup>(groups[0].id);
  const [selectedTypeIds, setSelectedTypeIds] = useState<ThaiLottoBetTypeId[]>(() => {
    const first = betTypes.find((type) => type.group === groups[0].id);
    return first ? [first.id] : [];
  });
  const [inputMode, setInputMode] = useState<LotteryInputMode>("manual");
  const [input, setInput] = useState("");
  const [isReverse, setIsReverse] = useState(false);
  const [entries, setEntries] = useState<ThaiLottoBetEntry[]>([]);
  const [lastAddedIds, setLastAddedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [step, setStep] = useState<"pick" | "price">("pick");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [sameForAll, setSameForAll] = useState(false);
  const entryCounter = useRef(0);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // นับถอยหลังหลัง mount เท่านั้น เพื่อให้ markup จาก server ตรงกับ client
  useEffect(() => {
    const closeAt = new Date(draw.closeAt).getTime();
    const tick = () => setRemainingMs(closeAt - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [draw.closeAt]);

  const isClosed = remainingMs !== null && remainingMs <= 0;
  const digits = betTypes.find((type) => type.group === activeGroup)?.digits ?? 3;
  const canReverse = digits > 1;

  /** เพิ่มเลขที่กรอกครบลงโพย ตามประเภทที่เลือก (+ กลับเลขถ้าเปิด) ข้ามรายการที่ซ้ำ */
  const addToSlip = (number: string) => {
    const reversed = isReverse && canReverse ? uniquePermutations(number) : [number];
    const candidates = selectedTypeIds.flatMap((typeId) =>
      // โต๊ดครอบคลุมทุกการสลับหลักอยู่แล้ว ไม่ต้องกลับเลข
      (typeId === "three_tod" ? [number] : reversed).map((value) => ({ typeId, number: value })),
    );
    const fresh = candidates.filter(
      (candidate) =>
        !entries.some((entry) => entry.typeId === candidate.typeId && entry.number === candidate.number),
    );

    if (fresh.length === 0) {
      setFeedback(`${number} มีในโพยแล้ว`);
      return;
    }

    const added = fresh.map((candidate) => {
      entryCounter.current += 1;
      return { id: `bet-${entryCounter.current}`, ...candidate, amount: 0 };
    });
    setEntries((prev) => [...added, ...prev]);
    setLastAddedIds(added.map((entry) => entry.id));
    setFeedback(`เพิ่ม ${number} ลงโพย ${fresh.length} รายการ`);
  };

  const handleUndoLastAdd = () => {
    if (lastAddedIds.length === 0) return;
    setEntries((prev) => prev.filter((entry) => !lastAddedIds.includes(entry.id)));
    setLastAddedIds([]);
    setFeedback("ย้อนรายการล่าสุดแล้ว");
  };

  const handleDigit = (digit: string) => {
    if (selectedTypeIds.length === 0) return;
    const next = input + digit;
    if (next.length > digits) return;

    setInput(next);
    setFeedback("");

    if (next.length < digits) return;

    if (isClosed) {
      setFeedback("ปิดรับแทงแล้ว");
      return;
    }

    const number = next;
    const pushSlip = () => {
      addToSlip(number);
      setInput("");
    };
    if (digits === 1) {
      window.setTimeout(pushSlip, 150);
    } else {
      requestAnimationFrame(() => requestAnimationFrame(pushSlip));
    }
  };

  const handleBackspace = () => setInput((prev) => prev.slice(0, -1));

  /** เลขในโพยของประเภทที่เลือกอยู่ — ใช้ไฮไลต์ปุ่มในแผงเลข */
  const selectedNumbers = new Set(
    entries
      .filter((entry) => selectedTypeIds.includes(entry.typeId) && entry.number.length === digits)
      .map((entry) => entry.number),
  );

  /** แผงเลข: กดเลขที่ยังไม่มี = เพิ่มลงโพย · กดเลขที่มีแล้ว = เอาออก (เฉพาะประเภทที่เลือกอยู่) */
  const handleGridToggle = (number: string) => {
    if (isClosed || selectedTypeIds.length === 0) return;
    if (!selectedNumbers.has(number)) {
      addToSlip(number);
      return;
    }
    setEntries((prev) =>
      prev.filter((entry) => !(entry.number === number && selectedTypeIds.includes(entry.typeId))),
    );
    setFeedback(`เอา ${number} ออกจากโพย`);
  };

  const handleInputModeChange = (mode: LotteryInputMode) => {
    setInputMode(mode);
    setInput("");
    setFeedback("");
  };

  // รองรับแป้นพิมพ์จริงบนจอใหญ่ (เฉพาะแท็บกรอกเลขเอง) — useEffectEvent อ่าน state ล่าสุดโดยไม่ต้องผูก listener ใหม่
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (inputMode !== "manual") return;
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

  const handleGroupChange = (group: ThaiLottoDigitGroup) => {
    if (group === activeGroup) return;
    setActiveGroup(group);
    const first = firstTypeOf(group);
    setSelectedTypeIds(first ? [first] : []);
    setInput("");
    setFeedback("");
  };

  /** toggle ประเภท — ต้องเหลืออย่างน้อย 1 ประเภทเสมอ */
  const handleToggleType = (typeId: ThaiLottoBetTypeId) => {
    setSelectedTypeIds((prev) => {
      if (!prev.includes(typeId)) return [...prev, typeId];
      return prev.length > 1 ? prev.filter((id) => id !== typeId) : prev;
    });
  };

  const handleGoToPrice = () => {
    if (entries.length === 0 || isClosed) return;
    setSelectedEntryId(entries[0]?.id ?? null);
    setSameForAll(false);
    setStep("price");
  };

  const handleQuickAmount = (amount: number) => {
    const clamped = Math.min(draw.maxBet, Math.max(draw.minBet, amount));
    setEntries((prev) =>
      prev.map((entry) =>
        sameForAll || entry.id === selectedEntryId ? { ...entry, amount: clamped } : entry,
      ),
    );
  };

  const isAmountValid = (amount: number) => amount >= draw.minBet && amount <= draw.maxBet;
  const priceTotal = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) ?? null;
  const canConfirm =
    Boolean(onSubmit) &&
    !isClosed &&
    entries.length > 0 &&
    entries.every((entry) => isAmountValid(entry.amount));

  return (
    <>
      <div
        className={`thai-lotto-layout surface-solid-outer${step === "price" ? " thai-lotto-layout--price" : ""}`}
      >
        {step === "pick" ? (
          <div className="thai-lotto-layout__draw">
            <ThaiLottoDrawCard draw={draw} remainingMs={remainingMs} />
          </div>
        ) : null}

        {step === "pick" ? (
          <section className="thai-lotto-panel thai-lotto-layout__input" aria-label="เลือกเลข">
        <ThaiLottoBetTypePicker
          groups={groups}
          betTypes={betTypes}
          activeGroup={activeGroup}
          selectedTypeIds={selectedTypeIds}
          onGroupChange={handleGroupChange}
          onToggleType={handleToggleType}
        />

        {canReverse ? (
          <button
            type="button"
            aria-pressed={isReverse}
            onClick={() => setIsReverse((prev) => !prev)}
            className={`thai-lotto-toggle${isReverse ? " is-active" : ""}`}
          >
            <span className="thai-lotto-toggle__track" aria-hidden="true">
              <span className="thai-lotto-toggle__thumb" />
            </span>
            กลับเลข
          </button>
        ) : null}

        <LotteryInputModeTabs
          modes={THAI_INPUT_MODES}
          activeMode={inputMode}
          onChange={handleInputModeChange}
          panelId="thai-lotto-input-panel"
        />

        <div id="thai-lotto-input-panel" role="tabpanel" aria-labelledby={`thai-lotto-mode-${inputMode}`}>
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

            <div className="yiki-pick-actions" aria-label="ดำเนินการต่อ">
              <Link href={backHref} className="yiki-pick-actions__back">
                กลับหน้าก่อนหน้า
              </Link>
              <button
                type="button"
                className="cosmic-cta-primary cosmic-cta-primary--lg yiki-pick-actions__primary"
                disabled={entries.length === 0 || isClosed}
                onClick={handleGoToPrice}
              >
                ใส่ราคา
              </button>
            </div>
          </section>
        ) : null}

        <div className="thai-lotto-layout__slip">
          {step === "pick" ? (
            <ThaiLottoBetSlip
              entries={entries}
              betTypes={betTypes}
              onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
              onClearAll={() => {
                setEntries([]);
                setLastAddedIds([]);
                setFeedback("");
              }}
              canUndo={lastAddedIds.length > 0}
              onUndo={handleUndoLastAdd}
            />
          ) : (
            <LotteryPriceStepCard
              controls={
                <LotteryPriceControls
                  sameForAll={sameForAll}
                  onToggleSameForAll={setSameForAll}
                  onBack={() => setStep("pick")}
                  onQuickAmount={handleQuickAmount}
                  onSubmit={() => onSubmit?.(entries)}
                  submitDisabled={!canConfirm}
                  total={priceTotal}
                  selectedAmount={selectedEntry?.amount ?? null}
                />
              }
            >
              <ThaiLottoPricePanel
                entries={entries}
                betTypes={betTypes}
                selectedEntryId={selectedEntryId}
                onSelectEntry={setSelectedEntryId}
                onAmountChange={(entryId, amount) =>
                  setEntries((prev) =>
                    prev.map((entry) => (entry.id === entryId ? { ...entry, amount } : entry)),
                  )
                }
                onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
              />
            </LotteryPriceStepCard>
          )}
        </div>
      </div>

    </>
  );
}
