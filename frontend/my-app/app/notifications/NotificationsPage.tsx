"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, Check, CheckCheck, FolderKanban, Settings2, UsersRound, ClipboardCheck, UserPlus, X } from "lucide-react";
import styles from "./notifications.module.css";

type NotificationType = "assigned" | "completed" | "employee" | "project" | "team";
type Notice = { id: string; type: NotificationType; title: string; message: string; related: string; time: string; href: string; read: boolean };
type Filter = "All" | "Unread" | "Read";
const storageKey = "redsun-notifications-v2";
const initialNotices: Notice[] = [];
const filters: Filter[] = ["All", "Unread", "Read"];

const iconMap = { assigned: ClipboardCheck, completed: CheckCheck, employee: UserPlus, project: FolderKanban, team: UsersRound };

export default function NotificationsPage() {
  const [notices, setNotices] = useState(initialNotices);
  const [filter, setFilter] = useState<Filter>("All");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try { setNotices(JSON.parse(saved) as Notice[]); } catch { window.localStorage.removeItem(storageKey); }
    }
    const savedSettings = window.localStorage.getItem("redsun-notifications-settings-v2");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as { emailUpdates?: boolean; inAppAlerts?: boolean };
        if (typeof parsed.emailUpdates === "boolean") setEmailUpdates(parsed.emailUpdates);
        if (typeof parsed.inAppAlerts === "boolean") setInAppAlerts(parsed.inAppAlerts);
      } catch { window.localStorage.removeItem("redsun-notifications-settings-v2"); }
    }
    setLoaded(true);
  }, []);

  const unreadCount = notices.filter((notice) => !notice.read).length;
  const visibleNotices = useMemo(() => notices.filter((notice) => filter === "All" || (filter === "Unread" ? !notice.read : notice.read)), [filter, notices]);

  function updateNotices(next: Notice[]) {
    setNotices(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function markAllRead() { updateNotices(notices.map((notice) => ({ ...notice, read: true }))); }
  function markRead(id: string) { updateNotices(notices.map((notice) => notice.id === id ? { ...notice, read: true } : notice)); }
  function saveSettings() {
    window.localStorage.setItem("redsun-notifications-settings-v2", JSON.stringify({ emailUpdates, inAppAlerts }));
    setSettingsOpen(false);
  }

  if (!loaded) return <main className={styles.page} aria-busy="true" />;

  return <main className={styles.page}>
    <header className={styles.pageHeading}><div><span className={styles.eyebrow}>Workspace</span><h1>Notifications{unreadCount > 0 && <span className={styles.unreadCount}>{unreadCount} new</span>}</h1><p>Stay up to date with your tasks, projects, and teams.</p></div><div className={styles.headerActions}><button className={styles.settingsButton} onClick={() => setSettingsOpen(true)}><Settings2 size={16} />Notification settings</button><button className={styles.markAllButton} onClick={markAllRead} disabled={unreadCount === 0}><CheckCheck size={16} />Mark all as read</button></div></header>

    <section className={styles.noticePanel}>
      <div className={styles.toolbar}><div className={styles.filters} role="tablist" aria-label="Filter notifications">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>{item}<span>{item === "All" ? notices.length : item === "Unread" ? unreadCount : notices.length - unreadCount}</span></button>)}</div><span className={styles.activityLabel}><Bell size={14} />Recent activity</span></div>

      <div className={styles.noticeList}>{visibleNotices.length ? visibleNotices.map((notice) => {
        const Icon = iconMap[notice.type];
        return <article className={`${styles.noticeRow} ${notice.read ? styles.read : styles.unread}`} key={notice.id}>
          <Link href={notice.href} className={styles.noticeLink} onClick={() => { if (!notice.read) markRead(notice.id); }}>
            <span className={`${styles.noticeIcon} ${styles[`icon${notice.type}`]}`}><Icon size={18} /></span>
            <span className={styles.noticeContent}><span className={styles.noticeTitle}>{notice.title}</span><span className={styles.message}>{notice.message}</span><span className={styles.related}>{notice.type === "project" ? <FolderKanban size={12} /> : <UsersRound size={12} />}{notice.related}</span></span>
            <span className={styles.noticeTime}>{notice.time}</span>
          </Link>
          <div className={styles.noticeActions}>{!notice.read && <span className={styles.unreadDot} aria-label="Unread" title="Unread" />}<button className={styles.readButton} onClick={() => markRead(notice.id)} aria-label={notice.read ? "Already read" : "Mark as read"} title={notice.read ? "Read" : "Mark as read"} disabled={notice.read}>{notice.read ? <Check size={15} /> : <span />}</button></div>
        </article>;
      }) : <div className={styles.empty}><span><Bell size={22} /></span><h2>{filter === "All" || filter === "Unread" ? "You’re all caught up!" : "No read notifications"}</h2><p>{filter === "All" || filter === "Unread" ? "New updates from your teams will show up here." : "Read notifications will appear here."}</p></div>}</div>
    </section>

    {settingsOpen && <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}><section className={styles.settingsModal} role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className={styles.modalHeader}><div><span className={styles.modalIcon}><Settings2 size={17} /></span><h2 id="settings-title">Notification settings</h2><p>Choose how you’d like to receive workspace updates.</p></div><button className={styles.closeButton} aria-label="Close settings" onClick={() => setSettingsOpen(false)}><X size={18} /></button></div><div className={styles.preferenceList}><label><span><b>In-app notifications</b><small>Show updates in your RedSun workspace.</small></span><input type="checkbox" checked={inAppAlerts} onChange={(event) => setInAppAlerts(event.target.checked)} /></label><label><span><b>Email notifications</b><small>Receive important updates by email.</small></span><input type="checkbox" checked={emailUpdates} onChange={(event) => setEmailUpdates(event.target.checked)} /></label></div><div className={styles.modalActions}><button className={styles.cancelButton} onClick={() => setSettingsOpen(false)}>Cancel</button><button className={styles.saveButton} onClick={saveSettings}>Save settings</button></div></section></div>}
  </main>;
}
