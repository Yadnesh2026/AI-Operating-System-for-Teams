"use client";

import {
  Check,
  Clock3,
  ClipboardList,
  ListTodo,
  Search,
  UserRound,
} from "lucide-react";
import styles from "./tasks.module.css";
import { useEffect, useState } from "react";
import api from "../lib/axios";

type Filter = "All" | "To do" | "In progress" | "Completed";

type AssignedTask = {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  projectId: {
    _id: string;
    name: string;
    description: string;
    teamId?: {
      _id: string;
      name: string;
    };
  };
  assignedBy: string;
};

const filters: Filter[] = ["All", "To do", "In progress", "Completed"];

const labelStatus: Record<AssignedTask["status"], string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
};



export default function MyTasksPage() {
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const todo = tasks.filter((task) => task.status === "todo").length;

  const completed = tasks.filter((task) => task.status === "completed").length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  useEffect(()=>{
    async function fetchMyTasks() {
      try{
        const response = await api.get(`/mytasks`);

        setTasks(response.data.tasks ?? [])

        console.log("my Tasks",response.data.tasks)

      }catch(err){
        console.log("Fetch Tasks error",err)
      }
    }

    void fetchMyTasks();
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description} ${task.projectId.name} ${task.projectId.teamId?.name ?? ""}`
      .toLowerCase()
      .includes(normalizedSearch),
  );

  // All Tasks btns implementation
  const visibleTask = filteredTasks.filter((task)=>{
    if(activeFilter === "All") return true;
    if(activeFilter === "To do") return task.status  === "todo";
    if(activeFilter === "In progress") return task.status === "in-progress";
    if(activeFilter === "Completed") return task.status === "completed";
    return false;

  })

  async function updateStatus(
    task: AssignedTask,
    newStatus: AssignedTask["status"],
  ) {
    const teamId = task.projectId.teamId?._id;

    if (!teamId) {
      console.error("This task has no team ID");
      return;
    }

    try {
      const response = await api.patch(
        `/task/${teamId}/${task.projectId._id}/${task._id}/assign`,
        { status: newStatus },
      );

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === task._id
            ? { ...item, status: response.data.updateStatus.status }
            : item,
        ),
      );
    } catch (error) {
      console.error("Could not update task status", error);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeading}>
        <div>
          <h1>My Tasks</h1>
          <p>Track and manage your assigned work.</p>
        </div>
        <label className={styles.search}>
          <Search size={17} />
          <input
            placeholder="Search tasks, projects, or teams"
            aria-label="Search tasks, projects, or teams"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
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
            <b>{todo}</b>
            <span>To Do</span>
          </div>
        </article>
        <article>
          <span className={styles.statIcon}>
            <ListTodo size={19} />
          </span>
          <div>
            <b>{inProgress}</b>
            <span>In Progress</span>
          </div>
        </article>
        <article>
          <span className={`${styles.statIcon} ${styles.success}`}>
            <Check size={19} />
          </span>
          <div>
            <b>{completed}</b>
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
                aria-selected={item === activeFilter}
                className={item === activeFilter ? styles.activeFilter : ""}
                onClick={() => setActiveFilter(item)}
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
            {visibleTask.length} {visibleTask.length === 1 ? "task" : "tasks"}
          </span>
        </div>
        <div className={styles.taskList}>

          {visibleTask.length ? (

            visibleTask.map((task) => (
              <article
                className={styles.taskRow}
                key={`${task.projectId._id}-${task._id}`}
              >
                <div className={styles.taskMain}>
                  <span
                    className={`${styles.taskCheck} ${task.status === "completed" ? styles.checked : ""}`}
                  >
                    {task.status === "completed" && <Check size={14} />}
                  </span>
                  <div className={styles.taskText}>
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description provided."}</p>
                    <div className={styles.taskDetails}>
                      <span className={styles.projectLabel}>
                        <span className={styles.projectDot} />
                        {task.projectId.name}
                      </span>
                      {task.projectId.teamId?.name && (
                        <span>
                          <span className={styles.projectDot} />
                          {task.projectId.teamId.name}
                        </span>
                      )}
                      <span>
                        <UserRound size={13} />
                        Assigned by {task.assignedBy}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`${styles.status} ${task.status === "completed" ? styles.completed : task.status === "in-progress" ? styles.inProgress : ""}`}
                >
                  {labelStatus[task.status]}
                </span>
                <span className={styles.dueDate}>
                  No due date
                </span>
                <select
                  className={styles.statusSelect}
                  aria-label={`Update status for ${task.title}`}
                  value={task.status}
                  onChange={(event) =>
                    updateStatus(
                      task,
                      event.target.value as AssignedTask["status"],
                    )
                  }
                >
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
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
                  ? "Try another search term."
                  : "Tasks assigned to your profile will show up here."}
              </p>
              {tasks.length > 0 && (
                <button onClick={() => setSearchTerm("")}>Clear search</button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
