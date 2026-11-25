// src/app/App.tsx
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { t } from "../i18n/index.ts";
import { registerPwa } from "./registerPwa.ts";

function Shell() {
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    registerPwa(() => {
      setOfflineReady(true);
    });
  }, []);

  return (
    <main className="page">
      <section className="card">
        <span className="wordmark">{t("app.name")}</span>
        <h1>{t("shell.title")}</h1>
        <p>{t("shell.body")}</p>
        <span className="pill">{t("shell.status")}</span>
        {offlineReady ? <p role="status">{t("shell.offlineReady")}</p> : null}
      </section>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell />} />
    </Routes>
  );
}
