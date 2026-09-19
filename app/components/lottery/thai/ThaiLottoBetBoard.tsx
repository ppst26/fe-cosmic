"use client";

import React, { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import type {
  ThaiLottoBetEntry,
  ThaiLottoBetType,
  ThaiLottoBetTypeId,
  ThaiLottoDigitGroup,
  ThaiLottoDraw,
  ThaiLottoResult,
} from "@/app/types/lottery";
import { ThaiLottoDrawCard } from "./ThaiLottoDrawCard";
import { ThaiLottoBetTypePicker } from "./ThaiLottoBetTypePicker";
import { LotteryNumberPad } from "../LotteryNumberPad";
import { LotteryNumberGrid } from "../LotteryNumberGrid";
import { LotteryInputModeTabs, type LotteryInputMode } from "../LotteryInputModeTabs";
import { ThaiLottoBetSlip } from "./ThaiLottoBetSlip";
import { ThaiLottoResultPanel } from "./ThaiLottoResultPanel";
import { uniquePermutations } from "../lotteryUtils";

/** ป้ายแท็บวิธีใส่เลขของหวยรัฐบาลไทย */
const THAI_INPUT_MODES: { id: LotteryInputMode; label: string }[] = [
  { id: "manual", label: "กรอกเลขเอง" },
  { id: "grid", label: "เลือกจากแผงเลข" },
];

interface ThaiLottoBetBoardProps {
  draw: ThaiLottoDraw;
  lastResult: ThaiLottoResult;
  groups: { id: ThaiLottoDigitGroup; label: string }[];
  betTypes: ThaiLottoBetType[];
  /** ส่งโพยไป API — ยังไม่เชื่อม ถ้าไม่ส่งมาปุ่มยืนยันจะถูกปิด */
  onSubmit?: (entries: ThaiLottoBetEntry[]) => void;
}

const DEFAULT_AMOUNT = 10;

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
 * มือถือ: หัวงวด → แป้นเลข → โพย → ผลงวดก่อน · จอใหญ่: โพยเป็นคอลัมน์ขวา sticky
 */
export function ThaiLottoBetBoard({
  draw,
  lastResult,
  groups,
  betTypes,
  onSubmit,
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
  const [defaultAmount, setDefaultAmount] = useState(DEFAULT_AMOUNT);
  const [feedback, setFeedback] = useState("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const entryCounter = useRef(0);

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
      return { id: `bet-${entryCounter.current}`, ...candidate, amount: defaultAmount };
    });
    setEntries((prev) => [...added, ...prev]);
    setFeedback(`เพิ่ม ${number} ลงโพย ${fresh.length} รายการ`);
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

  return (
    <div className="thai-lotto-layout surface-solid-outer">
      <div className="thai-lotto-layout__draw">
        <ThaiLottoDrawCard draw={draw} remainingMs={remainingMs} />
      </div>

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
      </section>

      <div className="thai-lotto-layout__slip">
        <ThaiLottoBetSlip
          entries={entries}
          betTypes={betTypes}
          defaultAmount={defaultAmount}
          minBet={draw.minBet}
          maxBet={draw.maxBet}
          isClosed={isClosed}
          onDefaultAmountChange={setDefaultAmount}
          onApplyAmountToAll={() =>
            setEntries((prev) => prev.map((entry) => ({ ...entry, amount: defaultAmount })))
          }
          onAmountChange={(entryId, amount) =>
            setEntries((prev) =>
              prev.map((entry) => (entry.id === entryId ? { ...entry, amount } : entry)),
            )
          }
          onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
          onClearAll={() => {
            setEntries([]);
            setFeedback("");
          }}
          onSubmit={onSubmit}
        />
      </div>

      <div className="thai-lotto-layout__result">
        <ThaiLottoResultPanel result={lastResult} />
      </div>
    </div>
  );
}
