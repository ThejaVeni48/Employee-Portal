import React from "react";
import "./EmpDashboard.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUser, FaCircleCheck } from "react-icons/fa6";
import { IoTimeSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { SlCalender } from "react-icons/sl";
import { GrScorecard } from "react-icons/gr";

const Sidebar = ({ empList, projectId }) => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.Role);
  const empId = useSelector((state) => state.empId);
  const pStatus = useSelector((state) => state.pStatus);

  console.log("empList props:", empList);
  console.log("projectId props:", projectId);
  console.log("role:", role);

  const openTimeSheet = () => navigate("/TimeSheetsInfo");
  const openLeaves = () => navigate("/LeavesDashboard", { state: { pStatus } });
  const handleLogout = () => navigate("/");
  const handleApprove = () =>
    navigate("/ApproveTimesheets", { state: { empId, role } });
  const openAllEmployees = () => navigate("/emp", { state: { empList, role } });
  const openTasks = () => navigate("/tasks", { state: { projectId } });

  const openCalender = () => {
    navigate("/Calender");
  };
  const handleAssignments = () => {
    navigate("/AssignmentsPage", { state: { role } });
  };

  const openMyProjects = () => {
    if (role === "Project Manager" || role === "Manager") {
      navigate("/pmprojects", { state: { role } });
    } else if (role === "Employee") {
      navigate("/myprojects", { state: { role } });
    }
    // else if (role === "Manager") {

    //   navigate("/manager-projects",{state:{role}});
    // }
    else {
      alert("Access not allowed for your role");
    }
  };

  return (
    <div className="navContainer">
      <nav className="menu">
        {/* <button onClick={openDashboard}>
          <MdDashboard /> Dashboard
        </button> */}
        <button onClick={openAllEmployees}>
          <FaUser /> Employees
        </button>
        <button onClick={openTimeSheet}>
          <GrScorecard /> TimeSheet
        </button>

        <button onClick={openMyProjects}>
          <IoTimeSharp /> My Projects
        </button>

        {role && role !== "Manager" && role !== "Project Manager" && (
          <button onClick={handleAssignments}>
            <FaCircleCheck style={{ marginRight: "5px" }} />
            My Assignments
          </button>
        )}

        {role && (role === "Manager" || role === "Project Manager") && (
          <button onClick={handleApprove}>
            <FaCircleCheck style={{ marginRight: "5px" }} />
            Approve TimeSheets
          </button>
        )}

        {role && role === "Project Manager" && (
          <button onClick={openTasks}>
            <FaCircleCheck style={{ marginRight: "5px" }} />
            Tasks
          </button>
        )}

        <button onClick={openLeaves}>
          <SlCalender /> Leaves
        </button>

        <button onClick={openCalender}>
          <SlCalender /> Calendar
        </button>
      </nav>

      <div>
        <button className="logoutBtn" onClick={handleLogout}>
          <BiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
