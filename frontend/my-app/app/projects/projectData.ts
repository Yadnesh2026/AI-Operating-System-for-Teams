import type { ProjectRecord } from "../lib/backendTypes";

// A real project record mirrors backend/model/ProjectModel.js.
export type Project = ProjectRecord;

// Extra fields below belong only to the current local project-card prototype.
export type ProjectCardData = {
  id: string;
  name: string;
  description: string;
  team: string;
  tasks: number;
  progress: number;
  createdAt: string;
  status: "In progress" | "Completed";
};

// The list stays empty until a page supplies project data.
export const PROJECT_STORAGE_KEY = "redsun-projects-v2";
export const initialProjects: ProjectCardData[] = [];
