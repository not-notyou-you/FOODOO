// src/components/NavIconFor.tsx
import { CloseIcon } from "./icons/CloseIcon.tsx";
import { PlanIcon } from "./icons/PlanIcon.tsx";
import { ServiceIcon } from "./icons/ServiceIcon.tsx";
import { SettingsIcon } from "./icons/SettingsIcon.tsx";
import { TodayIcon } from "./icons/TodayIcon.tsx";
import type { NavIcon } from "./navItems.ts";

interface NavIconForProps {
  icon: NavIcon;
}

export function NavIconFor({ icon }: NavIconForProps) {
  switch (icon) {
    case "today":
      return <TodayIcon />;
    case "plan":
      return <PlanIcon />;
    case "service":
      return <ServiceIcon />;
    case "close":
      return <CloseIcon />;
    case "settings":
      return <SettingsIcon />;
  }
}
