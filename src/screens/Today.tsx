// src/screens/Today.tsx
import { useLocalStamp } from "../app/clock.ts";
import { Button } from "../components/Button.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { LoopProgress } from "../components/LoopProgress.tsx";
import { Screen } from "../components/Screen.tsx";
import { useMenus, useStall, useTodayState } from "../db/hooks.ts";
import { summarizeDay, todayPhase, type Phase } from "../domain/phase.ts";
import { useT, type MessageKey } from "../i18n/index.ts";

const ACTIONS: Record<Phase, { label: MessageKey; to: string | null }> = {
  plan: { label: "today.action.plan", to: "/plan" },
  service: { label: "today.action.service", to: "/service" },
  close: { label: "today.action.close", to: "/close" },
  done: { label: "today.action.done", to: null },
};

export function Today() {
  const t = useT();
  const { date, time } = useLocalStamp();
  const stall = useStall();
  const menus = useMenus();
  const today = useTodayState(date);

  if (!stall || menus === undefined || today === undefined) {
    return (
      <Screen title={t("today.title")}>
        <p role="status">{t("app.loading")}</p>
      </Screen>
    );
  }

  if (!stall.setupComplete) {
    return (
      <Screen title={t("today.title")}>
        <EmptyState
          title={t("today.empty.setupTitle")}
          body={t("today.empty.setupBody")}
          action={
            <Button to="/setup/menus">{t("today.empty.setupAction")}</Button>
          }
        />
      </Screen>
    );
  }

  const summary = summarizeDay(today.menuDays, today.day);
  const hasActiveMenu = menus.some((menu) => !menu.archived);
  if (!hasActiveMenu && summary.plannedCount === 0) {
    return (
      <Screen title={t("today.title")}>
        <EmptyState
          title={t("today.empty.menusTitle")}
          body={t("today.empty.menusBody")}
          action={
            <Button to="/settings">{t("today.empty.menusAction")}</Button>
          }
        />
      </Screen>
    );
  }

  const phase = todayPhase({
    ...summary,
    time,
    closeAt: stall.settings.closeAt,
  });
  const action = ACTIONS[phase];

  return (
    <Screen title={t("today.title")}>
      <section className="card today">
        <LoopProgress phase={phase} />
        {phase === "done" ? <p>{t("today.doneNote")}</p> : null}
        {action.to === null ? (
          <Button wide disabled>
            {t(action.label)}
          </Button>
        ) : (
          <Button wide to={action.to}>
            {t(action.label)}
          </Button>
        )}
      </section>
      <section className="counts" aria-labelledby="today-counts">
        <h2 id="today-counts">{t("today.counts.title")}</h2>
        <dl className="counts__grid">
          <div className="counts__item">
            <dt>{t("today.counts.portions")}</dt>
            <dd className="num">{summary.portions}</dd>
          </div>
          <div className="counts__item">
            <dt>{t("today.counts.soldOut")}</dt>
            <dd className="num">{summary.soldOutCount}</dd>
          </div>
          <div className="counts__item">
            <dt>{t("today.counts.closed")}</dt>
            <dd className="num">
              {t(summary.closed ? "common.yes" : "common.no")}
            </dd>
          </div>
        </dl>
      </section>
    </Screen>
  );
}
