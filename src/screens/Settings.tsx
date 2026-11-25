// src/screens/Settings.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStamp } from "../app/clock.ts";
import { useToast } from "../app/toast.ts";
import { Button } from "../components/Button.tsx";
import { HoursEditor } from "../components/HoursEditor.tsx";
import { LanguageSwitch } from "../components/LanguageSwitch.tsx";
import { MenuManager } from "../components/MenuManager.tsx";
import { Screen } from "../components/Screen.tsx";
import { Sheet } from "../components/Sheet.tsx";
import { StorageStatus } from "../components/StorageStatus.tsx";
import { TextField } from "../components/TextField.tsx";
import { useDb, useStall } from "../db/hooks.ts";
import {
  deleteAll,
  hoursOf,
  loadDemo,
  removeDemo,
  saveHours,
  saveStallName,
  STALL_NAME_MAX_LENGTH,
  type Hours,
} from "../db/repositories.ts";
import { validateHours, type HoursErrors } from "../domain/setup.ts";
import { useT } from "../i18n/index.ts";

export const README_URL = "https://github.com/not-notyou-you/FOODOO#readme";

type Confirm = "delete" | "removeDemo" | null;

export function Settings() {
  const t = useT();
  const db = useDb();
  const toast = useToast();
  const navigate = useNavigate();
  const stall = useStall();
  const { date } = useLocalStamp();
  const [name, setName] = useState<string | null>(null);
  const [hoursDraft, setHoursDraft] = useState<Hours | null>(null);
  const [hoursSubmitted, setHoursSubmitted] = useState(false);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [busy, setBusy] = useState(false);

  if (!stall) {
    return (
      <Screen title={t("settings.title")}>
        <p role="status">{t("app.loading")}</p>
      </Screen>
    );
  }

  const isDemo = stall.settings.isDemo;
  const nameValue = name ?? stall.name;
  const nameError =
    nameValue.trim().length > STALL_NAME_MAX_LENGTH
      ? t("settings.stall.nameError")
      : undefined;
  const hours = hoursDraft ?? hoursOf(stall.settings);
  const hoursErrors: HoursErrors = hoursSubmitted
    ? validateHours(hours.openAt, hours.closeAt)
    : {};

  async function attempt(action: () => Promise<void>, success: string) {
    try {
      await action();
      toast.show(success);
    } catch {
      toast.show(t("common.saveFailed"));
    }
  }

  function onSaveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (nameError !== undefined) {
      return;
    }
    void attempt(
      () => saveStallName(db, nameValue),
      t("settings.stall.nameSaved"),
    );
  }

  function onSaveHours(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHoursSubmitted(true);
    if (Object.keys(validateHours(hours.openAt, hours.closeAt)).length > 0) {
      return;
    }
    void attempt(async () => {
      await saveHours(db, hours);
      setHoursDraft(null);
      setHoursSubmitted(false);
    }, t("hours.saved"));
  }

  async function wipe(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
      setConfirm(null);
      navigate("/welcome", { replace: true });
    } catch {
      toast.show(t("common.saveFailed"));
      setBusy(false);
    }
  }

  return (
    <Screen title={t("settings.title")}>
      <section className="card settings-section" aria-labelledby="set-stall">
        <h2 id="set-stall">{t("settings.stall.title")}</h2>
        <form className="form form--inline" noValidate onSubmit={onSaveName}>
          <TextField
            label={t("settings.stall.name")}
            value={nameValue}
            onChange={setName}
            error={nameError}
            autoComplete="off"
          />
          <Button type="submit" variant="secondary">
            {t("common.save")}
          </Button>
        </form>
        <h3>{t("settings.menus.title")}</h3>
        <MenuManager showSalvage />
        <h3>{t("settings.hours.title")}</h3>
        <form className="form" noValidate onSubmit={onSaveHours}>
          <HoursEditor
            value={hours}
            errors={hoursErrors}
            onChange={setHoursDraft}
          />
          <Button type="submit" variant="secondary">
            {t("settings.hours.save")}
          </Button>
        </form>
      </section>

      <section className="card settings-section" aria-labelledby="set-lang">
        <h2 id="set-lang">{t("settings.language.title")}</h2>
        <LanguageSwitch />
      </section>

      <section className="card settings-section" aria-labelledby="set-data">
        <h2 id="set-data">{t("settings.data.title")}</h2>
        <p>{t("settings.data.onDevice")}</p>
        <StorageStatus />
        <div className="settings-actions">
          {isDemo ? (
            <>
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  void attempt(
                    () => loadDemo(db, date),
                    t("settings.data.demoLoaded"),
                  );
                }}
              >
                {t("settings.data.resetDemo")}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setConfirm("removeDemo");
                }}
              >
                {t("settings.data.removeDemo")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                disabled
                aria-describedby="set-demo-blocked"
              >
                {t("settings.data.loadDemo")}
              </Button>
              <p id="set-demo-blocked" className="field__hint">
                {t("settings.data.loadDemoBlocked")}
              </p>
            </>
          )}
          <Button
            variant="danger"
            onClick={() => {
              setConfirm("delete");
            }}
          >
            {t("settings.data.deleteAll")}
          </Button>
        </div>
      </section>

      <section className="card settings-section" aria-labelledby="set-about">
        <h2 id="set-about">{t("settings.about.title")}</h2>
        <p>{t("settings.about.version", { version: __APP_VERSION__ })}</p>
        <p>{t("settings.about.body")}</p>
        <p>
          <Link className="link-target" to="/how">
            {t("settings.about.how")}
          </Link>
        </p>
        <a
          className="link-target"
          href={README_URL}
          target="_blank"
          rel="noreferrer"
        >
          {t("settings.about.link")}
        </a>
      </section>

      <Sheet
        open={confirm !== null}
        title={t(
          confirm === "removeDemo"
            ? "settings.removeDemo.title"
            : "settings.delete.title",
        )}
        onClose={() => {
          setConfirm(null);
        }}
      >
        <p>
          {t(
            confirm === "removeDemo"
              ? "settings.removeDemo.body"
              : "settings.delete.body",
          )}
        </p>
        <div className="form__actions">
          <Button
            variant="secondary"
            onClick={() => {
              setConfirm(null);
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => {
              void wipe(() =>
                confirm === "removeDemo" ? removeDemo(db) : deleteAll(db),
              );
            }}
          >
            {t(
              confirm === "removeDemo"
                ? "settings.removeDemo.confirm"
                : "settings.delete.confirm",
            )}
          </Button>
        </div>
      </Sheet>
    </Screen>
  );
}
