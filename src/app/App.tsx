// src/app/App.tsx
import { useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useT } from "../i18n/index.ts";
import { ComingSoon } from "../screens/ComingSoon.tsx";
import { Settings } from "../screens/Settings.tsx";
import { SetupHours } from "../screens/SetupHours.tsx";
import { SetupMenus } from "../screens/SetupMenus.tsx";
import { Today } from "../screens/Today.tsx";
import { Welcome } from "../screens/Welcome.tsx";
import { Layout } from "./Layout.tsx";
import { registerPwa } from "./registerPwa.ts";
import { RequireStall } from "./RequireStall.tsx";
import { RootRedirect } from "./RootRedirect.tsx";
import { useToast } from "./toast.ts";

export function App() {
  const t = useT();
  const toast = useToast();

  const announce = useRef(() => {
    toast.show(t("app.offlineReady"));
  });

  useEffect(() => {
    announce.current = () => {
      toast.show(t("app.offlineReady"));
    };
  }, [toast, t]);

  useEffect(() => {
    registerPwa(() => {
      announce.current();
    });
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        {t("app.skip")}
      </a>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/setup/menus"
          element={
            <RequireStall>
              <SetupMenus />
            </RequireStall>
          }
        />
        <Route
          path="/setup/hours"
          element={
            <RequireStall>
              <SetupHours />
            </RequireStall>
          }
        />
        <Route element={<Layout />}>
          <Route path="/today" element={<Today />} />
          <Route path="/plan" element={<ComingSoon title="nav.plan" />} />
          <Route path="/service" element={<ComingSoon title="nav.service" />} />
          <Route path="/close" element={<ComingSoon title="nav.close" />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
