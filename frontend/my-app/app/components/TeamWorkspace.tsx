import type { ReactNode } from "react";
import { Bell, CircleHelp, Search } from "lucide-react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import ProfileMenu from "./ProfileMenu";
import layout from "../dashboard/dashboard.module.css";

export default function TeamWorkspace({ title, active = "teams", children }: { title: string; active?: "teams" | "projects" | "tasks" | "notifications" | "settings"; children: ReactNode }) {
  return (
    <main className={layout.shell}>
      <WorkspaceSidebar active={active} />
      <section className={layout.main}>
        <header className={layout.topbar}>
          <div className={layout.breadcrumb}>Workspace <span>/</span> <b>{title}</b></div>
          <div className={layout.topActions}>
            <button className={layout.search}><Search size={16} /><span>Search anything...</span><kbd>⌘ K</kbd></button>
            <button className={layout.iconButton} aria-label="Help"><CircleHelp size={18} /></button>
            <button className={layout.iconButton} aria-label="Notifications"><Bell size={18} /><i /></button>
            <ProfileMenu />
          </div>
        </header>
        <div className={layout.content}>{children}</div>
      </section>
    </main>
  );
}
