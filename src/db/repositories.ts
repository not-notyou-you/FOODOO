// src/db/repositories.ts
import { buildDemoRecords } from "../demo/seed.ts";
import {
  resizeProfile,
  validateHours,
  validateMenu,
  type MenuInput,
} from "../domain/setup.ts";
import type {
  BusyLevel,
  DayRecord,
  HHMM,
  ISODate,
  Menu,
  MenuDay,
  StallSettings,
} from "../domain/types.ts";
import { STALL_ID, type FoodooDb, type StallRow } from "./schema.ts";

export const DEFAULT_OPEN_AT: HHMM = "06:00";
export const DEFAULT_CLOSE_AT: HHMM = "14:00";
export const STALL_NAME_MAX_LENGTH = 40;

export interface Hours {
  openAt: HHMM;
  closeAt: HHMM;
  busyProfile: Record<string, BusyLevel>;
}

export interface TodayState {
  day: DayRecord | undefined;
  menuDays: MenuDay[];
}

export function defaultSettings(): StallSettings {
  return {
    openAt: DEFAULT_OPEN_AT,
    closeAt: DEFAULT_CLOSE_AT,
    busyProfile: resizeProfile({}, DEFAULT_OPEN_AT, DEFAULT_CLOSE_AT),
    isDemo: false,
  };
}

export function hoursOf(settings: StallSettings): Hours {
  return {
    openAt: settings.openAt,
    closeAt: settings.closeAt,
    busyProfile: { ...settings.busyProfile },
  };
}

function allTables(db: FoodooDb) {
  return [db.stall, db.menus, db.days, db.menuDays];
}

async function requireStall(db: FoodooDb): Promise<StallRow> {
  const stall = await db.stall.get(STALL_ID);
  if (stall === undefined) {
    throw new Error("No stall has been set up");
  }
  return stall;
}

export async function getStall(db: FoodooDb): Promise<StallRow | null> {
  return (await db.stall.get(STALL_ID)) ?? null;
}

export async function startSetup(db: FoodooDb): Promise<StallRow> {
  return db.transaction("rw", db.stall, async () => {
    const existing = await db.stall.get(STALL_ID);
    if (existing !== undefined) {
      return existing;
    }
    const stall: StallRow = {
      id: STALL_ID,
      name: "",
      settings: defaultSettings(),
      setupComplete: false,
    };
    await db.stall.put(stall);
    return stall;
  });
}

export async function saveStallName(db: FoodooDb, name: string): Promise<void> {
  const trimmed = name.trim();
  if (trimmed.length > STALL_NAME_MAX_LENGTH) {
    throw new RangeError("Stall name is too long");
  }
  await db.transaction("rw", db.stall, async () => {
    const stall = await requireStall(db);
    await db.stall.put({ ...stall, name: trimmed });
  });
}

export async function saveHours(db: FoodooDb, hours: Hours): Promise<void> {
  const errors = validateHours(hours.openAt, hours.closeAt);
  if (Object.keys(errors).length > 0) {
    throw new RangeError("Invalid opening hours");
  }
  await db.transaction("rw", db.stall, async () => {
    const stall = await requireStall(db);
    await db.stall.put({
      ...stall,
      settings: {
        ...stall.settings,
        openAt: hours.openAt,
        closeAt: hours.closeAt,
        busyProfile: resizeProfile(
          hours.busyProfile,
          hours.openAt,
          hours.closeAt,
        ),
      },
    });
  });
}

export async function completeSetup(db: FoodooDb): Promise<void> {
  await db.transaction("rw", db.stall, db.menus, async () => {
    const stall = await requireStall(db);
    const active = await db.menus.filter((menu) => !menu.archived).count();
    if (active === 0) {
      throw new Error("Setup needs at least one active menu");
    }
    await db.stall.put({ ...stall, setupComplete: true });
  });
}

export async function listMenus(db: FoodooDb): Promise<Menu[]> {
  const menus = await db.menus.toArray();
  return menus.sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveMenu(
  db: FoodooDb,
  input: MenuInput,
  id?: string,
): Promise<Menu> {
  const errors = validateMenu(input);
  if (Object.keys(errors).length > 0) {
    throw new RangeError("Invalid menu");
  }
  return db.transaction("rw", db.menus, async () => {
    const existing = id === undefined ? undefined : await db.menus.get(id);
    if (id !== undefined && existing === undefined) {
      throw new Error(`Menu not found: ${id}`);
    }
    const menu: Menu = {
      id: existing?.id ?? crypto.randomUUID(),
      name: input.name.trim(),
      price: input.price,
      cost: input.cost,
      salvage: input.salvage,
      usualQty: input.usualQty,
      archived: existing?.archived ?? false,
    };
    await db.menus.put(menu);
    return menu;
  });
}

export async function setMenuArchived(
  db: FoodooDb,
  id: string,
  archived: boolean,
): Promise<void> {
  const updated = await db.menus.update(id, { archived });
  if (updated === 0) {
    throw new Error(`Menu not found: ${id}`);
  }
}

export async function getTodayState(
  db: FoodooDb,
  date: ISODate,
): Promise<TodayState> {
  const [day, menuDays] = await Promise.all([
    db.days.get(date),
    db.menuDays.where("date").equals(date).toArray(),
  ]);
  return { day, menuDays };
}

export async function loadDemo(db: FoodooDb, today: ISODate): Promise<void> {
  const records = buildDemoRecords(today);
  await db.transaction("rw", allTables(db), async () => {
    const existing = await db.stall.get(STALL_ID);
    if (existing !== undefined && !existing.settings.isDemo) {
      throw new Error("Your own stall data exists; delete it first");
    }
    await Promise.all(allTables(db).map((table) => table.clear()));
    await db.stall.put(records.stall);
    await db.menus.bulkPut(records.menus);
    await db.days.bulkPut(records.days);
    await db.menuDays.bulkPut(records.menuDays);
  });
}

export async function removeDemo(db: FoodooDb): Promise<void> {
  await db.transaction("rw", allTables(db), async () => {
    const stall = await db.stall.get(STALL_ID);
    if (stall !== undefined && !stall.settings.isDemo) {
      throw new Error("The stored stall is not the demo stall");
    }
    await Promise.all(allTables(db).map((table) => table.clear()));
  });
}

export async function deleteAll(db: FoodooDb): Promise<void> {
  await db.transaction("rw", allTables(db), async () => {
    await Promise.all(allTables(db).map((table) => table.clear()));
  });
}

export async function requestPersistentStorage(
  storage: Pick<StorageManager, "persist" | "persisted"> | undefined,
): Promise<boolean> {
  if (storage === undefined || typeof storage.persist !== "function") {
    return false;
  }
  try {
    if (await storage.persisted()) {
      return true;
    }
    return await storage.persist();
  } catch {
    return false;
  }
}
