// tests/domain/time.test.ts
import { describe, expect, it } from "vitest";
import {
  addDays,
  formatHHMM,
  parseHHMM,
  weekdayOf,
} from "../../src/domain/time.ts";

describe("parseHHMM and formatHHMM", () => {
  it("round-trips valid times", () => {
    expect(parseHHMM("10:32")).toBe(632);
    expect(parseHHMM("00:00")).toBe(0);
    expect(parseHHMM("23:59")).toBe(1439);
    expect(formatHHMM(632)).toBe("10:32");
    expect(formatHHMM(0)).toBe("00:00");
  });

  it("rejects malformed times", () => {
    expect(() => parseHHMM("24:00")).toThrow(RangeError);
    expect(() => parseHHMM("9:30")).toThrow(RangeError);
    expect(() => parseHHMM("10:60")).toThrow(RangeError);
  });

  it("rejects minutes outside one day", () => {
    expect(() => formatHHMM(-1)).toThrow(RangeError);
    expect(() => formatHHMM(1440)).toThrow(RangeError);
    expect(() => formatHHMM(10.5)).toThrow(RangeError);
  });
});

describe("addDays and weekdayOf", () => {
  it("moves across month and year boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
    expect(addDays("2026-03-10", 0)).toBe("2026-03-10");
  });

  it("returns the weekday with Sunday as 0", () => {
    expect(weekdayOf("2026-01-04")).toBe(0);
    expect(weekdayOf("2026-01-05")).toBe(1);
    expect(weekdayOf("2026-01-10")).toBe(6);
  });

  it("rejects invalid dates", () => {
    expect(() => addDays("2026-02-30", 1)).toThrow(RangeError);
    expect(() => weekdayOf("2026/02/01")).toThrow(RangeError);
  });
});
