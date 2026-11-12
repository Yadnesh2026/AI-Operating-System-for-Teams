import TeamDetailPage from "./TeamDetailPage";

type PageProps = { params: Promise<{ teamId: string }> };

export default async function TeamPage({ params }: PageProps) {
  const { teamId } = await params;
  return <TeamDetailPage teamId={teamId} />;
}
