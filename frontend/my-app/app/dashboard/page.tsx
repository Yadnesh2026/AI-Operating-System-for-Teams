"use client"

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
  Search,
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
};

type Task = {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "completed";
  projectId: {
    _id: string;
    name: string;
  };
};

type TeamMembership = {
  _id: string;
  teamId: {
    _id: string;
    name: string;
  };
};






export default function DashboardPage() {

  // State of team Projects and tasks 
const [teams, setTeams] = useState<Team[]>([]);
const [projects, setProjects] = useState<Project[]>([]);
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(true);


// Fetch all the team Project and tasks
useEffect(()=>{
  async function fetchDashboardData() {
    try{
      // Fetch all teams
      const teamResponse = await api.get("/getAllTeams");
      const teamData = teamResponse.data.teams ?? [];

      setTeams(teamData)

      // Fetch my tasks
      const taskResponse = await api.get("/mytasks");
      setTasks(taskResponse.data.tasks ?? [])

      // Fetch project for each team
      const projectResponse = await Promise.all(  //Promise.all() waits until all those API requests finish.
        teamData.map((team: TeamMembership)=>{
          api.get(`/project/${team.teamId._id}`)
        })
      )

      console.log("Project Responses:", projectResponses)
      
      // All the projects comes from all the teams
      const allProjects = projectResponse.flatMap(
        (response)=> response.data.projects ?? []
      )

      setProjects(allProjects)


    }catch(err){
      console.log("Error while fetching",err)
    }finally{
      setLoading(false);
    }
  }

  fetchDashboardData()
},[])

  return (
    <main className={styles.shell}>
      <WorkspaceSidebar active="overview" />
      <section className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.breadcrumb}>
            Workspace <span>/</span> <b>Overview</b>
          </div>
          <div className={styles.topActions}>
            <button className={styles.search}>
              <Search size={16} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
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
              <div className={styles.statValue}>0</div>
              <div className={styles.statFoot}>No team data yet</div>
            </article>
            <article className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Active projects</span>
                <span className={`${styles.statIcon} ${styles.iconPurple}`}>
                  <FolderKanban size={17} />
                </span>
              </div>
              <div className={styles.statValue}>0</div>
              <div className={styles.statFoot}>No project data yet</div>
            </article>
            <article className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Open tasks</span>
                <span className={`${styles.statIcon} ${styles.iconBlue}`}>
                  <ClipboardList size={17} />
                </span>
              </div>
              <div className={styles.statValue}>0</div>
              <div className={styles.statFoot}>No task data yet</div>
            </article>
            <article className={styles.statCard}>
              <div className={styles.statTop}>
                <span>Completed this week</span>
                <span className={`${styles.statIcon} ${styles.iconGreen}`}>
                  <Check size={17} />
                </span>
              </div>
              <div className={styles.statValue}>0</div>
              <div className={styles.statFoot}>No completion data yet</div>
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
                  <b>0</b> <span>To do</span>
                </div>
                <div className={styles.taskMetric}>
                  <span className={`${styles.taskDot} ${styles.dotPurple}`} />{" "}
                  <b>0</b> <span>In progress</span>
                </div>
                <div className={styles.taskMetric}>
                  <span className={`${styles.taskDot} ${styles.dotGreen}`} />{" "}
                  <b>0</b> <span>Completed</span>
                </div>
              </div>
              <div className={styles.taskList}>
                <div className={styles.dashboardEmpty}>
                  No tasks assigned yet.
                </div>
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
                <div className={styles.dashboardEmpty}>
                  No recent activity yet.
                </div>
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
              <div className={styles.projectTable}>
                <div className={styles.projectHeading}>
                  <span>PROJECT</span>
                  <span>PROGRESS</span>
                  <span>DUE DATE</span>
                  <span />
                </div>
                <div className={styles.dashboardEmpty}>
                  No projects available.
                </div>
              </div>
            </section>

            <section className={styles.notificationCard}>
              <div className={styles.notificationIcon}>
                <Bell size={18} />
              </div>
              <div>
                <span className={styles.noticeLabel}>NOTIFICATIONS</span>
                <h2>You’re all caught up!</h2>
                <p>New updates from your teams will show up here.</p>
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
