import TeamDetailPage from "./TeamDetailPage";
import { getTeam, type Team, type TeamRole } from "../teamData";

type PageProps = {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TeamPage({ params, searchParams }: PageProps) {
  const [{ teamId }, search] = await Promise.all([params, searchParams]);
  const getValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const name = getValue(search.name);
  const description = getValue(search.description);
  const createdAt = getValue(search.createdAt);
  const role = getValue(search.role);
  const existingTeam = getTeam(teamId);
  const fallbackRole: TeamRole = role === "Manager" ? "Manager" : "Employee";
  const team: Team = existingTeam ?? {
    id: teamId,
    name: name || teamId.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    description: description || "A shared space for this team to plan work and collaborate.",
    createdAt: createdAt || "Nov 5, 2026",
    role: fallbackRole,
    color: "red",
    members: [{ id: "jordan", name: "Jordan Davis", email: "jordan@acme.co", role: fallbackRole, joined: createdAt || "Nov 5, 2026", initials: "JD", tone: "red" }],
    projects: [],
  };

  return <TeamDetailPage initialTeam={team} />;
}
