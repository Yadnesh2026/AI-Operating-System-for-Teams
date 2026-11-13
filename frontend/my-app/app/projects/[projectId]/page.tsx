import TeamWorkspace from "../../components/TeamWorkspace";
import ProjectDetailPage from "./ProjectDetailPage";

export default async function ProjectDetailRoute({params, searchParams}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{teamId: string}>
  
}){
  const { projectId } = await params;
  const { teamId } = await searchParams;
  return (
    <TeamWorkspace title="Project details" active="projects">
      <ProjectDetailPage projectId={projectId} teamId={teamId} />
    </TeamWorkspace>
  );
}
