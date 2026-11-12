
export type TeamRole = "manager" | "employee";

// Same structure as backend TeamModel
export type Team = {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

// Same structure as backend TeamMembership
export type TeamMembership = {
  _id: string;
  userId: string;
  teamId: Team | string;
  role: TeamRole;
  createdAt?: string;
  updatedAt?: string;
};

// Member details returned by populated userId
export type TeamMember = {
  _id: string;
  name: string;
  email: string;
};

// Existing project structure — keep until we integrate projects
export type TeamProject = {
  name: string;
  status: "On track" | "In progress" | "Planning";
  progress: number;
  due: string;
};
