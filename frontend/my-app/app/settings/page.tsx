import TeamWorkspace from "../components/TeamWorkspace";
import SettingsPage from "./SettingsPage";

export default function SettingsRoute() {
  return <TeamWorkspace title="Settings" active="settings"><SettingsPage /></TeamWorkspace>;
}
