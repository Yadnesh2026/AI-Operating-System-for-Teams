import TeamWorkspace from "../components/TeamWorkspace";
import MyTasksPage from "./MyTasksPage";

export default function MyTasksRoute() {
  return (
    <TeamWorkspace title="My Tasks" active="tasks">
      <MyTasksPage />
    </TeamWorkspace>
  );
}
