import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  MoreHorizontal,
  Settings2,
  UsersRound,
  ChevronDown,
  CircleHelp,
  ArrowRight,
} from "lucide-react";
import styles from "../dashboard/dashboard.module.css";

type SidebarSection = "overview" | "teams" | "projects" | "tasks" | "notifications" | "settings";

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, key: "overview" },
  { label: "My Teams", href: "/teams", icon: UsersRound, key: "teams" },
  { label: "Projects", href: "/projects", icon: FolderKanban, key: "projects" },
  { label: "My Tasks", href: "/tasks", icon: ClipboardList, key: "tasks" },
  { label: "Notifications", href: "/notifications", icon: Bell, key: "notifications" },
];

export default function WorkspaceSidebar({ active }: { active: SidebarSection }) {
  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand} aria-label="RedSun home">
        <Image src="/redsun-gradient-orbit-logo.png" alt="RedSun" width={96} height={64} priority className={styles.brandLogo} />
      </Link>
      <button className={styles.workspace}><span className={styles.workspaceIcon}>W</span><span className={styles.workspaceText}><b>Workspace</b><small>Connect workspace data</small></span><ChevronDown size={15} /></button>
      <div className={styles.navLabel}>WORKSPACE</div>
      <nav className={styles.nav} aria-label="Main navigation">
        {items.map(({ label, href, icon: Icon, key, count }) => (
          <Link key={key} href={href} className={`${styles.navItem} ${active === key ? styles.active : ""}`} aria-current={active === key ? "page" : undefined}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <small>{count}</small>}
          </Link>
        ))}
      </nav>
      <div className={styles.sidebarBottom}>
        <div className={styles.helpCard}><span className={styles.helpIcon}><CircleHelp size={16} /></span><b>Need a hand?</b><p>Visit our help center to learn more.</p><a href="#">Explore help center <ArrowRight size={13} /></a></div>
        <Link href="/settings" className={`${styles.navItem} ${active === "settings" ? styles.active : ""}`} aria-current={active === "settings" ? "page" : undefined}><Settings2 size={18} /><span>Settings</span></Link>
        <Link href="/settings" className={styles.profile}><span className={`${styles.avatar} ${styles.avatarPeach}`}>?</span><span className={styles.profileText}><b>Your profile</b><small>Account not connected</small></span><MoreHorizontal size={18} /></Link>
      </div>
    </aside>
  );
}
