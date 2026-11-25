// src/components/navItems.ts
import type { MessageKey } from "../i18n/index.ts";

export type NavIcon = "today" | "plan" | "service" | "close" | "settings";

export interface NavItem {
  to: string;
  label: MessageKey;
  icon: NavIcon;
  soon: boolean;
}

export const LOOP_NAV: readonly NavItem[] = [
  { to: "/today", label: "nav.today", icon: "today", soon: false },
  { to: "/plan", label: "nav.plan", icon: "plan", soon: true },
  { to: "/service", label: "nav.service", icon: "service", soon: true },
  { to: "/close", label: "nav.close", icon: "close", soon: true },
];

export const SETTINGS_NAV: NavItem = {
  to: "/settings",
  label: "nav.settings",
  icon: "settings",
  soon: false,
};
