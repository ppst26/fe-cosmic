"use client";

import React, { useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { SearchIcon, ClearIcon } from "../ui/Icons";

interface GameSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

/**
 * GameSearchBar ช่องค้นหาเกมและค่ายเกม
 * สูง 44–48px ตามมาตรฐาน accessibility และ design.md
 * มี icon แว่นขยายซ้าย, placeholder "Game | Provider" และปุ่มเคลียร์ข้อความ
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function GameSearchBar({
  placeholder = "Game | Provider",
  onSearch,
}: GameSearchBarProps) {
  const t = useT("home");
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full my-2.5"
      role="search"
      aria-label={t("search.formAriaLabel")}
    >
      <div className="relative flex h-[46px] w-full items-center rounded-[var(--radius-filter)] bg-[#121127] px-3.5 transition-all duration-150 border-none shadow-none outline-none ring-0 focus-within:outline-none focus-within:ring-0 hover:outline-none hover:ring-0">
        {/* Label สำหรับ Screen Reader เท่านั้น */}
        <label htmlFor="game-search-input" className="sr-only">
          {t("search.label")}
        </label>

        {/* ไอคอนแว่นขยายด้านซ้าย */}
        <span className="text-[var(--text-muted)] mr-2.5 shrink-0" aria-hidden="true">
          <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </span>

        {/* ช่อง Input */}
        <input
          id="game-search-input"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-full bg-transparent text-sm sm:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] !outline-none !ring-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0"
          style={{ outline: "none", boxShadow: "none" }}
          autoComplete="off"
          spellCheck="false"
        />

        {/* ปุ่มล้างคำค้นหา (Clear Button) แสดงเมื่อมีข้อความ */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
            aria-label={t("search.clear")}
          >
            <ClearIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
