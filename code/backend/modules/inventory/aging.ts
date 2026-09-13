import { env } from "../../config/env.js";
import type { InventoryStatus } from "@prisma/client";

export interface InventoryLifecycleInput {
  purchaseDate: Date;
  expiryDate?: Date | null;
  currentStatus?: InventoryStatus;
  now?: Date;
  agingThresholdDays?: number;
  deadstockThresholdDays?: number;
}

export interface InventoryLifecycleResult {
  status: InventoryStatus;
  daysSincePurchase: number;
  daysUntilExpiry: number | null;
  deadstockFlaggedAt: Date | null;
  reason: string;
}

function daysBetween(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function evaluateInventoryLifecycle(input: InventoryLifecycleInput): InventoryLifecycleResult {
  const now = input.now ?? new Date();
  const agingThreshold = input.agingThresholdDays ?? env.AGING_THRESHOLD_DAYS;
  const deadstockThreshold = input.deadstockThresholdDays ?? env.DEADSTOCK_THRESHOLD_DAYS;
  const daysSincePurchase = daysBetween(input.purchaseDate, now);
  const daysUntilExpiry = input.expiryDate ? daysBetween(now, input.expiryDate) : null;

  if (input.currentStatus === "SUBMITTED_FOR_VERIFICATION") {
    return {
      status: input.currentStatus,
      daysSincePurchase,
      daysUntilExpiry,
      deadstockFlaggedAt: null,
      reason: "Inventory already submitted for verification."
    };
  }

  if (input.expiryDate && input.expiryDate.getTime() <= now.getTime()) {
    return {
      status: "DEADSTOCK_FLAGGED",
      daysSincePurchase,
      daysUntilExpiry,
      deadstockFlaggedAt: now,
      reason: "Expiry date has passed."
    };
  }

  if (daysSincePurchase >= deadstockThreshold) {
    return {
      status: "DEADSTOCK_FLAGGED",
      daysSincePurchase,
      daysUntilExpiry,
      deadstockFlaggedAt: now,
      reason: "Item has crossed the deadstock threshold."
    };
  }

  if (daysSincePurchase >= agingThreshold) {
    return {
      status: "AGING",
      daysSincePurchase,
      daysUntilExpiry,
      deadstockFlaggedAt: null,
      reason: "Item is aging toward deadstock."
    };
  }

  return {
    status: "ACTIVE",
    daysSincePurchase,
    daysUntilExpiry,
    deadstockFlaggedAt: null,
    reason: "Item is within the healthy inventory window."
  };
}

export function formatInventoryLifecycleSummary(result: InventoryLifecycleResult): {
  status: InventoryStatus;
  daysSincePurchase: number;
  daysUntilExpiry: number | null;
  reason: string;
} {
  return {
    status: result.status,
    daysSincePurchase: result.daysSincePurchase,
    daysUntilExpiry: result.daysUntilExpiry,
    reason: result.reason
  };
}
