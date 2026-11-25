// src/app/RootRedirect.tsx
import { Navigate } from "react-router-dom";
import { useStall } from "../db/hooks.ts";
import { useT } from "../i18n/index.ts";

export function RootRedirect() {
  const t = useT();
  const stall = useStall();
  if (stall === undefined) {
    return <p role="status">{t("app.loading")}</p>;
  }
  return <Navigate to={stall === null ? "/welcome" : "/today"} replace />;
}
