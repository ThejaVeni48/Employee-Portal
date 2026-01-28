import "./App.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import { useSelector } from "react-redux";
import Settings from "./Modules/Settings/Settings";

import Timesheets from "./Modules/Admin/Timesheets";

import WelcomePage from "./Login/WelcomePage/WelcomePage";
import OrgAdmin from './Login/OrgAdmin/OrgAdminLogin';
import EmpLogin from "./Login/Employee/EmpLogin";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardIndex from "./pages";
import Branch from "./Modules/Branch/Branch";

// import AdminLeaves from "./Modules/Admin/";
import Roles from "./Modules/Roles/Roles";
import OrgDesignations from "./Modules/Designation/OrgDesignations";
import OrgAccess from "./Modules/AccessControls/OrgAccess";
import SettingsPage from "./Modules/Settings/SettingPage";
import Shifts from "./Modules/Shifts/Shifts";
import Projects from './Modules/Projects/Projects';
import Employee from "./Modules/Employee/Employee";
import AddEmp from "./Modules/Employee/AddEmployee";
import Profile from "./Modules/Employee/Profile";
import ProjectAssignmnet from "./Modules/Projects/ProjectAssignment";

function AppRoutes() {
  const role = useSelector((state) => state.user.Role);

  return (
 <Router>
  <Routes>

    {/* Welcome */}
    <Route path="/" element={<WelcomePage />} />

    {/* Logins */}
    <Route path="/orgadminlogin" element={<OrgAdmin />} />
    <Route path="/emplogin" element={<EmpLogin />} />

    {/* DASHBOARD LAYOUT */}
    <Route path="/dashboard/" element={<DashboardLayout />}>


      {/* default */}
      <Route index element={<DashboardIndex />} />
 

      {/* modules */}
      <Route path="settings" element={<Settings />} />
      <Route path="timesheet" element={<Timesheets />} />
      <Route path="roles" element={<Roles />} />
      <Route path="orgdesignations" element={<OrgDesignations />} />
      <Route path="orgacess" element={<OrgAccess />} />
      <Route path="settingspage" element={<SettingsPage />} />
      <Route path="shifts" element={<Shifts />} />
      <Route path="branch" element={<Branch />} />


<Route path="projects" element={<Projects/>}/>
<Route path="employee" element={<Employee/>}/>

<Route path="empProfile" element={<Profile/>}/>
    </Route>

<Route path='/addEmp' element={<AddEmp/>}/>
<Route path="/projectAssignment" element={<ProjectAssignmnet/>}/>
{/* Employees */}
  </Routes>
</Router>

  );
}

export default AppRoutes;