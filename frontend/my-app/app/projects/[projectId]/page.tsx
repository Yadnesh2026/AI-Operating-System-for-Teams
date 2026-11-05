import TeamWorkspace from "../../components/TeamWorkspace";
import ProjectDetailPage from "./ProjectDetailPage";

export default async function ProjectDetailRoute({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <TeamWorkspace title="Project details" active="projects"><ProjectDetailPage projectId={projectId} /></TeamWorkspace>;
}
