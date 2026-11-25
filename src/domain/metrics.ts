// src/domain/metrics.ts
import { addDays } from "./time.ts";
import type { DayRecord, ISODate, MenuDay } from "./types.ts";

const WINDOW_DAYS = 7;

export interface WeeklyMetrics {
  menuDayCount: number;
  leftoverPortions: number;
  sellOutEvents: number;
  sellOutFrequency: number;
  estimatedLostSales: number;
  suggestedCount: number;
  acceptedWithoutEdit: number;
  acceptanceShare: number | null;
}

export function weeklyMetrics(
  menuDays: readonly MenuDay[],
  days: readonly DayRecord[],
  endDate: ISODate,
): WeeklyMetrics {
  const startDate = addDays(endDate, 1 - WINDOW_DAYS);
  const counted = new Set(
    days
      .filter(
        (day) =>
          day.closed &&
          !day.unusual &&
          day.date >= startDate &&
          day.date <= endDate,
      )
      .map((day) => day.date),
  );
  const included = menuDays.filter((item) => counted.has(item.date));

  const leftoverPortions = included.reduce(
    (sum, item) => sum + (item.leftover ?? 0),
    0,
  );
  const soldOut = included.filter((item) => item.soldOutAt !== null);
  const estimatedLostSales = soldOut.reduce(
    (sum, item) =>
      sum +
      (item.estimatedDemand === null
        ? 0
        : Math.max(0, item.estimatedDemand - item.cookedQty)),
    0,
  );
  const suggested = included.filter((item) => item.suggestedQty !== null);
  const acceptedWithoutEdit = suggested.filter(
    (item) => item.cookedQty === item.suggestedQty,
  ).length;

  return {
    menuDayCount: included.length,
    leftoverPortions,
    sellOutEvents: soldOut.length,
    sellOutFrequency:
      included.length === 0 ? 0 : soldOut.length / included.length,
    estimatedLostSales,
    suggestedCount: suggested.length,
    acceptedWithoutEdit,
    acceptanceShare:
      suggested.length === 0 ? null : acceptedWithoutEdit / suggested.length,
  };
}
