"use client";

// Dashboard overview and workspace navigation.
import Link from "next/link";
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import ProfileMenu from "../components/ProfileMenu";
import {
  ArrowRight,
  Bell,
  Check,
  ClipboardList,
  FolderKanban,
  MoreHorizontal,
  Plus,
  UsersRound,
} from "lucide-react";
import styles from "./dashboard.module.css";
import api from "../lib/axios";
import { useEffect, useState } from "react";

// State type of all the components
type Team = {
  _id: string;
  name: string;
};

type Project = {
  _id: string;
  name: string;
  description: string;
  teamId: string;
};

type Task = {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "completed";
  projectId: {
    _id: string;
    name: string;
    teamId?: {
      _id: string;
      name: string;
    };
  };
};

type TeamMembership = {
  _id: string;
  teamId: {
    _id: string;
    name: string;
  };
};

type Notification = {
  _id: string;
  message: string;
  createdAt: string;
};

export default function DashboardPage() {
  // State of team Projects and tasks
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch all the team Project and tasks
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all teams
        const teamResponse = await api.get("/getAllTeams");
        const teamData = teamResponse.data.teams ?? [];

        setTeams(teamData);

        // Fetch my tasks
        const taskResponse = await api.get("/mytasks");
        setTasks(taskResponse.data.tasks ?? []);

        // Fetch project for each team
        const projectResponse = await Promise.all(
          //Promise.all() waits until all those API requests finish.
          teamData.map((team: TeamMembership) => {
            return api.get(`/project/${team.teamId._id}`);
          }),
        );

        console.log("Project Responses:", projectResponse);

        // All the projects comes from all the teams
        const allProjects = projectResponse.flatMap(
          (response) => response.data.projects ?? [],
        );

        setProjects(allProjects);

        // Notfication API
        const notificationResponse = await api.get("/notifications");

        setNotifications(notificationResponse.data.notifications ?? []);
      } catch (err) {
        console.log("Error while fetching", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Calcuate the tasks and data total teams
  const totalTeams = teams.length;

  // Total Active projects
  const totalProjects = projects.length;

  // Open Tasks
  const openTasks = tasks.filter((task) => task.status !== "completed").length;

  // Completed tasks
  const completedTasks = tasks.filter(
    (task) => task.status == "completed",
  ).length;

  // todo tasks
  const todoTasks = tasks.filter((task)=> task.status == "todo").length

  // in Progrees tasks
  const inProgressTasks = tasks.filter((task)=> task.status == "in-progress").length
 

  return (
    <main className={styles.shell}>
      <WorkspaceSidebar active="overview" />
      <section className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.breadcrumb}>
            Workspace <span>/</span> <b>Overview</b>
          </div>
          <div className={styles.topActions}>
            <Link
              className={styles.iconButton}
              aria-label="Notifications"
              href="/notifications"
            >
              <Bell size={18} />
            </Link>
            <ProfileMenu />
          </div>
        </header>
        <div className={styles.content}>
          <div className={styles.greetingRow}>
            <div>
              <h1>
                Welcome to your workspace <span>✦</span>
              </h1>
              <p>
                Your workspace overview will appear here when data is connected.
              </p>
            </div>
            <Link href="/projects" className={styles.primaryButton}>
              <Plus size={17} /> Create new
            </Link>
          </div>

          <section className={styles.stats} aria-label="Workspace statistics">
            <article className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Total teams</span>
                <span className={`${styles.statIcon} ${styles.iconOrange}`}>
                  <UsersRound size={17} />
                </span>
              </div>
              <div className={styles.statValue}>{totalTeams}</div>

              <div className={styles.statFoot}>
                {totalTeams > 0 ? `Teams Available` : "No Teams Available"}
              </div>
            </article>

            <article className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Active projects</span>
                <span className={`${styles.statIcon} ${styles.iconPurple}`}>
                  <FolderKanban size={17} />
                </span>
              </div>
              <div className={styles.statValue}>{totalProjects}</div>
              <div className={styles.statFoot}>
                {projects.length > 0
                  ? "Projects Available"
                  : "No Projects Available"}
              </div>
            </article>
            <article className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Open tasks</span>
                <span className={`${styles.statIcon} ${styles.iconBlue}`}>
                  <ClipboardList size={17} />
                </span>
              </div>
              <div className={styles.statValue}>{openTasks}</div>
              <div className={styles.statFoot}>
                {tasks.length > 0
                  ? "Tasks Available"
                  : "No Open Task Available"}
              </div>
            </article>
            <article className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Completed this week</span>
                <span className={`${styles.statIcon} ${styles.iconGreen}`}>
                  <Check size={17} />
                </span>
              </div>
              <div className={styles.statValue}>{completedTasks}</div>
              <div className={styles.statFoot}>
                {completedTasks > 0 ? "Tasks Available" : "No Tasks Available"}
              </div>
            </article>
          </section>

          <div className={styles.dashboardGrid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>My tasks</h2>
                  <p>Keep an eye on your workload</p>
                </div>
                <Link className={styles.textLink} href="/tasks">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className={styles.taskSummary}>
                <div className={styles.taskMetric}>
                  <span className={`${styles.taskDot} ${styles.dotOrange}`} />{" "}
                  <b>{todoTasks}</b> <span>To do</span>
                </div>
                <div className={styles.taskMetric}>
                  <span className={`${styles.taskDot} ${styles.dotPurple}`} />{" "}
                  <b>{inProgressTasks}</b> <span>In progress</span>
                </div>
                <div className={styles.taskMetric}>
                  <span className={`${styles.taskDot} ${styles.dotGreen}`} />{" "}
                  <b>{completedTasks}</b> <span>Completed</span>
                </div>
              </div>
              <div className={styles.taskList}>
                {tasks.length > 0 ? (
                  tasks.slice(0, 4).map((task) => (
                    <Link
                      key={task._id}
                      className={styles.dashboardItemLink}
                      href={
                        task.projectId.teamId
                          ? `/projects/${task.projectId._id}?teamId=${task.projectId.teamId._id}`
                          : "/tasks"
                      }
                    >
                      <h3>{task.title}</h3>
                      <p>{task.projectId?.name}</p>
                      <span>{task.status}</span>
                    </Link>
                  ))
                ) : (
                  <div className={styles.dashboardEmpty}>
                    {loading
                      ? "Loading your tasks…"
                      : "No tasks assigned to you yet. Tasks assigned to other teammates won’t appear in My tasks."}
                  </div>
                )}
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Recent activity</h2>
                  <p>The latest from your workspace</p>
                </div>
                <button
                  className={styles.moreButton}
                  aria-label="More activity options"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className={styles.activityList}>
                {notifications.length > 0 ? (
                  notifications.slice(0, 4).map((item) => (
                    <Link
                      key={item._id}
                      className={styles.dashboardItemLink}
                      href="/notifications"
                    >
                      <p>{item.message}</p>

                      <small>
                        {new Date(item.createdAt).toLocaleString()}
                      </small>
                    </Link>
                  ))
                ) : (
                  <div className={styles.dashboardEmpty}>
                    {loading
                      ? "Loading recent activity…"
                      : "No recent activity yet."}
                  </div>
                )}
              </div>
              <Link
                className={`${styles.textLink} ${styles.activityLink}`}
                href="/notifications"
              >
                View all activity <ArrowRight size={14} />
              </Link>
            </section>

            <section className={`${styles.panel} ${styles.projectsPanel}`}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Recent projects</h2>
                  <p>Projects you and your team are working on</p>
                </div>
                <Link className={styles.textLink} href="/projects">
                  All projects <ArrowRight size={14} />
                </Link>
              </div>

              {projects.length > 0 ? (
                projects.slice(0, 4).map((project) => (
                  <Link
                    key={project._id}
                    className={styles.dashboardItemLink}
                    href={`/projects/${project._id}?teamId=${project.teamId}`}
                  >
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </Link>
                ))
              ) : (
                <div className={styles.dashboardEmpty}>
                  {loading
                    ? "Loading recent projects…"
                    : "No projects available."}
                </div>
              )}
            </section>

            <section className={styles.notificationCard}>
              <div className={styles.notificationIcon}>
                <Bell size={18} />
              </div>
              <div>
                <span className={styles.noticeLabel}>NOTIFICATIONS</span>
                <h2>
                  {notifications.length > 0
                    ? `${notifications.length} new notifications`
                    : "You're all caught up!"}
                </h2>

                <p>
                  {notifications.length > 0
                    ? "You have new updates from your workspace."
                    : "New updates from your teams will show up here."}
                </p>
                <Link href="/notifications">
                  Go to notifications <ArrowRight size={14} />
                </Link>
              </div>
              <div className={styles.noticeArt}>
                <span />
                <span />
                <span />
              </div>
            </section>
          </div>
          <footer className={styles.footer}>
            Made for teams that move forward <span>✦</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
