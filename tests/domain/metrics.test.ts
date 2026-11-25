// tests/domain/metrics.test.ts
import { describe, expect, it } from "vitest";
import { weeklyMetrics } from "../../src/domain/metrics.ts";
import { makeDay, makeMenuDay } from "../helpers.ts";

describe("weeklyMetrics", () => {
  it("returns zeros and a null acceptance share with no data", () => {
    expect(weeklyMetrics([], [], "2026-02-10")).toEqual({
      menuDayCount: 0,
      leftoverPortions: 0,
      sellOutEvents: 0,
      sellOutFrequency: 0,
      estimatedLostSales: 0,
      suggestedCount: 0,
      acceptedWithoutEdit: 0,
      acceptanceShare: null,
    });
  });

  it("sums leftovers, sell-outs, lost sales and acceptance over closed normal days in the window", () => {
    const days = [
      makeDay("2026-02-04", 3),
      makeDay("2026-02-05", 4),
      makeDay("2026-02-06", 5, { unusual: true }),
      makeDay("2026-02-07", 6, { closed: false }),
      makeDay("2026-02-10", 2),
      makeDay("2026-02-03", 2),
    ];
    const menuDays = [
      makeMenuDay("2026-02-04", {
        suggestedQty: 40,
        cookedQty: 40,
        leftover: 5,
      }),
      makeMenuDay("2026-02-05", {
        suggestedQty: 40,
        cookedQty: 45,
        soldOutAt: "10:30",
        leftover: 0,
        estimatedDemand: 80,
        demandIsEstimate: true,
      }),
      makeMenuDay("2026-02-06", { leftover: 99 }),
      makeMenuDay("2026-02-07", { leftover: 99 }),
      makeMenuDay("2026-02-10", { leftover: null }),
      makeMenuDay("2026-02-03", { leftover: 99 }),
    ];
    const result = weeklyMetrics(menuDays, days, "2026-02-10");
    expect(result.menuDayCount).toBe(3);
    expect(result.leftoverPortions).toBe(5);
    expect(result.sellOutEvents).toBe(1);
    expect(result.sellOutFrequency).toBeCloseTo(1 / 3, 10);
    expect(result.estimatedLostSales).toBe(35);
    expect(result.suggestedCount).toBe(2);
    expect(result.acceptedWithoutEdit).toBe(1);
    expect(result.acceptanceShare).toBe(0.5);
  });

  it("counts a sell-out without an estimate as zero lost sales", () => {
    const days = [makeDay("2026-02-10", 2)];
    const menuDays = [
      makeMenuDay("2026-02-10", {
        soldOutAt: "10:30",
        estimatedDemand: null,
      }),
    ];
    const result = weeklyMetrics(menuDays, days, "2026-02-10");
    expect(result.sellOutEvents).toBe(1);
    expect(result.estimatedLostSales).toBe(0);
  });

  it("never reports negative lost sales", () => {
    const days = [makeDay("2026-02-10", 2)];
    const menuDays = [
      makeMenuDay("2026-02-10", {
        cookedQty: 40,
        soldOutAt: "13:55",
        estimatedDemand: 30,
      }),
    ];
    expect(weeklyMetrics(menuDays, days, "2026-02-10").estimatedLostSales).toBe(
      0,
    );
  });
});
