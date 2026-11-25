// src/app/Layout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar.tsx";
import { TabBar } from "../components/TabBar.tsx";
import { RequireStall } from "./RequireStall.tsx";

export function Layout() {
  return (
    <RequireStall>
      <div className="layout">
        <Sidebar />
        <div className="layout__content">
          <Outlet />
        </div>
        <TabBar />
      </div>
    </RequireStall>
  );
}
