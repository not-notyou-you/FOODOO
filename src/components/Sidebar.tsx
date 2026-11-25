// src/components/Sidebar.tsx
import { useT } from "../i18n/index.ts";
import { Logo } from "./Logo.tsx";
import { NavList } from "./NavList.tsx";
import { LOOP_NAV, SETTINGS_NAV } from "./navItems.ts";

export function Sidebar() {
  const t = useT();
  return (
    <nav className="sidebar" aria-label={t("nav.main")}>
      <Logo width={168} />
      <NavList items={[...LOOP_NAV, SETTINGS_NAV]} className="sidebar__list" />
    </nav>
  );
}
