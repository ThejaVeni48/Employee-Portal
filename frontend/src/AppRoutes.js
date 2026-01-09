import "./App.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Login/Registration/Register";
import Login from "./Login/Login";

// import TimeSheetsInfo from "./Employee/TimeSheetsInfo";
import TimeSheetEntries from "./Employee/TimeSheetEntries";
// import Info from './Employee/Info';
import "react-datepicker/dist/react-datepicker.css";
// import EmpDashboard from "./Employee/EmpDashboard";
import SettingsPage from "./Settings/SettingPage";
import ProfilePage from "./Employee/ProfilePage";
import ApproveTimesheets from "./Manager/ApproveTimesheets";
import ViewTimesheets from "./Manager/ViewTimesheets";
import LeavesDashboard from "./Leaves/LeavesDashboard";
import PendingApprovals from "./Manager/PendingApprovals";
import ViewLeaveTimeSheet from "./Manager/ViewLeaveRequest";
import ManagerDashboard from "./Manager/ManagerDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import AddEmp from "./Admin/AddEmp";
// import Message from "./Admin/Message";
import Employees from "./Admin/Employees";
import LeavesCreation from "./Admin/LeavesCreation";
import LeaveManagement from "./Admin/LeavesManagement";
import AssignLeaves from "./Admin/AssignLeaves";
import HRDashboard from "./HR/HRDashboard";
// import Dept from './Admin/Dept';
import Projects from "./Projects/Projects";
import ProjectsEmployee from "./Projects/ProjectsEmployee";
import AllEmployees from "./Manager/AllEmployees";
import Dashboard from "./Admin/dashboard";
import AssignmentPage from "./Employee/AssignmentPage";
import MyProjects from "./Employee/MyProjects";
import MainDashboard from "./HR/MainDashboard";
import CalendarComponent from "./Employee/Calender";
import Settings from "./Admin/Settings";
import Timesheets from "./Admin/Timesheets";
import AdminLeaves from "./Admin/AdminLeaves";
import Roles from "./Admin/Roles";
import PMDashboard from "./PM/PMDashboard";
import PMMainDashboard from "./PM/PMMainDashboard";
import PMProjects from "./PM/Projects/PMProjects";
// import PMLeaves from "./PM/PMLeaves";
import PMTimesheets from "./PM/PMTimesheets";
import PMTeam from "./PM/PMTeam";
import PMTasks from "./PM/Projects/PMTasks";
import PMProjectsDashboard from "./PM/Projects/PMProjectsDashboard";
import TimesheetSummary from "./Employee/TimesheetSummary";
import LeaveSummary from "./Leaves/Leavesummary";
import MngMainDashboard from "./Manager/MngMainDashboard";
import EmpTimesheet from "./Timesheets/EmpTimesheet";
import LeavesRequest from "./Leaves/LeavesRequest";
import Approvals from "./Timesheets/Approvals";
import ApprovedTimesheet from "./Timesheets/ApprovedTimesheet";
import WeekTimesheet from "./Timesheets/WeeklyTimesheet";
import EmpLogin from "./Login/EmpLogin";
import WelcomePage from "./Login/WelcomePage";
import SSODashboard from "./SSO/SSODashboard";
import ViewOrg from "./Login/ViewOrg";
import DRoles from "./SSO/DRoles";
import Designation from "./SSO/Designation";
import Jobs from "./SSO/Jobs";
import OrgDesignations from "./Admin/OrgDesignations";
import OrgAccess from "./Admin/OrgAccess";
import Profile from "./Employee/Profile";

import Noaccess from "./Noaccess";
import ProjectAssignmnet from "./Projects/ProjectAssignment";

import ProtectedRoute from "./Routes/ProtectedRoute";
import CreateProject from "./Projects/CreateProject";
import Task from "./Tasks/Task";
import TaskList from "./Tasks/TaskList";
import ProjectProfile from "./Projects/ProjectProfile";
import TimesheetWeeks from "./Timesheets/TimesheetWeeks";
import SSOLeaves from "./SSO/SSOLeaves";
import Holiday from "./Holidays/Holiday";
import PHolidays from "./Projects/ProjectHolidays/PHolidays";
import CompaniesList from "./SSO/Company/Company";
import ChangePassword from "./Login/ChangePassword/ChangePwd";
import {  useSelector } from "react-redux";
import Plans from './Login/Plans/Plans';
import Shifts from "./Shifts/Shifts";

function AppRoutes() {
    const role = useSelector((state) => state.user.Role);

  return (
    <Router>
      <Routes>
        {/*================================ Login Routes =================================================*/}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/empLogin" element={<EmpLogin />} />
        <Route path="/vieworg" element={<ViewOrg />} />
         <Route path="changePassword" element={<ChangePassword />} />
         <Route path="/subscriptionplans" element={<Plans/>}/>


        {/* =================================SSO  ===============================================*/}

        <Route path="/SSODashboard" element={<SSODashboard />}>
          <Route path="companies" element = {<CompaniesList/>}/>
          <Route path="roles" element={<DRoles />} />
          <Route path="designation" element={<Designation />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="ssoleaves" element={<SSOLeaves />} />
        </Route>

        {/* Manager */}
        <Route path="/managerdashboard" element={<ManagerDashboard />}>
          <Route path="weektimesheet" element={<WeekTimesheet />} />
          <Route path="empleavesummary" element={<LeaveSummary />} />

          <Route path="mngmainDashboard" element={<MngMainDashboard />} />
          <Route path="empTimesheet" element={<EmpTimesheet />} />
          <Route path="leavesrequest" element={<LeavesRequest />} />
          {/* <Route path="holiday" element={<Holiday />} /> */}
          <Route path="weektimesheet" element={<WeekTimesheet />} />
          <Route path="timesheetsummary" element={<TimesheetSummary />}></Route>
          <Route path="timesheetapprovals" element={<Approvals />} />
        </Route>

        <Route path="/ApproveTimesheets" element={<ApproveTimesheets />} />
        <Route path="/ViewTimesheets" element={<ViewTimesheets />} />
        <Route path="/pendingApprovals" element={<PendingApprovals />} />
        <Route path="/viewLeaveTimeSheet" element={<ViewLeaveTimeSheet />} />
        <Route path="/emp" element={<AllEmployees />} />

        {/*----------------------------------- Employee ---------------------------------------------------------- */}
       
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/TimeSheetEntries" element={<TimeSheetEntries />} />

        <Route path="/LeavesDashboard" element={<LeavesDashboard />} />
        <Route path="/AssignmentsPage" element={<AssignmentPage />} />

   {/*------------------------------------------ Admin ---------------------------------------------------*/}


    {/* --------------------------- Dashboard ------------------------------------------- */}

        
      
        <Route path="/adminDashboard" element={<AdminDashboard />}>



        {/* ------------------------Projects ------------------------------------------------------------------ */}
          <Route
            path="projects"
            element={
              <ProtectedRoute   
              accessCode={["PROJ_VW", "ALL_R"]}>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="createproject"
            element={
              <ProtectedRoute  accessCode={["PROJ_CR", "ALL_R", "PROJ_MD"]}>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="projectassignment"
            element={
              <ProtectedRoute   accessCode={["PROJ_ASSIGN", "ALL_R"]}>
                <ProjectAssignmnet />
              </ProtectedRoute>
            }
          />

          <Route
            path="tasks"
            element={
              <ProtectedRoute  accessCode={["ALL_R", "PROJ_TASK"]}>
                <Task />
              </ProtectedRoute>
            }
          />

          <Route
            path="tasks"
            element={
              <ProtectedRoute  accessCode={["ALL_R", "PROJ_TASK"]}>
                <TaskList />
              </ProtectedRoute>
            }
          />

          <Route
            path="projectprofile"
            element={
              <ProtectedRoute  accessCode={["ALL_R", "PROJ_PROF"]}>
                <ProjectProfile />
              </ProtectedRoute>
            }
          />

         


      
          <Route
            path="holidays"
            element={
              <ProtectedRoute  accessCode={["ALL_R", "HD_TAB"]}>
                <Holiday />
              </ProtectedRoute>
            }
          />


          <Route path="projectholidays" element={<PHolidays />} />

          <Route path="timesheetweeks" element={<TimesheetWeeks />} />
          <Route path="timesheetapprovals" element={<Approvals />} />
          <Route path="noaccess" element={<Noaccess />} />
          {/* <Route path="projectHolidays" element={<ProjectHolidays/>}/> */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          {/* <Route path="jobs" element={<Jobs />} /> */}
          <Route path="leavescreation" element={<LeavesCreation />} />
          <Route path="leavesmanagement" element={<LeaveManagement />} />
          {/* <Route path="projects" element={<Projects />} /> */}
      
          <Route path="timesheet" element={<Timesheets />} />
          <Route path="adminleaves" element={<AdminLeaves />} />
          <Route path="roles" element={<Roles />} />
          <Route path="orgdesignations" element={<OrgDesignations />} />
          <Route path="orgacess" element={<OrgAccess />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settingspage" element={<SettingsPage/>}/>
          <Route path="shifts" element={<Shifts/>}/>



            {/*------------------------------- timesheets ---------------------------------------------- */}

         
          <Route path="weektimesheet"

          element = {
            // <ProtectedRoute      
            //  accessCode={["ALL_R", "TS_WEEK"]}>

              <WeekTimesheet/>
          //   </ProtectedRoute>
          }
          />

            <Route path="timesheetsummary"

          element = {
            // <ProtectedRoute accessCode={['ALL_R','TS_HISTORY']}>
              <TimesheetSummary/>
            // </ProtectedRoute>
          }
          />


        {/*---------------------------------------------- Settings ----------------------------- */}


    {/* <Route path="settings" element={<Settings />} /> */}

    <Route path="settings"

          element = {
            <ProtectedRoute
            accessCode={['ALL_R','SETTING_VW']}>
<Settings />            </ProtectedRoute>
          }
          />





          {/*--------------------------------- ChangePassword ---------------------------------------*/}

 <Route path="changePassword"

          element = {
            <ProtectedRoute  accessCode={['ALL_R','CHANGEPWD_MD']}>
<ChangePassword />            </ProtectedRoute>
          }
          />



        </Route>
        <Route path="/addEmp" element={<AddEmp />} />
        <Route path="/assignleaves" element={<AssignLeaves />} />
        <Route path="/projectsemployee" element={<ProjectsEmployee />} />

  

        <Route path="/hrDashboard" element={<HRDashboard />}>
          <Route path="maindashboard" element={<MainDashboard />} />

          <Route path="employees" element={<Employees />} />
          {/* <Route path="jobs" element={<Jobs />} /> */}
          <Route path="leavescreation" element={<LeavesCreation />} />
          <Route path="leavesmanagement" element={<LeaveManagement />} />
          {/* <Route path="holidays" element={<Holidays />} /> */}
        </Route>

        <Route path="/Calender" element={<CalendarComponent />} />
        <Route path="/approvedTimesheet" element={<ApprovedTimesheet />} />

        {/* Project Manager */}

        <Route path="/pmDashboard" element={<PMDashboard />}>
          <Route path="pmmaindashboard" element={<PMMainDashboard />} />
          <Route path="pmtimesheets" element={<PMTimesheets />} />
          <Route path="pmteam" element={<PMTeam />} />
          <Route path="weektimesheet" element={<WeekTimesheet />} />
          <Route path="empleavesummary" element={<LeaveSummary />} />
          <Route path="timesheetsummary" element={<TimesheetSummary />} />

          <Route path="leavesrequest" element={<LeavesRequest />} />
          <Route path="leavesrequest" element={<LeavesRequest />} />
        </Route>
        <Route path="/pmprojectsdashboard" element={<PMProjectsDashboard />}>
          <Route path="pmprojects" element={<PMProjects />} />
          <Route path="pmtasks" element={<PMTasks />} />
        </Route>

      

        {/* Logins */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
