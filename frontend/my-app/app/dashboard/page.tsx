// Dashboard overview and workspace navigation.
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CircleHelp,
  ClipboardList,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";
import styles from "./dashboard.module.css";

const projects = [
  { name: "Website redesign", team: "Design team", progress: 72, color: "orange", date: "Nov 18" },
  { name: "Mobile app launch", team: "Product team", progress: 48, color: "purple", date: "Nov 24" },
  { name: "Q4 growth strategy", team: "Marketing team", progress: 86, color: "green", date: "Nov 12" },
];

const activities = [
  { initials: "AM", color: "peach", text: <><strong>Alex Morgan</strong> completed <b>Update homepage wireframes</b></>, time: "12 min ago", mark: "✓" },
  { initials: "JL", color: "blue", text: <><strong>Jamie Lee</strong> created a new project <b>Mobile app launch</b></>, time: "1 hour ago", mark: "+" },
  { initials: "SK", color: "lilac", text: <><strong>Sam Kim</strong> invited you to <b>Product team</b></>, time: "3 hours ago", mark: "↗" },
];

export default function DashboardPage() {
  return (
    <main className={styles.shell}>
      <WorkspaceSidebar active="overview" />

      <section className={styles.main}>
        <header className={styles.topbar}><div className={styles.breadcrumb}>Workspace <span>/</span> <b>Overview</b></div><div className={styles.topActions}><button className={styles.search}><Search size={16} /><span>Search anything...</span><kbd>⌘ K</kbd></button><button className={styles.iconButton} aria-label="Help"><CircleHelp size={18} /></button><button className={styles.iconButton} aria-label="Notifications"><Bell size={18} /><i /></button><span className={`${styles.avatar} ${styles.avatarPeach}`}>JD</span></div></header>
        <div className={styles.content}>
          <div className={styles.greetingRow}><div><div className={styles.date}><CalendarDays size={14} /> Wednesday, November 5, 2026</div><h1>Good morning, Jordan <span>✦</span></h1><p>Here’s what’s happening with your workspace today.</p></div><button className={styles.primaryButton}><Plus size={17} /> Create new</button></div>

          <section className={styles.stats} aria-label="Workspace statistics">
            <article className={styles.statCard}><div className={styles.statTop}><span>Total teams</span><span className={`${styles.statIcon} ${styles.iconOrange}`}><UsersRound size={17} /></span></div><div className={styles.statValue}>4</div><div className={styles.statFoot}><span className={styles.trend}><ArrowUpRight size={13} /> 2</span> <span>from last month</span></div></article>
            <article className={styles.statCard}><div className={styles.statTop}><span>Active projects</span><span className={`${styles.statIcon} ${styles.iconPurple}`}><FolderKanban size={17} /></span></div><div className={styles.statValue}>12</div><div className={styles.statFoot}><span className={styles.trend}><ArrowUpRight size={13} /> 3</span> <span>from last month</span></div></article>
            <article className={styles.statCard}><div className={styles.statTop}><span>Open tasks</span><span className={`${styles.statIcon} ${styles.iconBlue}`}><ClipboardList size={17} /></span></div><div className={styles.statValue}>28</div><div className={styles.statFoot}><span className={styles.downTrend}><ArrowDownRight size={13} /> 12%</span> <span>from last week</span></div></article>
            <article className={styles.statCard}><div className={styles.statTop}><span>Completed this week</span><span className={`${styles.statIcon} ${styles.iconGreen}`}><Check size={17} /></span></div><div className={styles.statValue}>16</div><div className={styles.statFoot}><span className={styles.trend}><ArrowUpRight size={13} /> 8%</span> <span>from last week</span></div></article>
          </section>

          <div className={styles.dashboardGrid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><h2>My tasks</h2><p>Keep an eye on your workload</p></div><a className={styles.textLink} href="#">View all <ArrowRight size={14} /></a></div>
              <div className={styles.taskSummary}><div className={styles.taskMetric}><span className={`${styles.taskDot} ${styles.dotOrange}`} /> <b>8</b> <span>Pending</span></div><div className={styles.taskMetric}><span className={`${styles.taskDot} ${styles.dotPurple}`} /> <b>5</b> <span>In progress</span></div><div className={styles.taskMetric}><span className={`${styles.taskDot} ${styles.dotGreen}`} /> <b>16</b> <span>Completed</span></div></div>
              <div className={styles.taskList}><div className={styles.taskRow}><span className={styles.taskCheck} /><div className={styles.taskTitle}><b>Finalize landing page copy</b><small><span className={styles.miniTag}>Website redesign</span> · Today</small></div><span className={`${styles.priority} ${styles.high}`}>High</span><span className={`${styles.avatar} ${styles.avatarBlue}`}>AM</span></div><div className={styles.taskRow}><span className={`${styles.taskCheck} ${styles.checked}`}><Check size={12} /></span><div className={styles.taskTitle}><b>Review user feedback</b><small><span className={styles.miniTag}>Mobile app launch</span> · Today</small></div><span className={`${styles.priority} ${styles.medium}`}>Medium</span><span className={`${styles.avatar} ${styles.avatarLilac}`}>SK</span></div><div className={styles.taskRow}><span className={styles.taskCheck} /><div className={styles.taskTitle}><b>Prepare sprint planning</b><small><span className={styles.miniTag}>Product team</span> · Tomorrow</small></div><span className={`${styles.priority} ${styles.low}`}>Low</span><span className={`${styles.avatar} ${styles.avatarGreen}`}>JL</span></div></div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}><div><h2>Recent activity</h2><p>The latest from your workspace</p></div><button className={styles.moreButton} aria-label="More activity options"><MoreHorizontal size={18} /></button></div>
              <div className={styles.activityList}>{activities.map((activity, index) => <div className={styles.activityRow} key={index}><span className={`${styles.avatar} ${styles[`avatar${activity.color[0].toUpperCase()}${activity.color.slice(1)}`]}`}>{activity.initials}</span><div className={styles.activityText}><p>{activity.text}</p><small>{activity.time}</small></div><span className={styles.activityMark}>{activity.mark}</span></div>)}</div>
              <a className={`${styles.textLink} ${styles.activityLink}`} href="#">View all activity <ArrowRight size={14} /></a>
            </section>

            <section className={`${styles.panel} ${styles.projectsPanel}`}>
              <div className={styles.panelHeader}><div><h2>Recent projects</h2><p>Projects you and your team are working on</p></div><a className={styles.textLink} href="#">All projects <ArrowRight size={14} /></a></div>
              <div className={styles.projectTable}><div className={styles.projectHeading}><span>PROJECT</span><span>PROGRESS</span><span>DUE DATE</span><span /></div>{projects.map(project => <div className={styles.projectRow} key={project.name}><div className={styles.projectName}><span className={`${styles.projectIcon} ${styles[`project${project.color[0].toUpperCase()}${project.color.slice(1)}`]}`}><FolderKanban size={16} /></span><span><b>{project.name}</b><small>{project.team}</small></span></div><div className={styles.progressCell}><div className={styles.progressTrack}><span className={styles[`progress${project.color[0].toUpperCase()}${project.color.slice(1)}`]} style={{ width: `${project.progress}%` }} /></div><small>{project.progress}%</small></div><span className={styles.dueDate}>{project.date}</span><button className={styles.moreButton} aria-label={`Options for ${project.name}`}><MoreHorizontal size={18} /></button></div>)}</div>
            </section>

            <section className={styles.notificationCard}><div className={styles.notificationIcon}><Bell size={18} /></div><div><span className={styles.noticeLabel}>NOTIFICATIONS</span><h2>You’re all caught up!</h2><p>New updates from your teams will show up here.</p><a href="#">Go to notifications <ArrowRight size={14} /></a></div><div className={styles.noticeArt}><span /><span /><span /></div></section>
          </div>
          <footer className={styles.footer}>Made for teams that move forward <span>✦</span></footer>
        </div>
      </section>
    </main>
  );
}
