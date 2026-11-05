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

export const teams: Team[] = [
  {
    id: "product-team",
    name: "Product team",
    description: "Shape the product roadmap and turn customer insights into clear, useful experiences.",
    createdAt: "Oct 21, 2026",
    role: "Manager",
    color: "red",
    members: [
      { id: "jordan", name: "Jordan Davis", email: "jordan@acme.co", role: "Manager", joined: "Oct 21, 2026", initials: "JD", tone: "red" },
      { id: "alex", name: "Alex Morgan", email: "alex@acme.co", role: "Employee", joined: "Oct 22, 2026", initials: "AM", tone: "blue" },
      { id: "jamie", name: "Jamie Lee", email: "jamie@acme.co", role: "Employee", joined: "Oct 24, 2026", initials: "JL", tone: "violet" },
      { id: "sam", name: "Sam Kim", email: "sam@acme.co", role: "Employee", joined: "Oct 28, 2026", initials: "SK", tone: "green" },
      { id: "taylor", name: "Taylor Reed", email: "taylor@acme.co", role: "Employee", joined: "Nov 1, 2026", initials: "TR", tone: "blue" },
    ],
    projects: [
      { name: "Mobile app launch", status: "In progress", progress: 48, due: "Nov 24, 2026" },
      { name: "Q4 product roadmap", status: "On track", progress: 76, due: "Nov 18, 2026" },
      { name: "Customer feedback hub", status: "Planning", progress: 18, due: "Dec 02, 2026" },
    ],
  },
  {
    id: "design-team",
    name: "Design team",
    description: "Create thoughtful, consistent experiences across every product touchpoint.",
    createdAt: "Sep 14, 2026",
    role: "Employee",
    color: "violet",
    members: [
      { id: "alex", name: "Alex Morgan", email: "alex@acme.co", role: "Manager", joined: "Sep 14, 2026", initials: "AM", tone: "blue" },
      { id: "jordan", name: "Jordan Davis", email: "jordan@acme.co", role: "Employee", joined: "Sep 18, 2026", initials: "JD", tone: "red" },
      { id: "sam", name: "Sam Kim", email: "sam@acme.co", role: "Employee", joined: "Sep 22, 2026", initials: "SK", tone: "green" },
    ],
    projects: [
      { name: "Website redesign", status: "In progress", progress: 72, due: "Nov 18, 2026" },
      { name: "Design system refresh", status: "On track", progress: 61, due: "Nov 29, 2026" },
    ],
  },
  {
    id: "engineering-team",
    name: "Engineering team",
    description: "Build reliable systems and ship improvements that make work move faster.",
    createdAt: "Aug 03, 2026",
    role: "Employee",
    color: "blue",
    members: [
      { id: "jamie", name: "Jamie Lee", email: "jamie@acme.co", role: "Manager", joined: "Aug 03, 2026", initials: "JL", tone: "violet" },
      { id: "jordan", name: "Jordan Davis", email: "jordan@acme.co", role: "Employee", joined: "Aug 08, 2026", initials: "JD", tone: "red" },
      { id: "taylor", name: "Taylor Reed", email: "taylor@acme.co", role: "Employee", joined: "Aug 15, 2026", initials: "TR", tone: "blue" },
      { id: "sam", name: "Sam Kim", email: "sam@acme.co", role: "Employee", joined: "Aug 18, 2026", initials: "SK", tone: "green" },
    ],
    projects: [
      { name: "API reliability sprint", status: "On track", progress: 83, due: "Nov 14, 2026" },
      { name: "Workspace permissions", status: "In progress", progress: 39, due: "Nov 28, 2026" },
    ],
  },
  {
    id: "growth-team",
    name: "Growth team",
    description: "Connect the right people with RedSun through clear, measurable campaigns.",
    createdAt: "Jul 09, 2026",
    role: "Employee",
    color: "green",
    members: [
      { id: "taylor", name: "Taylor Reed", email: "taylor@acme.co", role: "Manager", joined: "Jul 09, 2026", initials: "TR", tone: "blue" },
      { id: "jordan", name: "Jordan Davis", email: "jordan@acme.co", role: "Employee", joined: "Jul 14, 2026", initials: "JD", tone: "red" },
    ],
    projects: [
      { name: "Q4 growth strategy", status: "On track", progress: 86, due: "Nov 12, 2026" },
      { name: "Customer stories", status: "Planning", progress: 20, due: "Dec 05, 2026" },
    ],
  },
];

export function getTeam(id: string) {
  return teams.find((team) => team.id === id);
}
