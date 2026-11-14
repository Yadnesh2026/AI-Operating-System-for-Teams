"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  ClipboardList,
  ListTodo,
  Search,
  UserRound,
} from "lucide-react";
import styles from "./tasks.module.css";

type Filter = "All" | "To do" | "In progress" | "Completed";
type AssignedTask = {
  id: string;
  title: string;
  description: string;
  status: "To do" | "In progress" | "Completed";
  dueDate: string;
  projectId: string;
  projectName: string;
  assignedBy: string;
};
const filters: Filter[] = ["All", "To do", "In progress", "Completed"];
const labelStatus: Record<AssignedTask["status"], string> = {
  "To do": "To Do",
  "In progress": "In Progress",
  Completed: "Completed",
};



export default function MyTasksPage() {
  const tasks: AssignedTask[] = [];

  return (
    <main className={styles.page}>
      <header className={styles.pageHeading}>
        <div>
          <span className={styles.eyebrow}>Workspace</span>
          <h1>My Tasks</h1>
          <p>Track and manage your assigned work.</p>
        </div>
        <label className={styles.search}>
          <Search size={17} />
          <input placeholder="Search tasks" aria-label="Search tasks" />
        </label>
      </header>

      <section className={styles.stats} aria-label="Task statistics">
        <article>
          <span className={styles.statIcon}>
            <ClipboardList size={19} />
          </span>
          <div>
            <b>{tasks.length}</b>
            <span>Total tasks</span>
          </div>
        </article>
        <article>
          <span className={styles.statIcon}>
            <Clock3 size={19} />
          </span>
          <div>
            <b>0</b>
            <span>To Do</span>
          </div>
        </article>
        <article>
          <span className={styles.statIcon}>
            <ListTodo size={19} />
          </span>
          <div>
            <b>0</b>
            <span>In Progress</span>
          </div>
        </article>
        <article>
          <span className={`${styles.statIcon} ${styles.success}`}>
            <Check size={19} />
          </span>
          <div>
            <b>0</b>
            <span>Completed</span>
          </div>
        </article>
      </section>

      <section className={styles.taskSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Your assigned tasks</h2>
            <p>Tasks assigned to you across your projects.</p>
          </div>
        </div>
        <div className={styles.toolbar}>
          <div
            className={styles.filters}
            role="tablist"
            aria-label="Filter tasks"
          >
            {filters.map((item) => (
              <button
                key={item}
                role="tab"
                aria-selected={item === "All"}
                className={item === "All" ? styles.activeFilter : ""}
                onClick={() => {}}
              >
                {item === "To do"
                  ? "To Do"
                  : item === "In progress"
                    ? "In Progress"
                    : item}
                <span>0</span>
              </button>
            ))}
          </div>
          <span className={styles.resultCount}>
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
        <div className={styles.taskList}>
          {tasks.length ? (
            tasks.map((task) => (
              <article
                className={styles.taskRow}
                key={`${task.projectId}-${task.id}`}
              >
                <div className={styles.taskMain}>
                  <span
                    className={`${styles.taskCheck} ${task.status === "Completed" ? styles.checked : ""}`}
                  >
                    {task.status === "Completed" && <Check size={14} />}
                  </span>
                  <div className={styles.taskText}>
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description provided."}</p>
                    <div className={styles.taskDetails}>
                      <span className={styles.projectLabel}>
                        <span className={styles.projectDot} />
                        {task.projectName}
                      </span>
                      <span>
                        <UserRound size={13} />
                        Assigned by {task.assignedBy}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`${styles.status} ${task.status === "Completed" ? styles.completed : task.status === "In progress" ? styles.inProgress : ""}`}
                >
                  {labelStatus[task.status]}
                </span>
                <span className={styles.dueDate}>
                  <CalendarDays size={14} />
                  {task.dueDate
                    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
                        "en",
                        { month: "short", day: "numeric", year: "numeric" },
                      )
                    : "No due date"}
                </span>
                <select
                  className={styles.statusSelect}
                  aria-label={`Update status for ${task.title}`}
                  value={task.status}
                  onChange={() => {}}
                >
                  <option>To do</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>
              </article>
            ))
          ) : (
            <div className={styles.empty}>
              <span>
                <ClipboardList size={22} />
              </span>
              <h3>
                {tasks.length ? "No matching tasks" : "No tasks assigned yet."}
              </h3>
              <p>
                {tasks.length
                  ? "Try another search or status filter."
                  : "Tasks assigned to your profile will show up here."}
              </p>
              {tasks.length > 0 && (
                <button
                  onClick={() => {}}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
