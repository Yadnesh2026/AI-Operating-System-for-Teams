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

type SidebarSection = "overview" | "teams";

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, key: "overview" },
  { label: "My Teams", href: "/teams", icon: UsersRound, key: "teams" },
  { label: "Projects", href: "#", icon: FolderKanban, key: "projects" },
  { label: "My Tasks", href: "#", icon: ClipboardList, key: "tasks", count: "8" },
  { label: "Notifications", href: "#", icon: Bell, key: "notifications", count: "3" },
];

export default function WorkspaceSidebar({ active }: { active: SidebarSection }) {
  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand} aria-label="RedSun home">
        <Image src="/redsun-gradient-orbit-logo.png" alt="RedSun" width={96} height={64} priority className={styles.brandLogo} />
      </Link>
      <button className={styles.workspace}><span className={styles.workspaceIcon}>A</span><span className={styles.workspaceText}><b>Acme Studio</b><small>Free workspace</small></span><ChevronDown size={15} /></button>
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
        <a href="#" className={styles.navItem}><Settings2 size={18} /><span>Settings</span></a>
        <button className={styles.profile}><span className={`${styles.avatar} ${styles.avatarPeach}`}>JD</span><span className={styles.profileText}><b>Jordan Davis</b><small>jordan@acme.co</small></span><MoreHorizontal size={18} /></button>
      </div>
    </aside>
  );
}
