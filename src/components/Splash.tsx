// src/components/Splash.tsx
import { useT } from "../i18n/index.ts";
import { Logo } from "./Logo.tsx";

export function Splash() {
  const t = useT();
  return (
    <main id="main" className="welcome" tabIndex={-1}>
      <div className="welcome__card card">
        <Logo width={220} />
        <p className="welcome__value">{t("app.valueLine")}</p>
        <p role="status" className="visually-hidden">
          {t("app.loading")}
        </p>
      </div>
    </main>
  );
}
