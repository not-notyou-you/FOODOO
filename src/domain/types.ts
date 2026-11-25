// src/domain/types.ts
export type HHMM = string;
export type ISODate = string;
export type BusyLevel = 1 | 2 | 4;

export interface Menu {
  id: string;
  name: string;
  price: number;
  cost: number;
  salvage: number;
  usualQty: number;
  archived: boolean;
}

export interface StallSettings {
  openAt: HHMM;
  closeAt: HHMM;
  busyProfile: Record<string, BusyLevel>;
  isDemo: boolean;
}

export interface DayRecord {
  date: ISODate;
  weekday: number;
  unusual: boolean;
  closed: boolean;
}

export type ReasonCode =
  "cold-start" | "cold-start-up" | "cold-start-down" | "history";

export interface Reason {
  code: ReasonCode;
  observations: number;
  soldOutDays: number;
  leftoverDays: number;
  delta: number;
}

export interface MenuDay {
  date: ISODate;
  menuId: string;
  suggestedQty: number | null;
  reason: Reason | null;
  cookedQty: number;
  soldOutAt: HHMM | null;
  leftover: number | null;
  estimatedDemand: number | null;
  demandIsEstimate: boolean;
}

export interface Suggestion {
  menuId: string;
  qty: number;
  reason: Reason;
}

export interface DemandEstimate {
  demand: number;
  isEstimate: boolean;
}
