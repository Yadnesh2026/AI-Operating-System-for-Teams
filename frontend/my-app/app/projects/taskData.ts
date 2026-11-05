export type TaskStatus = "To do" | "In progress" | "Completed";
export type Priority = "Low" | "Medium" | "High";
export type ProjectTask = { id: string; title: string; description: string; assignee: string; status: TaskStatus; priority: Priority; dueDate: string };

export const taskStorageKey = (projectId: string) => `redsun-project-tasks-v2-${projectId}`;

// Empty until task records are supplied by a future data layer.
export const seedTasks: Record<string, ProjectTask[]> = {};
