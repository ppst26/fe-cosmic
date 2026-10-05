"use client";

import React from "react";
import { cn } from "@/lib/utils";

type CosmicFormulaRowProps = {
  children: React.ReactNode;
  className?: string;
};

type CosmicFormulaCellProps = {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  className?: string;
};

type CosmicFormulaOperatorProps = {
  symbol: string;
  className?: string;
};

/**
 * แถบสูตรคำนวณ — ช่องเท่ากัน พื้นเข้มโทนเทา (ไม่ม่วง)
 * ใช้ใน CashbackLossRebateExtraSections · หน้าสรุปสถิติอื่นได้
 */
export function CosmicFormulaRow({ children, className }: CosmicFormulaRowProps) {
  return <div className={cn("cosmic-formula-row", className)}>{children}</div>;
}

/** ช่อง label + ค่า — ขนาดเท่ากันในแถว (flex 1 1 0) */
export function CosmicFormulaCell({
  label,
  value,
  valueClassName,
  className,
}: CosmicFormulaCellProps) {
  return (
    <div className={cn("cosmic-formula-cell", className)}>
      <p className="cosmic-formula-cell__label">{label}</p>
      <p className={cn("cosmic-formula-cell__value", valueClassName)}>{value}</p>
    </div>
  );
}

/** ตัวดำเนิน × = ระหว่างช่อง */
export function CosmicFormulaOperator({ symbol, className }: CosmicFormulaOperatorProps) {
  return (
    <span className={cn("cosmic-formula-operator", className)} aria-hidden="true">
      {symbol}
    </span>
  );
}
