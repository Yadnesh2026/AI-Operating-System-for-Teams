"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Check, FolderKanban, ListTodo, Plus, Search, X } from "lucide-react";
import type { Team } from "../teams/teamData";
import { initialProjects, PROJECT_STORAGE_KEY, type Project } from "./projectData";
import api from "../lib/axios";
import styles from "./projects.module.css";

const filters = ["All projects", "In progress", "Completed"] as const;
type Filter = typeof filters[number];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filter, setFilter] = useState<Filter>("All projects");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(PROJECT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Project[];
        if (Array.isArray(parsed)) setProjects(parsed);
      } catch { window.localStorage.removeItem(PROJECT_STORAGE_KEY); }
    }

    // Load the signed-in user's teams for the project form's team selector.
    void api.get("/getAllTeams").then((response) => {
      const memberships = response.data.teams ?? [];
      const availableTeams = memberships
        .map((membership: { teamId: Team | string }) => membership.teamId)
        .filter((item: Team | string): item is Team => typeof item !== "string");
      setTeams(availableTeams);
      setTeam((current) => current || availableTeams[0]?.name || "");
    }).catch(() => {
      setTeams([]);
    });
  }, []);

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesFilter = filter === "All projects" || project.status === filter;
    const matchesQuery = `${project.name} ${project.team}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  }), [filter, projects, query]);

  function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !team) return;
    const project: Project = { id: `project-${Date.now()}`, name: name.trim(), description: description.trim() || "A new project for the team to plan and deliver together.", team, tasks: 0, progress: 0, createdAt: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()), status: "In progress" };
    setProjects((current) => {
      const next = [project, ...current];
      window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setFilter("All projects");
    setQuery("");
    setName("");
    setDescription("");
    setModalOpen(false);
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHeading}>
        <div><span className={styles.eyebrow}>Workspace</span><h1>Projects</h1><p>Plan the work, track progress, and keep every team moving forward.</p></div>
        <button className={styles.createButton} onClick={() => setModalOpen(true)}><Plus size={17} /> Create project</button>
      </div>

      <section className={styles.summary} aria-label="Project summary">
        <article className={styles.summaryCard}><span className={styles.summaryIcon}><FolderKanban size={19} /></span><div><b>{projects.length}</b><span>Total projects</span></div></article>
        <article className={styles.summaryCard}><span className={styles.summaryIcon}><ListTodo size={19} /></span><div><b>{projects.filter((project) => project.status === "In progress").length}</b><span>In progress</span></div></article>
        <article className={styles.summaryCard}><span className={styles.summaryIcon}><Check size={19} /></span><div><b>{projects.filter((project) => project.status === "Completed").length}</b><span>Completed</span></div></article>
      </section>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="tablist" aria-label="Filter projects">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>{item}<span>{item === "All projects" ? projects.length : projects.filter((project) => project.status === item).length}</span></button>)}</div>
        <label className={styles.search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" aria-label="Search projects by name" /></label>
      </div>

      {visibleProjects.length ? <div className={styles.projectGrid}>{visibleProjects.map((project, index) => <article className={styles.projectCard} key={project.id}>
        <div className={styles.cardTop}><span className={`${styles.projectIcon} ${styles[`tone${index % 4}`]}`}><FolderKanban size={19} /></span><span className={`${styles.status} ${project.status === "Completed" ? styles.completed : ""}`}>{project.status === "Completed" && <Check size={12} />}{project.status}</span></div>
        <h2>{project.name}</h2><p className={styles.description}>{project.description}</p>
        <div className={styles.teamLine}><span className={styles.teamDot} />{project.team}</div>
        <div className={styles.progressHeader}><span>Project progress</span><b>{project.progress}%</b></div><div className={styles.progressTrack}><span style={{ width: `${project.progress}%` }} className={project.status === "Completed" ? styles.progressComplete : ""} /></div>
        <div className={styles.cardMeta}><span><ListTodo size={14} />{project.tasks} tasks</span><span><CalendarDays size={14} />Created {project.createdAt}</span></div>
        <Link className={styles.viewLink} href={`/projects/${project.id}`}>View project <ArrowRight size={15} /></Link>
      </article>)}</div> : <div className={styles.empty}><span className={styles.emptyIcon}><FolderKanban size={22} /></span><h2>{projects.length === 0 ? "No projects available." : "No projects found"}</h2><p>{projects.length === 0 ? "Projects will appear here when they’re created or connected." : "Try another search or choose a different filter."}</p>{projects.length > 0 && <button onClick={() => { setFilter("All projects"); setQuery(""); }}>Clear filters</button>}</div>}

      {modalOpen && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="create-project-title">
          <div className={styles.modalHeader}><div><span className={styles.modalIcon}><FolderKanban size={18} /></span><h2 id="create-project-title">Create a project</h2><p>Set up a new project for one of your teams.</p></div><button className={styles.closeButton} aria-label="Close" onClick={() => setModalOpen(false)}><X size={18} /></button></div>
          <form onSubmit={createProject} className={styles.form}>
            <label>Project name<input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter project name" /></label>
            <label>Description <span className={styles.optional}>(optional)</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this project about?" /></label>
            <label>Select team<select required value={team} onChange={(event) => setTeam(event.target.value)}><option value="" disabled>{teams.length ? "Choose a team" : "No teams available"}</option>{teams.map((item) => <option key={item._id} value={item.name}>{item.name}</option>)}</select>{teams.length === 0 && <span className={styles.optional}>Create or join a team before creating a project.</span>}</label>
            <div className={styles.modalActions}><button type="button" className={styles.cancelButton} onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className={styles.createButton}><Plus size={16} />Create project</button></div>
          </form>
        </section>
      </div>}

    </main>
  );
}
