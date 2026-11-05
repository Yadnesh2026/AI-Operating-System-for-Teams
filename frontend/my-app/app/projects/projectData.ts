export type ProjectStatus = "In progress" | "Completed";
export type Project = { id: string; name: string; description: string; team: string; tasks: number; progress: number; createdAt: string; status: ProjectStatus };

// The list stays empty until a page supplies project data.
export const PROJECT_STORAGE_KEY = "redsun-projects-v2";
export const initialProjects: Project[] = [];
