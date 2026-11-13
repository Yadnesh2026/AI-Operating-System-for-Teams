import TeamWorkspace from "../components/TeamWorkspace";
import ProjectsPage from "./ProjectsPage";

export default function ProjectsRoute() {
  return (
    <TeamWorkspace title="Projects" active="projects">
      <ProjectsPage />
    </TeamWorkspace>
  );
}



