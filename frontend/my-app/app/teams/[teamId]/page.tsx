import TeamDetailPage from "./TeamDetailPage";
import { getTeam, type Team, type TeamRole } from "../teamData";
import { notFound } from "next/navigation";

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
  const fallbackRole: TeamRole | undefined = role === "Manager" || role === "Employee" ? role : undefined;
  if (!existingTeam && (!name || !description || !createdAt || !fallbackRole)) notFound();
  const team: Team = existingTeam ?? {
    id: teamId,
    name: name!,
    description: description!,
    createdAt: createdAt!,
    role: fallbackRole!,
    color: "red",
    members: [],
    projects: [],
  };

  return <TeamDetailPage initialTeam={team} />;
}
