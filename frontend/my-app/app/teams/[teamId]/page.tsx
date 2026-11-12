import { Suspense } from "react";
import TeamDetailPage from "./TeamDetailPage";

type PageProps = { params: Promise<{ teamId: string }> };

async function TeamPageContent({ params }: PageProps) {
  const { teamId } = await params;
  return <TeamDetailPage teamId={teamId} />;
}

export default function TeamPage({ params }: PageProps) {
  return (
    <Suspense fallback={<p>Loading team...</p>}>
      <TeamPageContent params={params} />
    </Suspense>
  );
}
