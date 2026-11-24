import type { ReactNode } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
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
            <Link className={layout.iconButton} aria-label="Notifications" href="/notifications"><Bell size={18} /></Link>
            <ProfileMenu />
          </div>
        </header>
        <div className={layout.content}>{children}</div>
      </section>
    </main>
  );
}
