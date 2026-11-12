"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, CircleAlert, ClipboardList, Clock3, FolderKanban, ListTodo, Pencil, Plus, Search, Trash2, UsersRound, X } from "lucide-react";
import Link from "next/link";
import { teams } from "../../teams/teamData";
import { initialProjects, PROJECT_STORAGE_KEY, type Project } from "../projectData";
import { seedTasks, taskStorageKey, type Priority, type ProjectTask, type TaskStatus } from "../taskData";
import styles from "./project-detail.module.css";

type Task = ProjectTask;
type TaskFilter = "All tasks" | TaskStatus;

const taskFilters: TaskFilter[] = ["All tasks", "To do", "In progress", "Completed"];

export default function ProjectDetailPage({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("All tasks");
  const [query, setQuery] = useState("");
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const savedProjects = window.localStorage.getItem(PROJECT_STORAGE_KEY);
    let projectList = initialProjects;
    if (savedProjects) {
      try { projectList = JSON.parse(savedProjects) as Project[]; } catch { window.localStorage.removeItem(PROJECT_STORAGE_KEY); }
    }
    const current = projectList.find((item) => item.id === projectId) ?? null;
    setProject(current);
    setEditName(current?.name ?? "");
    setEditDescription(current?.description ?? "");
    const savedTasks = window.localStorage.getItem(taskStorageKey(projectId));
    if (savedTasks) {
      try { setTasks(JSON.parse(savedTasks) as Task[]); } catch { setTasks(seedTasks[projectId] ?? []); }
    } else setTasks(seedTasks[projectId] ?? []);
    setLoaded(true);
  }, [projectId]);

  const team = teams.find((item) => item.name === project?.team);
  const isManager = team?.role === "manager";
  const employees = team?.members ?? [];
  const pending = tasks.filter((task) => task.status === "To do").length;
  const inProgress = tasks.filter((task) => task.status === "In progress").length;
  const completed = tasks.filter((task) => task.status === "Completed").length;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "All tasks" || task.status === filter;
    const matchesSearch = `${task.title} ${task.description} ${task.assignee}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  }), [filter, query, tasks]);

  function saveTasks(next: Task[]) {
    setTasks(next);
    window.localStorage.setItem(taskStorageKey(projectId), JSON.stringify(next));
    if (project) {
      const projectList = readProjects();
      const updated = projectList.map((item) => item.id === projectId ? { ...item, tasks: next.length, progress: next.length ? Math.round(next.filter((task) => task.status === "Completed").length / next.length * 100) : 0, status: next.length > 0 && next.every((task) => task.status === "Completed") ? "Completed" as const : "In progress" as const } : item);
      window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(updated));
      setProject(updated.find((item) => item.id === projectId) ?? project);
    }
  }

  function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    const next = [{ id: `task-${Date.now()}`, title: taskTitle.trim(), description: taskDescription.trim(), assignee, status: "To do" as const, priority, dueDate }, ...tasks];
    saveTasks(next);
    setTaskTitle(""); setTaskDescription(""); setAssignee(""); setPriority("Medium"); setDueDate(""); setTaskModal(false);
  }

  function updateTaskStatus(taskId: string, status: TaskStatus) {
    saveTasks(tasks.map((task) => task.id === taskId ? { ...task, status } : task));
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project || !editName.trim()) return;
    const updatedProject = { ...project, name: editName.trim(), description: editDescription.trim() };
    setProject(updatedProject);
    window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(readProjects().map((item) => item.id === projectId ? updatedProject : item)));
    setEditModal(false);
  }

  function deleteProject() {
    if (!project || !window.confirm(`Delete “${project.name}”? This cannot be undone.`)) return;
    window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(readProjects().filter((item) => item.id !== projectId)));
    window.localStorage.removeItem(taskStorageKey(projectId));
    router.push("/projects");
  }

  if (!loaded) return <main className={styles.page} aria-busy="true" />;
  if (!project) return <main className={styles.page}><section className={styles.notFound}><span><CircleAlert size={22} /></span><h1>Project not found</h1><p>This project may have been removed or the link may be incorrect.</p><Link href="/projects">Back to projects</Link></section></main>;

  return <main className={styles.page}>
    <Link href="/projects" className={styles.backLink}><ArrowLeft size={15} /> All projects</Link>
    <section className={styles.projectHeader}>
      <div className={styles.headingMain}><span className={styles.projectIcon}><FolderKanban size={21} /></span><div><span className={styles.eyebrow}>PROJECT OVERVIEW</span><h1>{project.name}</h1><p>{project.description}</p><div className={styles.teamBadge}><UsersRound size={14} />{project.team}</div></div></div>
      {isManager && <div className={styles.managerActions}><button className={styles.editButton} onClick={() => setEditModal(true)}><Pencil size={14} />Edit project</button><button className={styles.deleteButton} onClick={deleteProject}><Trash2 size={14} />Delete</button></div>}
    </section>

    <section className={styles.overview} aria-label="Project overview">
      <article><span className={styles.overviewIcon}><ClipboardList size={18} /></span><div><b>{tasks.length}</b><span>Total tasks</span></div></article>
      <article><span className={styles.overviewIcon}><Clock3 size={18} /></span><div><b>{pending}</b><span>To do</span></div></article>
      <article><span className={styles.overviewIcon}><ListTodo size={18} /></span><div><b>{inProgress}</b><span>In progress</span></div></article>
      <article><span className={`${styles.overviewIcon} ${styles.successIcon}`}><Check size={18} /></span><div><b>{completed}</b><span>Completed</span></div></article>
      <article className={styles.progressCard}><div className={styles.progressTop}><span>Project progress</span><b>{progress}%</b></div><div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div><small>{completed} of {tasks.length} tasks complete</small></article>
    </section>

    <section className={styles.taskSection}>
      <div className={styles.taskHeader}><div><h2>Tasks</h2><p>Keep the project work organized and moving.</p></div><button className={styles.createButton} onClick={() => setTaskModal(true)}><Plus size={16} />Create task</button></div>
      <div className={styles.taskToolbar}><div className={styles.filters} role="tablist" aria-label="Filter tasks">{taskFilters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>{item}<span>{item === "All tasks" ? tasks.length : tasks.filter((task) => task.status === item).length}</span></button>)}</div><label className={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" /></label></div>
      <div className={styles.taskList}>{visibleTasks.length ? visibleTasks.map((task) => <article className={styles.taskRow} key={task.id}>
        <div className={styles.taskInfo}><span className={`${styles.taskCheck} ${task.status === "Completed" ? styles.checked : ""}`}>{task.status === "Completed" && <Check size={14} />}</span><div><h3>{task.title}</h3><p>{task.description || "No description provided."}</p><div className={styles.taskMeta}><span className={styles.assignee}><UsersRound size={12} />{task.assignee || "Unassigned"}</span>{task.dueDate && <span><CalendarDays size={12} />Due {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>}</div></div></div>
        <span className={`${styles.priority} ${styles[`priority${task.priority}`]}`}>{task.priority}</span><select className={styles.statusSelect} aria-label={`Status for ${task.title}`} value={task.status} onChange={(event) => updateTaskStatus(task.id, event.target.value as TaskStatus)}><option>To do</option><option>In progress</option><option>Completed</option></select>
      </article>) : <div className={styles.empty}><h3>No tasks found</h3><p>Try a different filter or search term.</p><button onClick={() => { setFilter("All tasks"); setQuery(""); }}>Clear filters</button></div>}</div>
    </section>

    {taskModal && <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setTaskModal(false); }}><section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="task-modal-title"><div className={styles.modalHeader}><div><span className={styles.modalIcon}><ListTodo size={18} /></span><h2 id="task-modal-title">Create a task</h2><p>Add a task to {project.name}.</p></div><button className={styles.closeButton} aria-label="Close" onClick={() => setTaskModal(false)}><X size={18} /></button></div><form className={styles.form} onSubmit={createTask}><label>Task title<input required autoFocus value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="What needs to get done?" /></label><label>Description<textarea rows={3} value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} placeholder="Add a few details about this task" /></label><div className={styles.formRow}><label>Assign employee<select value={assignee} onChange={(event) => setAssignee(event.target.value)}><option value="">Unassigned</option>{employees.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option>Low</option><option>Medium</option><option>High</option></select></label></div><label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><div className={styles.modalActions}><button type="button" className={styles.cancelButton} onClick={() => setTaskModal(false)}>Cancel</button><button type="submit" className={styles.createButton}><Plus size={15} />Create task</button></div></form></section></div>}

    {editModal && <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setEditModal(false); }}><section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-project-title"><div className={styles.modalHeader}><div><span className={styles.modalIcon}><Pencil size={17} /></span><h2 id="edit-project-title">Edit project</h2><p>Update the project details.</p></div><button className={styles.closeButton} aria-label="Close" onClick={() => setEditModal(false)}><X size={18} /></button></div><form className={styles.form} onSubmit={saveProject}><label>Project name<input required value={editName} onChange={(event) => setEditName(event.target.value)} /></label><label>Description<textarea rows={3} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} /></label><div className={styles.modalActions}><button type="button" className={styles.cancelButton} onClick={() => setEditModal(false)}>Cancel</button><button type="submit" className={styles.createButton}>Save changes</button></div></form></section></div>}
  </main>;
}

function readProjects(): Project[] {
  const saved = window.localStorage.getItem(PROJECT_STORAGE_KEY);
  if (!saved) return [...initialProjects];
  try { return JSON.parse(saved) as Project[]; } catch { return [...initialProjects]; }
}
