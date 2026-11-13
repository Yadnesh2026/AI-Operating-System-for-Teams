"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, ClipboardList, ListTodo, Search, UserRound } from "lucide-react";
import type { Project } from "../projects/projectData";
import { seedTasks, taskStorageKey, type TaskCardData, type TaskCardStatus } from "../projects/taskData";
import type { Team } from "../teams/teamData";
import api from "../lib/axios";
import styles from "./tasks.module.css";

type Filter = "All" | TaskCardStatus;
type AssignedTask = TaskCardData & { projectId: string; projectName: string; assignedBy: string };
const filters: Filter[] = ["All", "To do", "In progress", "Completed"];
const labelStatus: Record<TaskCardStatus, string> = { "To do": "To Do", "In progress": "In Progress", Completed: "Completed" };

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let userName = "";
    const profile = window.localStorage.getItem("redsun-settings-v2");
    if (profile) {
      try {
        userName = (JSON.parse(profile) as { name?: string }).name?.trim() ?? "";
      } catch { window.localStorage.removeItem("redsun-settings-v2"); }
    }
    async function loadAssignedTasks() {
      try {
        const teamsResponse = await api.get("/getAllTeams");
        const teams = (teamsResponse.data.teams ?? [])
          .map((membership: { teamId: Team | string }) => membership.teamId)
          .filter((item: Team | string): item is Team => typeof item !== "string");
        const projectGroups = await Promise.all(teams.map(async (team) => {
          const response = await api.get(`/project/${team._id}`);
          return { team, projects: (response.data.projects ?? []) as Project[] };
        }));
        const assigned: AssignedTask[] = [];
        for (const { team, projects } of projectGroups) {
          for (const project of projects) {
            let projectTasks = seedTasks[project._id] ?? [];
            const stored = window.localStorage.getItem(taskStorageKey(project._id));
            if (stored) {
              try { projectTasks = JSON.parse(stored) as TaskCardData[]; } catch { /* Keep an empty list when local task data is invalid. */ }
            }
            for (const task of projectTasks) {
              if (userName && task.assignee === userName) assigned.push({ ...task, projectId: project._id, projectName: project.name, assignedBy: team.name });
            }
          }
        }
        setTasks(assigned);
      } catch (error) {
        console.error("Could not load assigned tasks", error);
      } finally {
        setLoaded(true);
      }
    }
    void loadAssignedTasks();
  }, []);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "All" || task.status === filter;
    const matchesSearch = `${task.title} ${task.description} ${task.projectName} ${task.assignedBy}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  }), [filter, query, tasks]);

  const count = (status: TaskCardStatus) => tasks.filter((task) => task.status === status).length;

  function updateStatus(taskId: string, projectId: string, status: TaskCardStatus) {
    setTasks((current) => current.map((task) => task.id === taskId && task.projectId === projectId ? { ...task, status } : task));
    const stored = window.localStorage.getItem(taskStorageKey(projectId));
    const source = stored ? JSON.parse(stored) as TaskCardData[] : seedTasks[projectId] ?? [];
    const next = source.map((task) => task.id === taskId ? { ...task, status } : task);
    window.localStorage.setItem(taskStorageKey(projectId), JSON.stringify(next));
  }

  if (!loaded) return <main className={styles.page} aria-busy="true" />;

  return <main className={styles.page}>
    <header className={styles.pageHeading}><div><span className={styles.eyebrow}>Workspace</span><h1>My Tasks</h1><p>Track and manage your assigned work.</p></div><label className={styles.search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" /></label></header>

    <section className={styles.stats} aria-label="Task statistics">
      <article><span className={styles.statIcon}><ClipboardList size={19} /></span><div><b>{tasks.length}</b><span>Total tasks</span></div></article>
      <article><span className={styles.statIcon}><Clock3 size={19} /></span><div><b>{count("To do")}</b><span>To Do</span></div></article>
      <article><span className={styles.statIcon}><ListTodo size={19} /></span><div><b>{count("In progress")}</b><span>In Progress</span></div></article>
      <article><span className={`${styles.statIcon} ${styles.success}`}><Check size={19} /></span><div><b>{count("Completed")}</b><span>Completed</span></div></article>
    </section>

    <section className={styles.taskSection}>
      <div className={styles.sectionHeader}><div><h2>Your assigned tasks</h2><p>Tasks assigned to you across your projects.</p></div></div>
      <div className={styles.toolbar}><div className={styles.filters} role="tablist" aria-label="Filter tasks">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>{item === "To do" ? "To Do" : item === "In progress" ? "In Progress" : item}<span>{item === "All" ? tasks.length : count(item)}</span></button>)}</div><span className={styles.resultCount}>{visibleTasks.length} {visibleTasks.length === 1 ? "task" : "tasks"}</span></div>
      <div className={styles.taskList}>{visibleTasks.length ? visibleTasks.map((task) => <article className={styles.taskRow} key={`${task.projectId}-${task.id}`}>
        <div className={styles.taskMain}><span className={`${styles.taskCheck} ${task.status === "Completed" ? styles.checked : ""}`}>{task.status === "Completed" && <Check size={14} />}</span><div className={styles.taskText}><h3>{task.title}</h3><p>{task.description || "No description provided."}</p><div className={styles.taskDetails}><span className={styles.projectLabel}><span className={styles.projectDot} />{task.projectName}</span><span><UserRound size={13} />Assigned by {task.assignedBy}</span></div></div></div>
        <span className={`${styles.status} ${task.status === "Completed" ? styles.completed : task.status === "In progress" ? styles.inProgress : ""}`}>{labelStatus[task.status]}</span>
        <span className={styles.dueDate}><CalendarDays size={14} />{task.dueDate ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "No due date"}</span>
        <select className={styles.statusSelect} aria-label={`Update status for ${task.title}`} value={task.status} onChange={(event) => updateStatus(task.id, task.projectId, event.target.value as TaskCardStatus)}><option>To do</option><option>In progress</option><option>Completed</option></select>
      </article>) : <div className={styles.empty}><span><ClipboardList size={22} /></span><h3>{tasks.length ? "No matching tasks" : "No tasks assigned yet."}</h3><p>{tasks.length ? "Try another search or status filter." : "Tasks assigned to your profile will show up here."}</p>{tasks.length > 0 && <button onClick={() => { setFilter("All"); setQuery(""); }}>Clear filters</button>}</div>}</div>
    </section>
  </main>;
}
