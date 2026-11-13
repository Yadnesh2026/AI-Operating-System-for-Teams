/** TypeScript representations of the Mongoose records in backend/model. */
export type Id = string;

export type UserRecord = {
  _id: Id;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamRecord = {
  _id: Id;
  name: string;
  description: string;
  createdBy: Id;
  createdAt: string;
  updatedAt: string;
};

export type TeamRole = "manager" | "employee";

// The TeamMembership schema does not enable Mongoose timestamps.
export type TeamMembershipRecord = {
  _id: Id;
  userId: Id;
  teamId: Id;
  role: TeamRole;
};

export type ProjectRecord = {
  _id: Id;
  name: string;
  description: string;
  teamId: Id;
  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = "todo" | "in-progress" | "completed";

export type TaskRecord = {
  _id: Id;
  title: string;
  description: string;
  assignedTo: Id;
  assignedBy: Id;
  projectId: Id;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

// Populated Mongoose references returned by the current team detail endpoint.
export type PopulatedTeamMembership = Omit<TeamMembershipRecord, "userId" | "teamId"> & {
  userId: Pick<UserRecord, "_id" | "name" | "email">;
  teamId: TeamRecord | Id;
};
