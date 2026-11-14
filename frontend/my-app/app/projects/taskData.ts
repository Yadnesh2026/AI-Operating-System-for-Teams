export type Task = {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  projectId: string;
  status: "todo" | "in-progress" | "completed";
};