// src/screens/Close.tsx
import { useId, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useToast } from "../app/toast.ts";
import { useStallStamp } from "../app/useStallStamp.ts";
import { Button } from "../components/Button.tsx";
import { CloseRow } from "../components/CloseRow.tsx";
import { CloseSummary } from "../components/CloseSummary.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { Screen } from "../components/Screen.tsx";
import { Sheet } from "../components/Sheet.tsx";
import { SoldOutTimeSheet } from "../components/SoldOutTimeSheet.tsx";
import {
  useDb,
  useHistory,
  useMenus,
  useStall,
  useTodayState,
} from "../db/hooks.ts";
import { closeDay, setSoldOut } from "../db/repositories.ts";
import {
  closeDayRecords,
  incompleteDays,
  missingLeftovers,
  tomorrowPlan,
  validateSoldOutTime,
  withClosedDay,
  type CloseEntry,
} from "../domain/close.ts";
import { isCooked } from "../domain/plan.ts";
import type { HHMM, MenuDay } from "../domain/types.ts";
import { formatLongDate } from "../i18n/format.ts";
import { useI18n, type MessageKey } from "../i18n/index.ts";

export function Close() {
  const { t, language } = useI18n();
  const db = useDb();
  const toast = useToast();
  const stamp = useStallStamp();
  const { date: pastDate } = useParams();
  const isPast = pastDate !== undefined && pastDate !== stamp.date;
  const date = pastDate ?? stamp.date;
  const stall = useStall();
  const menus = useMenus();
  const today = useTodayState(date);
  const history = useHistory();
  const unusualId = useId();
  const [leftovers, setLeftovers] = useState<Record<string, number>>({});
  const [missed, setMissed] = useState<Record<string, HHMM>>({});
  const [unusual, setUnusual] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (
    !stall ||
    menus === undefined ||
    today === undefined ||
    history === undefined
  ) {
    return (
      <Screen title={t("close.title")}>
        <p role="status">{t("app.loading")}</p>
      </Screen>
    );
  }

  if (pastDate !== undefined && !isPast) {
    return <Navigate to="/close" replace />;
  }
  if (
    isPast &&
    !incompleteDays(history.days, history.menuDays, stamp.date).includes(date)
  ) {
    return <Navigate to="/today" replace />;
  }

  const settings = stall.settings;
  const longDate = formatLongDate(date, language);
  const names = new Map(menus.map((menu) => [menu.id, menu.name]));
  const nameOf = (menuId: string) => names.get(menuId) ?? menuId;
  const rows = today.menuDays
    .filter(isCooked)
    .sort((a, b) => nameOf(a.menuId).localeCompare(nameOf(b.menuId)));

  if (rows.length === 0) {
    return (
      <Screen title={t("close.title")}>
        <EmptyState
          title={t("close.notPlannedTitle")}
          body={t("close.notPlannedBody")}
          action={<Button to="/plan">{t("service.planAction")}</Button>}
        />
      </Screen>
    );
  }

  if (today.day?.closed === true) {
    return (
      <Screen title={t("close.title")}>
        <section className="card" aria-labelledby="close-done">
          <h2 id="close-done">{t("close.closedTitle")}</h2>
          {today.day.unusual ? (
            <p className="note note--info">{t("close.unusualNote")}</p>
          ) : null}
          <CloseSummary
            rows={rows}
            menus={menus}
            tomorrow={tomorrowPlan(date, menus, history.menuDays, history.days)}
          />
          <p>{t("close.tomorrowNote")}</p>
        </section>
      </Screen>
    );
  }

  const leftoverOf = (row: MenuDay) => leftovers[row.menuId] ?? null;
  const missedOf = (row: MenuDay) => missed[row.menuId] ?? settings.closeAt;
  const entries: CloseEntry[] = rows.map((row) => {
    if (row.soldOutAt !== null) {
      return { menuId: row.menuId, leftover: 0, soldOutAt: row.soldOutAt };
    }
    const leftover = leftoverOf(row);
    return {
      menuId: row.menuId,
      leftover,
      soldOutAt: leftover === 0 ? missedOf(row) : null,
    };
  });
  const missing = new Set(missingLeftovers(rows, leftovers));
  const errors = new Map(
    rows.flatMap((row) => {
      if (row.soldOutAt !== null || leftoverOf(row) !== 0) {
        return [];
      }
      const error = validateSoldOutTime(missedOf(row), settings);
      return error === null ? [] : [[row.menuId, error] as const];
    }),
  );
  const editRow = rows.find((row) => row.menuId === editing);
  const todayRows = today.menuDays;
  const historyMenuDays = history.menuDays;
  const historyDays = history.days;
  const menuList = menus;

  function preview() {
    const closed = closeDayRecords(date, unusual, todayRows, entries, settings);
    const merged = withClosedDay(historyMenuDays, historyDays, closed);
    return {
      rows: closed.menuDays,
      tomorrow: tomorrowPlan(date, menuList, merged.menuDays, merged.days),
    };
  }

  async function confirm() {
    setBusy(true);
    try {
      await closeDay(db, date, { unusual, entries });
      setConfirming(false);
      toast.show(
        isPast ? t("close.pastClosed", { date: longDate }) : t("close.closed"),
      );
    } catch {
      toast.show(t("common.saveFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function writeTime(
    menuId: string,
    time: HHMM | null,
    message: MessageKey,
  ) {
    try {
      await setSoldOut(db, date, menuId, time);
      setEditing(null);
      toast.show(t(message));
    } catch {
      toast.show(t("common.saveFailed"));
    }
  }

  const sheet = confirming ? preview() : null;

  return (
    <Screen title={t("close.title")}>
      {isPast ? (
        <p className="note note--info">
          {t("close.pastIntro", { date: longDate })}
        </p>
      ) : null}
      <p className="note">{t("close.intro")}</p>
      <ul className="card-grid">
        {rows.map((row) => {
          const error = submitted ? errors.get(row.menuId) : undefined;
          return (
            <CloseRow
              key={row.menuId}
              name={nameOf(row.menuId)}
              cooked={row.cookedQty}
              soldOutAt={row.soldOutAt}
              leftover={leftoverOf(row)}
              leftoverError={
                submitted && missing.has(row.menuId)
                  ? t("close.leftoverMissing")
                  : undefined
              }
              missedTime={missedOf(row)}
              missedError={
                error === undefined
                  ? undefined
                  : t(`soldOut.error.${error}`, {
                      open: settings.openAt,
                      close: settings.closeAt,
                    })
              }
              onLeftover={(value) => {
                setLeftovers((current) => ({
                  ...current,
                  [row.menuId]: value,
                }));
              }}
              onMissedTime={(value) => {
                setMissed((current) => ({ ...current, [row.menuId]: value }));
              }}
              onEditTime={() => {
                setEditing(row.menuId);
              }}
            />
          );
        })}
      </ul>
      <div className="card check">
        <input
          id={unusualId}
          type="checkbox"
          checked={unusual}
          aria-describedby={`${unusualId}-hint`}
          onChange={(event) => {
            setUnusual(event.target.checked);
          }}
        />
        <label htmlFor={unusualId}>{t("close.unusual")}</label>
        <p id={`${unusualId}-hint`} className="field__hint check__hint">
          {t("close.unusualHint")}
        </p>
      </div>
      <div className="action-bar">
        <Button
          wide
          onClick={() => {
            setSubmitted(true);
            if (errors.size === 0 && missing.size === 0) {
              setConfirming(true);
            }
          }}
        >
          {t("close.closeDay")}
        </Button>
      </div>
      {submitted && missing.size > 0 ? (
        <p className="field__error" role="alert">
          {t("close.leftoverMissingSummary", { count: missing.size })}
        </p>
      ) : null}
      {sheet === null ? null : (
        <Sheet
          open
          title={
            isPast
              ? t("close.pastSheetTitle", { date: longDate })
              : t("close.sheetTitle")
          }
          onClose={() => {
            setConfirming(false);
          }}
        >
          {unusual ? (
            <p className="note note--info">{t("close.unusualNote")}</p>
          ) : null}
          <CloseSummary
            rows={sheet.rows}
            menus={menus}
            tomorrow={isPast ? null : sheet.tomorrow}
          />
          <div className="form__actions">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirming(false);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              disabled={busy}
              onClick={() => {
                void confirm();
              }}
            >
              {t("close.confirm")}
            </Button>
          </div>
        </Sheet>
      )}
      {editRow === undefined || editRow.soldOutAt === null ? null : (
        <SoldOutTimeSheet
          menuName={nameOf(editRow.menuId)}
          initial={editRow.soldOutAt}
          settings={settings}
          onSave={(time) => {
            void writeTime(editRow.menuId, time, "service.timeSaved");
          }}
          onClear={() => {
            void writeTime(editRow.menuId, null, "service.cleared");
          }}
          onClose={() => {
            setEditing(null);
          }}
        />
      )}
    </Screen>
  );
}
