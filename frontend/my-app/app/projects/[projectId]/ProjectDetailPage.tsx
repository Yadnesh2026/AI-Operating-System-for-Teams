"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Clock3,
  FolderKanban,
  ListTodo,
  Pencil,
  Plus,
  Search,
  Sparkles,
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
import type { Task } from "../taskData";
import AITaskGenerator, { type AISaveTask } from "./AITaskGenerator";
import AIProjectAssistant from "./AiProjectAssistance";

type TaskFilter = "All tasks" | "To do" | "In progress" | "Completed";
const taskFilters: TaskFilter[] = [
  "All tasks",
  "To do",
  "In progress",
  "Completed",
];
const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);
type TeamMembership = {
  role: string;
  userId: { _id: string; name: string };
};

export default function ProjectDetailPage({
  projectId,
  teamId
}:{
  projectId: string,
  teamId: string
}) {

  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [aiTaskGeneratorOpen, setAiTaskGeneratorOpen] = useState(false);


  const [project, setProject]= useState<Project| null>(null);
  const [team, setTeam] = useState<Team | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [activeTaskFilter, setActiveTaskFilter] = useState<TaskFilter>("All tasks");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);


  // Update Task
const [editTaskId, setEditTaskId] = useState("");
const [editTaskTitle, setEditTaskTitle] = useState("");
const [editTaskDescription, setEditTaskDescription] = useState("");
const [editTaskAssignedTo, setEditTaskAssignedTo] = useState("");
const [editTaskPriority, setEditTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
const [editTaskDueDate, setEditTaskDueDate] = useState("");
const [editTaskModal, setEditTaskModal] = useState(false);


  const router = useRouter();

  // Fetch the tasks
  useEffect(()=>{

      async function fetchTasks() {
        if (!isObjectId(teamId) || !isObjectId(projectId)) return;
        try{
          const response = await api.get(`/task/${teamId}/${projectId}`)
          setTasks(response.data.tasks ?? [])

        }catch(err){
          console.log("Tasks Fetch error", err)
        }
    }
    fetchTasks()
  },[teamId,projectId])

  // fetch the projects from backend
  useEffect(()=>{
      async function fetchProjects() {
      if (!isObjectId(teamId) || !isObjectId(projectId)) return;
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
      if (!isObjectId(teamId)) return;
      try{

      const response = await api.get<{
        team: Team;
        membership: TeamMembership[];
      }>(`/getDetails/${teamId}`);

      console.log("Response data",response.data)
      setTeam(response.data.team)


      // To add the employee in dropdown of while creating a task
      const teamEmployee = response.data.membership.filter((member) => member.role === "employee")
      .map((member) => ({
        id: member.userId._id,
        name: member.userId.name
      }));

      setEmployees(teamEmployee)

      }catch(err){
        console.log("Team data does not fetched",err)
      }
    }
    teamData()
  },[teamId])

  // Create an task Backend Integration
  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try{
      const response = await api.post(`/task/${teamId}/${projectId}`,{
        title: taskTitle,
        description: taskDescription,
        assignedTo: assignedTo
      })

      setTasks((prevTasks)=>[  // prevTasks means the previous/current value of the tasks state.
        ...prevTasks,response.data.createTask
      ]);

      setTaskTitle("")
      setTaskDescription("")
      setAssignedTo("")
      setTaskModal(false)

    }catch(err){
      console.log("Create Task Error",err)
    }
  }

  // Ai generated Tasks
  async function saveAiTasks(selectedTasks: AISaveTask[]) {
    try{
      const responses = await Promise.all(selectedTasks.map((task)=>
      api.post(`/task/${teamId}/${projectId}`,{
        title: task.title,
        description: task.description,
        assignedTo: task.assignee
      })))

      const createdTasks = responses.map(
      (response) => response.data.createTask
    );

     setTasks((prevTasks) => [
      ...prevTasks,
      ...createdTasks,
    ]);

      console.log("AI Tasks Saved Successfully!");


    }catch(err){
      console.log("Ai error",err)
      throw err;
    }
  }

  // Update Task edit
  async function updateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try{
      const response = await api.put(`/task/${teamId}/${projectId}/${editTaskId}`,{
        title: editTaskTitle,
        description: editTaskDescription,
        assignedTo: editTaskAssignedTo
      })

      setTasks((prevTasks)=>  //If the task ID matches, replace it with the updated task. Otherwise, keep the existing task.
        prevTasks.map((task)=>
            task._id === editTaskId ? response.data.updateTask : task))

      console.log(response.data)

      setEditTaskModal(false)
    }catch(err){
      console.log("Update task error",err)
    }
  }

  //Delete task
  async function deleteTask(taskId: string){
    try{
      await api.delete(`/task/${teamId}/${projectId}/${taskId}`)

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId),
      );

    }catch(err){
      console.log("Delete Task",err)
    }
  }



  const pending = tasks.filter((task) => task.status === "todo").length;
  const inProgress = tasks.filter((task) => task.status === "in-progress").length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const taskCountByFilter: Record<TaskFilter, number> = {
    "All tasks": tasks.length,
    "To do": pending,
    "In progress": inProgress,
    Completed: completed,
  };

  const visibleTasks = tasks.filter((task) => {
    if (activeTaskFilter === "To do") return task.status === "todo";
    if (activeTaskFilter === "In progress") return task.status === "in-progress";
    if (activeTaskFilter === "Completed") return task.status === "completed";
    return true;
  });

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
  if (!isObjectId(teamId) || !isObjectId(projectId)) {
    return (
      <main className={styles.page}>
        <p>Project link is missing a valid project or team ID.</p>
        <Link href="/projects" className={styles.backLink}>
          <ArrowLeft size={15} /> All projects
        </Link>
      </main>
    );
  }

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
              type="button"
              className={styles.aiGenerateButton}
              onClick={() => setAiAssistantOpen(true)}
            >
              <Sparkles size={15} />
              Ask AI
            </button>
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
          <div className={styles.taskHeaderActions}>
            <button
              className={styles.aiGenerateButton}
              onClick={() => setAiTaskGeneratorOpen(true)}
            >
              <Sparkles size={15} />
              Generate Tasks with AI
            </button>
            <button
              className={styles.createButton}
              onClick={() => setTaskModal(true)}
            >
              <Plus size={16} />
              Create task
            </button>
          </div>
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
                aria-selected={item === activeTaskFilter}
                className={item === activeTaskFilter ? styles.activeFilter : ""}
                onClick={() => setActiveTaskFilter(item)}
              >
                {item}
                <span>{taskCountByFilter[item]}</span>
              </button>
            ))}
          </div>
          <label className={styles.search}>
            <Search size={16} />
            <input placeholder="Search tasks" aria-label="Search tasks" />
          </label>
        </div>
        
        <div className={styles.taskList}>
          {visibleTasks.length ? (
            visibleTasks.map((task) => (
              <article className={styles.taskRow} key={task._id}>
                <div className={styles.taskInfo}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description provided."}</p>
                    <div className={styles.taskMeta}>
                      <span className={styles.assignee}>
                        <UsersRound size={12} />

                       {typeof task.assignedTo === "object" && task.assignedTo !== null
                          ? task.assignedTo.name
                          : "Unassigned"}
                          
                      </span>
                      {task.dueDate && (
                        <span>
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
                <div className={styles.taskActions}>
                  <span
                    className={`${styles.statusBadge} ${
                      task.status === "completed"
                        ? styles.statusCompleted
                        : task.status === "in-progress"
                          ? styles.statusInProgress
                          : styles.statusTodo
                    }`}
                    aria-label={`Status: ${task.status === "in-progress" ? "In progress" : task.status === "completed" ? "Completed" : "To do"}`}
                  >
                    {task.status === "in-progress"
                      ? "In progress"
                      : task.status === "completed"
                        ? "Completed"
                        : "To do"}
                  </span>
                  <button
                    type="button"
                    className={styles.editButton}
                    aria-label={`Edit ${task.title}`}
                    onClick={() => {
                      setEditTaskId(task._id);
                      setEditTaskTitle(task.title);
                      setEditTaskDescription(task.description);
                      setEditTaskAssignedTo(task.assignedTo?._id ?? "");
                      setEditTaskPriority(task.priority ?? "Medium");
                      setEditTaskDueDate(task.dueDate ?? "");
                      setEditTaskModal(true);
                    }}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                    onClick={() => deleteTask(task._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
                  value={taskTitle}
                  onChange={(e)=> setTaskTitle(e.target.value)}
                  placeholder="What needs to get done?"
                />

              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={taskDescription}
                  onChange={(e)=> setTaskDescription(e.target.value)}
                  placeholder="Add a few details about this task"
                />
              </label>
              <div className={styles.formRow}>
                <label>
                  Assign employee
                  <select value={assignedTo} onChange={(e)=> setAssignedTo(e.target.value)}>
                    <option value="">Unassigned</option>

                    {employees.map((member) => (
                      <option key={member.id} value={member.id}>
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

      {editTaskModal && (
        <div
          className={styles.backdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditTaskModal(false);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-task-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalIcon}>
                  <Pencil size={17} />
                </span>
                <h2 id="edit-task-title">Edit task</h2>
                <p>Update the task details.</p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close"
                onClick={() => setEditTaskModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form
              className={styles.form}
              onSubmit={updateTask}
              data-task-id={editTaskId}
            >
              <label>
                Task title
                <input
                  required
                  autoFocus
                  value={editTaskTitle}
                  onChange={(event) => setEditTaskTitle(event.target.value)}
                  placeholder="What needs to get done?"
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={editTaskDescription}
                  onChange={(event) => setEditTaskDescription(event.target.value)}
                  placeholder="Add a few details about this task"
                />
              </label>
              <div className={styles.formRow}>
                <label>
                  Assign employee
                  <select
                    value={editTaskAssignedTo}
                    onChange={(event) => setEditTaskAssignedTo(event.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {employees.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Priority
                  <select
                    value={editTaskPriority}
                    onChange={(event) =>
                      setEditTaskPriority(event.target.value as "Low" | "Medium" | "High")
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>
              <label>
                Due date
                <input
                  type="date"
                  value={editTaskDueDate}
                  onChange={(event) => setEditTaskDueDate(event.target.value)}
                />
              </label>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setEditTaskModal(false)}
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

      {aiTaskGeneratorOpen && project && (
        <AITaskGenerator
          project={project} teamId={teamId} employees={employees}
          onClose={() => setAiTaskGeneratorOpen(false)}
          onSaveTasks={saveAiTasks}
        />
      )}

      {aiAssistantOpen && (
        <AIProjectAssistant onClose={() => setAiAssistantOpen(false)}
        teamId={teamId} projectId={projectId} />
      )}
    </main>
  );
}
