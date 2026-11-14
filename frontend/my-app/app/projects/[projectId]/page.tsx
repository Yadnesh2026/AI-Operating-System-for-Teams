import { Suspense } from "react";
import TeamWorkspace from "../../components/TeamWorkspace";
import ProjectDetailPage from "./ProjectDetailPage";

type ProjectDetailRouteProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ teamId?: string }>;
};

async function ProjectDetailContent({
  params,
  searchParams,
}: ProjectDetailRouteProps) {
  const [{ projectId }, { teamId }] = await Promise.all([params, searchParams]);

  return (
    <TeamWorkspace title="Project details" active="projects">
      <ProjectDetailPage projectId={projectId} teamId={teamId ?? ""} />
    </TeamWorkspace>
  );
}

export default function ProjectDetailRoute(props: ProjectDetailRouteProps) {
  return (
    <Suspense
      fallback={
        <TeamWorkspace title="Project details" active="projects">
          <p>Loading project...</p>
        </TeamWorkspace>
      }
    >
      <ProjectDetailContent {...props} />
    </Suspense>
  );
}
