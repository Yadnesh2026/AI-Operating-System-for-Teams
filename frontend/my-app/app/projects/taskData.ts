import type { TaskRecord } from "../lib/backendTypes";

// A real task record mirrors backend/model/TaskModel.js.
export type ProjectTask = TaskRecord;

// Extra fields below belong only to the current local task-card prototype.
export type TaskCardStatus = "To do" | "In progress" | "Completed";
export type Priority = "Low" | "Medium" | "High";
export type TaskCardData = { id: string; title: string; description: string; assignee: string; status: TaskCardStatus; priority: Priority; dueDate: string };

export const taskStorageKey = (projectId: string) => `redsun-project-tasks-v2-${projectId}`;

// Empty until task records are supplied by a future data layer.
export const seedTasks: Record<string, TaskCardData[]> = {};
