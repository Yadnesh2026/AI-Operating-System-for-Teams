export type Task = {
  _id: string;
  title: string;
  description: string;
  assignedTo: {
    _id: string,
    name: string
  },
  assignedBy: string;
  projectId: string;
  status: "todo" | "in-progress" | "completed";
  dueDate?: string;
  priority?: "Low" | "Medium" | "High";
};
