"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRightIcon,
  HeaderWalletIcon,
  RefundIcon,
} from "../ui/Icons";
import { MenuItemIcon } from "./MenuItemIcon";
import { VipRankEmblem } from "../vip/VipRankEmblem";
import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";
import {
  DESKTOP_ACTIVITY_LINKS,
  DESKTOP_PLAYER_PANEL_MOCK,
} from "@/app/data/desktopLobbyMockData";
import {
  MENU_DIALOG_SECTIONS,
  type MenuDialogAction,
  type MenuDialogTile,
} from "@/app/data/menuMockData";
import { VIP_PLAYER_MOCK } from "@/app/data/vipMockData";
import type { VipRankId } from "@/app/types/vip";

const GEMS_ASSET_SRC = "/assets/gems/gems.webp";

const ACCOUNT_MENU_TILES =
  MENU_DIALOG_SECTIONS.find((section) => section.id === "personal")?.items ?? [];

interface LobbyDesktopRightRailProps {
  onMenuAction?: (action: MenuDialogAction) => void;
}

/** ลิงก์บัญชีในการ์ดกระเป๋า — ย้ายมาจาก sidebar ซ้าย */
function renderAccountTile(
  tile: MenuDialogTile,
  onMenuAction?: (action: MenuDialogAction) => void,
) {
  const inner = (
    <>
      <span className="flex items-center gap-2.5">
        <MenuItemIcon iconId={tile.iconId} />
        {tile.label}
      </span>
      <ChevronRightIcon className="h-4 w-4 opacity-60" />
    </>
  );

  if (tile.action) {
    return (
      <button
        type="button"
        className="lobby-desktop-panel__link w-full border-0 bg-transparent font-inherit"
        onClick={() => onMenuAction?.(tile.action!)}
      >
        {inner}
      </button>
    );
  }

  if (tile.href) {
    return (
      <Link href={tile.href} className="lobby-desktop-panel__link">
        {inner}
      </Link>
    );
  }

  return null;
}

/**
 * แถบ widget ขวา desktop lobby — กระเป๋า · บัญชี · แรงค์ · gems · กิจกรรม · คืนยอด
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function LobbyDesktopRightRail({ onMenuAction }: LobbyDesktopRightRailProps) {
  const { openDeposit } = useDeposit();
  const { openWithdraw } = useWithdraw();
  const balanceLabel = formatHeaderWalletBalance(MOCK_MAIN_WALLET_BALANCE);
  const rankId = DESKTOP_PLAYER_PANEL_MOCK.rankId as VipRankId;
  const expPct = Math.min(
    100,
    Math.round(
      (DESKTOP_PLAYER_PANEL_MOCK.expCurrent / DESKTOP_PLAYER_PANEL_MOCK.expTarget) * 100,
    ),
  );

  return (
    <aside
      className="lobby-desktop-right-rail hidden w-[280px] shrink-0 flex-col gap-3 lg:flex xl:w-[300px]"
      aria-label="แผงข้อมูลผู้เล่น"
    >
      <div className="lobby-desktop-panel">
        <p className="lobby-desktop-panel__label">กระเป๋าเงิน</p>
        <div className="mt-2 flex items-center gap-2 text-lg font-extrabold tabular-nums">
          <HeaderWalletIcon className="h-5 w-5 text-[var(--icon-default)]" />
          {balanceLabel}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={openDeposit}
            className="lobby-desktop-rail-btn lobby-desktop-rail-btn--primary"
          >
            ฝากเงิน
          </button>
          <button
            type="button"
            onClick={openWithdraw}
            className="lobby-desktop-rail-btn lobby-desktop-rail-btn--secondary"
          >
            ถอนเงิน
          </button>
        </div>

        {ACCOUNT_MENU_TILES.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-0.5 border-t border-[color-mix(in_srgb,var(--border-subtle)_55%,transparent)] pt-2">
            {ACCOUNT_MENU_TILES.map((tile) => (
              <li key={tile.id}>{renderAccountTile(tile, onMenuAction)}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="lobby-desktop-panel">
        <p className="lobby-desktop-panel__label">ระดับ</p>
        <div className="mt-2 flex items-center gap-3">
          <VipRankEmblem rankId={rankId} size="sm" playing={false} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#ffe66d]">
              {DESKTOP_PLAYER_PANEL_MOCK.rankLabel}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {DESKTOP_PLAYER_PANEL_MOCK.expCurrent.toLocaleString()} /{" "}
              {DESKTOP_PLAYER_PANEL_MOCK.expTarget.toLocaleString()} EXP
            </p>
          </div>
        </div>
        <div className="lobby-desktop-panel__progress mt-2">
          <div className="lobby-desktop-panel__progress-fill" style={{ width: `${expPct}%` }} />
        </div>

        <p className="lobby-desktop-panel__label mt-3 mb-1.5">ภารกิจเลื่อนระดับ</p>
        <ul className="flex flex-col gap-2">
          {VIP_PLAYER_MOCK.missions.map((mission) => {
            const missionPct = Math.min(
              100,
              Math.round((mission.progress / mission.target) * 100),
            );
            return (
              <li key={mission.id}>
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {mission.label}
                  </span>
                  <span className="tabular-nums text-[var(--text-muted)]">
                    {mission.progress}/{mission.target} {mission.unit}
                  </span>
                </div>
                <div className="lobby-desktop-panel__progress mt-1 h-1">
                  <div
                    className="lobby-desktop-panel__progress-fill"
                    style={{ width: `${missionPct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lobby-desktop-panel">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center gap-1">
            <Image
              src={GEMS_ASSET_SRC}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold text-[var(--text-muted)]">Gems</span>
          </div>
          <span className="text-xl font-extrabold tabular-nums text-[var(--text-primary)]">
            {DESKTOP_PLAYER_PANEL_MOCK.gems.toLocaleString()}
          </span>
        </div>
      </div>

      <nav className="lobby-desktop-panel" aria-label="กิจกรรม">
        <ul className="flex flex-col gap-0.5">
          {DESKTOP_ACTIVITY_LINKS.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="lobby-desktop-panel__link">
                <span className="flex items-center gap-2.5">
                  <MenuItemIcon iconId={item.iconId} />
                  {item.label}
                </span>
                <ChevronRightIcon className="h-4 w-4 opacity-60" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="lobby-desktop-panel">
        <div className="flex items-start gap-2">
          <RefundIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--chart-2)]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">คืนยอดเสีย</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {DESKTOP_PLAYER_PANEL_MOCK.cashbackHint}
            </p>
            <Link
              href="/cashback"
              className="mt-2 inline-block text-xs font-semibold text-[var(--chart-2)] hover:underline"
            >
              ดูรายละเอียด
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
