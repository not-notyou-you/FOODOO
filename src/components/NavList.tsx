// src/components/NavList.tsx
import { NavLink } from "react-router-dom";
import { useT } from "../i18n/index.ts";
import { NavIconFor } from "./NavIconFor.tsx";
import type { NavItem } from "./navItems.ts";

interface NavListProps {
  items: readonly NavItem[];
  className: string;
}

export function NavList({ items, className }: NavListProps) {
  const t = useT();
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.to}>
          <NavLink to={item.to} className="nav-link">
            <NavIconFor icon={item.icon} />
            <span className="nav-link__label">{t(item.label)}</span>
            {item.soon ? (
              <>
                {" "}
                <span className="nav-link__soon">{t("nav.soon")}</span>
              </>
            ) : null}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
