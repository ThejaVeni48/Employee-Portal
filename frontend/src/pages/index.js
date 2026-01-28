import { useSelector } from "react-redux";

import OrgAdminDashboard from "./OrgAdmin";
import SuperUserDashboard from "./SuperUserDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

export default function DashboardIndex() {
  const role = useSelector((state) => state.user.Role);

  console.log("role",role);
  


  if (role === "Org Admin") return <OrgAdminDashboard />;

  if (role === "SUPER_USER") return <SuperUserDashboard />;

  return <EmployeeDashboard/>;
}
