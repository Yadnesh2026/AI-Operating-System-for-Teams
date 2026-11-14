"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  FolderKanban,
  ListTodo,
  Pencil,
  Plus,
  Search,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import styles from "./project-detail.module.css";
import api from "../../lib/axios";
import type { Project } from "../projectData";
import type { Team } from "@/app/teams/teamData";
import { useRouter } from "next/navigation";

type TaskFilter = "All tasks" | "To do" | "In progress" | "Completed";
const taskFilters: TaskFilter[] = [
  "All tasks",
  "To do",
  "In progress",
  "Completed",
];

export default function ProjectDetailPage({
  projectId,
  teamId
}:{
  projectId: string,
  teamId: string
}) {

  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>("All tasks");
  const [query, setQuery] = useState("");

  const [project, setProject]= useState<Project| null>(null);
  const [team, setTeam] = useState<Team | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const router = useRouter();

  // fetch the projects from backend
  useEffect(()=>{
      async function fetchProjects() {
      try{
        const response = await api.get(`/project/${teamId}/${projectId}`)

        setProject(response.data.project)
        
      }catch(err){
      console.log("Error fetching project",err)
    }
    }

    fetchProjects();
  },[teamId, projectId])

  // Fetch the team data
  useEffect(()=>{
    async function teamData() {
      try{
      const response = await api.get(`/getDetails/${teamId}`)
      setTeam(response.data.team)

      }catch(err){
        console.log("Team data does not fetched",err)
      }
      
    }
    teamData()
  },[teamId])


  
  const tasks: {
    id: string;
    title: string;
    description: string;
    assignee: string;
    status: string;
    priority: string;
    dueDate: string;
  }[] = [];

  const employees: { id: string; name: string }[] = [];
  const pending = 0;
  const inProgress = 0;
  const completed = 0;
  const progress = 0;
  const visibleTasks = tasks;

  function preventPlaceholderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function createTask(){
    event
  }

  // Update Project edit btn 
  async function updateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try{
      const response =  await api.put(`/project/${teamId}/${projectId}`,
        {
          name: editName,
          description: editDescription
        }
      )
      setProject(response.data.project)
      setEditModal(false); // Close the popup after updating
    }catch(err){
      console.log("Update error",err)
    }
  }

  // Delete Project
  async function deleteProject() {

    try{
      const response = await api.delete(`/project/${teamId}/${projectId}`)
      console.log("Project Deleted",response.data)

      router.push("/projects")
    }catch(err){
      console.log("Delete Project",err)
    }
  }



  // Project is loading 
  if(!project){
    return <p>Loading Projects...</p>
  }


  return (
    <main className={styles.page}>
      <Link href="/projects" className={styles.backLink}>
        <ArrowLeft size={15} /> All projects
      </Link>
      <section className={styles.projectHeader}>
        <div className={styles.headingMain}>
          <span className={styles.projectIcon}>
            <FolderKanban size={21} />
          </span>
          <div>
            <span className={styles.eyebrow}>PROJECT OVERVIEW</span>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <div className={styles.teamBadge}>
              <UsersRound size={14} />
              {team?.name}
            </div>
          </div>
        </div>
        {
          <div className={styles.managerActions}>
            <button
              className={styles.editButton}
              onClick={() => {
                setEditModal(true)
                setEditName(project.name)
                setEditDescription(project.description)
              }}
            >
              <Pencil size={14} />
              Edit project
            </button>
            <button className={styles.deleteButton} onClick={deleteProject}>
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        }
      </section>

      <section className={styles.overview} aria-label="Project overview">
        <article>
          <span className={styles.overviewIcon}>
            <ClipboardList size={18} />
          </span>
          <div>
            <b>{tasks.length}</b>
            <span>Total tasks</span>
          </div>
        </article>
        <article>
          <span className={styles.overviewIcon}>
            <Clock3 size={18} />
          </span>
          <div>
            <b>{pending}</b>
            <span>To do</span>
          </div>
        </article>
        <article>
          <span className={styles.overviewIcon}>
            <ListTodo size={18} />
          </span>
          <div>
            <b>{inProgress}</b>
            <span>In progress</span>
          </div>
        </article>
        <article>
          <span className={`${styles.overviewIcon} ${styles.successIcon}`}>
            <Check size={18} />
          </span>
          <div>
            <b>{completed}</b>
            <span>Completed</span>
          </div>
        </article>
        <article className={styles.progressCard}>
          <div className={styles.progressTop}>
            <span>Project progress</span>
            <b>{progress}%</b>
          </div>
          <div className={styles.progressTrack}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <small>
            {completed} of {tasks.length} tasks complete
          </small>
        </article>
      </section>

      <section className={styles.taskSection}>
        <div className={styles.taskHeader}>
          <div>
            <h2>Tasks</h2>
            <p>Keep the project work organized and moving.</p>
          </div>
          <button
            className={styles.createButton}
            onClick={() => setTaskModal(true)}
          >
            <Plus size={16} />
            Create task
          </button>
        </div>
        <div className={styles.taskToolbar}>
          <div
            className={styles.filters}
            role="tablist"
            aria-label="Filter tasks"
          >
            {taskFilters.map((item) => (
              <button
                key={item}
                role="tab"
                aria-selected={filter === item}
                className={filter === item ? styles.activeFilter : ""}
                onClick={() => setFilter(item)}
              >
                {item}
                <span>
                  {item === "All tasks"
                    ? tasks.length
                    : tasks.filter((task) => task.status === item).length}
                </span>
              </button>
            ))}
          </div>
          <label className={styles.search}>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tasks"
              aria-label="Search tasks"
            />
          </label>
        </div>
        <div className={styles.taskList}>
          {visibleTasks.length ? (
            visibleTasks.map((task) => (
              <article className={styles.taskRow} key={task.id}>
                <div className={styles.taskInfo}>
                  <span
                    className={`${styles.taskCheck} ${task.status === "Completed" ? styles.checked : ""}`}
                  >
                    {task.status === "Completed" && <Check size={14} />}
                  </span>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description provided."}</p>
                    <div className={styles.taskMeta}>
                      <span className={styles.assignee}>
                        <UsersRound size={12} />
                        {task.assignee || "Unassigned"}
                      </span>
                      {task.dueDate && (
                        <span>
                          <CalendarDays size={12} />
                          Due{" "}
                          {new Date(
                            `${task.dueDate}T00:00:00`,
                          ).toLocaleDateString("en", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`${styles.priority} ${styles[`priority${task.priority}`]}`}
                >
                  {task.priority}
                </span>
                <select
                  className={styles.statusSelect}
                  aria-label={`Status for ${task.title}`}
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
              <h3>No tasks found</h3>
              <p>Try a different filter or search term.</p>
              <button onClick={() => {}}>Clear filters</button>
            </div>
          )}
        </div>
      </section>

      {taskModal && (
        <div
          className={styles.backdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setTaskModal(false);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalIcon}>
                  <ListTodo size={18} />
                </span>
                <h2 id="task-modal-title">Create a task</h2>
                <p>Add a task to {project.name}.</p>
              </div>
              <button
                className={styles.closeButton}
                aria-label="Close"
                onClick={() => setTaskModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form className={styles.form} onSubmit={createTask}>
              <label>
                Task title
                <input
                  required
                  autoFocus
                  defaultValue=""
                  placeholder="What needs to get done?"
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  defaultValue=""
                  placeholder="Add a few details about this task"
                />
              </label>
              <div className={styles.formRow}>
                <label>
                  Assign employee
                  <select defaultValue="">
                    <option value="">Unassigned</option>
                    {employees.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Priority
                  <select defaultValue="Medium">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>
              <label>
                Due date
                <input type="date" defaultValue="" />
              </label>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setTaskModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.createButton}>
                  <Plus size={15} />
                  Create task
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {editModal && (
        <div
          className={styles.backdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditModal(false);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-project-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalIcon}>
                  <Pencil size={17} />
                </span>
                <h2 id="edit-project-title">Edit project</h2>
                <p>Update the project details.</p>
              </div>
              <button
                className={styles.closeButton}
                aria-label="Close"
                onClick={() => setEditModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form className={styles.form} onSubmit={updateProject}>
              <label>
                Project name
                <input required value={editName} onChange ={(e)=>setEditName(e.target.value)} />
              </label>
              <label>
                Description
                <textarea rows={3} value={editDescription} onChange={(e)=>setEditDescription(e.target.value)} />
              </label>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.createButton}>
                  Save changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
