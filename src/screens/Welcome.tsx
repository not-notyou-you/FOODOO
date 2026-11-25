// src/screens/Welcome.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocalStamp } from "../app/clock.ts";
import { DEMO_SCENARIO } from "../app/demoConfig.ts";
import { useToast } from "../app/toast.ts";
import { Button } from "../components/Button.tsx";
import { EstimateValue } from "../components/EstimateValue.tsx";
import { FeatureCard } from "../components/FeatureCard.tsx";
import { ClockIcon } from "../components/icons/ClockIcon.tsx";
import { CloseIcon } from "../components/icons/CloseIcon.tsx";
import { EyeOffIcon } from "../components/icons/EyeOffIcon.tsx";
import { LockIcon } from "../components/icons/LockIcon.tsx";
import { PlanIcon } from "../components/icons/PlanIcon.tsx";
import { PotIcon } from "../components/icons/PotIcon.tsx";
import { ServiceIcon } from "../components/icons/ServiceIcon.tsx";
import { TodayIcon } from "../components/icons/TodayIcon.tsx";
import { WifiOffIcon } from "../components/icons/WifiOffIcon.tsx";
import { LanguageSwitch } from "../components/LanguageSwitch.tsx";
import { Logo } from "../components/Logo.tsx";
import { OfflinePill } from "../components/OfflinePill.tsx";
import { Splash } from "../components/Splash.tsx";
import { Sticker } from "../components/Sticker.tsx";
import { useDb, useStall } from "../db/hooks.ts";
import {
  loadDemo,
  requestPersistentStorage,
  startSetup,
} from "../db/repositories.ts";
import { EXAMPLE_MENU, workedExample } from "../domain/explain.ts";
import { useT } from "../i18n/index.ts";

const example = workedExample();

interface WelcomeProps {
  about?: boolean;
}

export function Welcome({ about = false }: WelcomeProps) {
  const demoScenario = DEMO_SCENARIO;
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
  const complete = stall !== null && stall.setupComplete;
  if (complete && !about) {
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

  function startButton(label: string) {
    return (
      <Button
        wide
        disabled={busy}
        onClick={() => {
          void run(async () => {
            await startSetup(db);
          }, "/setup/menus");
        }}
      >
        {label}
      </Button>
    );
  }

  const actions = complete ? (
    <div className="landing__actions">
      <Button wide to="/today">
        {t("how.back")}
      </Button>
    </div>
  ) : (
    <div className="landing__actions">
      {startButton(t(started ? "welcome.continue" : "welcome.start"))}
      {demoScenario === null ? null : (
        <>
          <Button
            wide
            variant="secondary"
            disabled={busy || started}
            aria-describedby="welcome-demo-note"
            onClick={() => {
              void run(async () => {
                await loadDemo(db, date, demoScenario);
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
        </>
      )}
      {failed ? (
        <p className="form__failure" role="alert">
          {t("common.saveFailed")}
        </p>
      ) : null}
    </div>
  );

  return (
    <main id="main" className="landing" tabIndex={-1}>
      <header className="landing__top">
        <Logo width={84} />
        <LanguageSwitch />
      </header>

      <section className="landing__hero" aria-labelledby="landing-title">
        <h1 id="landing-title" className="landing__headline">
          {t("landing.headline")} {t("landing.headlineAccent")}
        </h1>
        <p className="landing__lead">{t("app.valueLine")}</p>
        {actions}
        <ul className="landing__pills">
          <li className="pill">{t("landing.pillOffline")}</li>
          <li className="pill">{t("landing.pillNoAccount")}</li>
          <li className="pill">{t("landing.pillLocal")}</li>
        </ul>
        <OfflinePill />
      </section>

      <section className="landing__section" aria-labelledby="landing-problem">
        <h2 id="landing-problem">{t("landing.problemTitle")}</h2>
        <ul className="landing__grid">
          <FeatureCard
            icon={<PotIcon />}
            title={t("landing.problemWasteTitle")}
            body={t("landing.problemWasteBody")}
          />
          <FeatureCard
            icon={<ClockIcon />}
            title={t("landing.problemEarlyTitle")}
            body={t("landing.problemEarlyBody")}
          />
          <FeatureCard
            icon={<EyeOffIcon />}
            title={t("landing.problemHiddenTitle")}
            body={t("landing.problemHiddenBody")}
          />
        </ul>
      </section>

      <section className="landing__section" aria-labelledby="landing-loop">
        <h2 id="landing-loop">{t("landing.loopTitle")}</h2>
        <ol className="landing__grid">
          <FeatureCard
            step={1}
            icon={<PlanIcon />}
            title={t("landing.loopPlanTitle")}
            body={t("landing.loopPlanBody")}
          />
          <FeatureCard
            step={2}
            icon={<ServiceIcon />}
            title={t("landing.loopServiceTitle")}
            body={t("landing.loopServiceBody")}
          />
          <FeatureCard
            step={3}
            icon={<CloseIcon />}
            title={t("landing.loopCloseTitle")}
            body={t("landing.loopCloseBody")}
          />
          <FeatureCard
            step={4}
            icon={<TodayIcon />}
            title={t("landing.loopNextTitle")}
            body={t("landing.loopNextBody")}
          />
        </ol>
      </section>

      <section className="landing__section" aria-labelledby="landing-example">
        <h2 id="landing-example">{t("landing.exampleTitle")}</h2>
        <div className="card landing__example">
          <div className="landing__example-head">
            <strong>{EXAMPLE_MENU.name}</strong>
            <Sticker>{t("landing.exampleBadge")}</Sticker>
          </div>
          <dl className="landing__example-rows">
            <div>
              <dt>{t("landing.exampleCooked")}</dt>
              <dd className="num">{example.cooked}</dd>
            </div>
            <div>
              <dt>{t("landing.exampleSoldOut")}</dt>
              <dd className="num">{example.soldOutAt}</dd>
            </div>
            <div>
              <dt>{t("close.wanted")}</dt>
              <dd>
                <EstimateValue demand={example.demand} isEstimate />
              </dd>
            </div>
          </dl>
          <Button variant="secondary" to="/how">
            {t("settings.about.how")}
          </Button>
        </div>
      </section>

      <section className="landing__section" aria-labelledby="landing-why">
        <h2 id="landing-why">{t("landing.whyTitle")}</h2>
        <ul className="landing__grid">
          <FeatureCard
            icon={<EyeOffIcon />}
            title={t("landing.whyHiddenTitle")}
            body={t("landing.whyHiddenBody")}
          />
          <FeatureCard
            icon={<PlanIcon />}
            title={t("landing.whyRulesTitle")}
            body={t("landing.whyRulesBody")}
          />
          <FeatureCard
            icon={<WifiOffIcon />}
            title={t("landing.whyOfflineTitle")}
            body={t("landing.whyOfflineBody")}
          />
          <FeatureCard
            icon={<LockIcon />}
            title={t("landing.whyPrivateTitle")}
            body={t("landing.whyPrivateBody")}
          />
        </ul>
      </section>

      <section
        className="landing__section landing__closing"
        aria-labelledby="landing-closing"
      >
        <h2 id="landing-closing">{t("landing.closingTitle")}</h2>
        <p>{t("landing.closingBody")}</p>
        <p className="field__hint">{t("landing.installHint")}</p>
      </section>
    </main>
  );
}
