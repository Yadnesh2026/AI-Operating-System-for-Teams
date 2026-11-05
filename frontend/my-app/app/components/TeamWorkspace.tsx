import type { ReactNode } from "react";
import { Bell, CircleHelp, Search } from "lucide-react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import layout from "../dashboard/dashboard.module.css";

export default function TeamWorkspace({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className={layout.shell}>
      <WorkspaceSidebar active="teams" />
      <section className={layout.main}>
        <header className={layout.topbar}>
          <div className={layout.breadcrumb}>Workspace <span>/</span> <b>{title}</b></div>
          <div className={layout.topActions}>
            <button className={layout.search}><Search size={16} /><span>Search anything...</span><kbd>⌘ K</kbd></button>
            <button className={layout.iconButton} aria-label="Help"><CircleHelp size={18} /></button>
            <button className={layout.iconButton} aria-label="Notifications"><Bell size={18} /><i /></button>
            <span className={`${layout.avatar} ${layout.avatarPeach}`}>JD</span>
          </div>
        </header>
        <div className={layout.content}>{children}</div>
      </section>
    </main>
  );
}
