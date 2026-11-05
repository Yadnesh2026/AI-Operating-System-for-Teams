export type TeamRole = "Manager" | "Employee";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  joined: string;
  initials: string;
  tone: "red" | "violet" | "blue" | "green";
};

export type TeamProject = {
  name: string;
  status: "On track" | "In progress" | "Planning";
  progress: number;
  due: string;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  role: TeamRole;
  color: "red" | "violet" | "blue" | "green";
  members: TeamMember[];
  projects: TeamProject[];
};

// Empty until the UI receives workspace data from the app's future data layer.
export const teams: Team[] = [];

export function getTeam(id: string) {
  return teams.find((team) => team.id === id);
}
