// src/screens/Welcome.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocalStamp } from "../app/clock.ts";
import { useToast } from "../app/toast.ts";
import { Button } from "../components/Button.tsx";
import { LanguageSwitch } from "../components/LanguageSwitch.tsx";
import { Logo } from "../components/Logo.tsx";
import { OfflinePill } from "../components/OfflinePill.tsx";
import { Splash } from "../components/Splash.tsx";
import { useDb, useStall } from "../db/hooks.ts";
import {
  loadDemo,
  requestPersistentStorage,
  startSetup,
} from "../db/repositories.ts";
import { useT } from "../i18n/index.ts";

export function Welcome() {
  const t = useT();
  const db = useDb();
  const toast = useToast();
  const navigate = useNavigate();
  const stall = useStall();
  const { date } = useLocalStamp();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  if (stall === undefined) {
    return <Splash />;
  }
  if (stall !== null && stall.setupComplete) {
    return <Navigate to="/today" replace />;
  }
  const started = stall !== null;

  async function run(action: () => Promise<void>, to: string) {
    setBusy(true);
    setFailed(false);
    try {
      await action();
      navigate(to);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <main id="main" className="welcome" tabIndex={-1}>
      <div className="welcome__card card">
        <Logo width={220} />
        <h1 className="welcome__title">{t("welcome.title")}</h1>
        <p className="welcome__value">{t("app.valueLine")}</p>
        <div className="welcome__actions">
          <Button
            wide
            disabled={busy}
            onClick={() => {
              void run(async () => {
                await startSetup(db);
              }, "/setup/menus");
            }}
          >
            {t(started ? "welcome.continue" : "welcome.start")}
          </Button>
          <Button
            wide
            variant="secondary"
            disabled={busy || started}
            aria-describedby="welcome-demo-note"
            onClick={() => {
              void run(async () => {
                await loadDemo(db, date);
                toast.show(t("settings.data.demoLoaded"));
                void requestPersistentStorage(navigator.storage);
              }, "/today");
            }}
          >
            {t("welcome.demo")}
          </Button>
          <p id="welcome-demo-note" className="field__hint">
            {t(started ? "welcome.demoBlocked" : "welcome.demoNote")}
          </p>
          {failed ? (
            <p className="form__failure" role="alert">
              {t("common.saveFailed")}
            </p>
          ) : null}
        </div>
        <LanguageSwitch />
        <OfflinePill />
      </div>
    </main>
  );
}
