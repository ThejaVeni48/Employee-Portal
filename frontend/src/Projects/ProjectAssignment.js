import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { fetchRoles } from "../Redux/actions/roleActions";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Task from "../Tasks/Task";
import ProjectProfile from "./Profile/ProjectProfile";
import Approvals from "./Approvals";
import ProjectScheduler from "./ProjectScheduler";
import PHolidays from "./ProjectHolidays/PHolidays";
import ViewScheduledHours from "./ViewScheduledHours";
import './ProjectAssignmentStyles.css';
import { Badge, Button } from "flowbite-react";
import { TabItem, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import ProjectAssignees from "./Assignees/ProjectAssignees";

const ProjectAssignmnet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rowData = location.state?.rowData || {};
  console.log("rowData", rowData);
  const [employees, setEmployees] = useState([]);
  const companyId = useSelector((state) => state.user.companyId);
  // const [selectedEmp, setSelectedEmp] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  // const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("Yes");
  const [approveAccess, setApproveAccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [contractStartDate, setContractStartDate] = useState(null);
  const [contractEndDate, setContractEndDate] = useState(null);
  const roles = useSelector((state) => state.roles.roleList);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRoleCode, setSelectedRoleCode] = useState("");
  const accessCode = useSelector((state) => state.user.accessCode) || [];
  const [projEmployees, setProjEmployees] = useState([]);
  const email = useSelector((state) => state.user.email);
  const projectId = location.state?.rowData.PROJ_ID || "";
  const [modalVisible,setModalVisible] = useState(false);
const [selectedActionRow, setSelectedActionRow] = useState(null);
  const role = useSelector((state) => state.user.Role);
  const [inputs, setInputs] = useState({});
const [actionType, setActionType] = useState(""); // 'I' | 'E'

  const handleChange = (e) => {
    // const target = e.target;
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    // const name = target.name;
    // setInputs(values => ({...values, [name]: value}))


    const target = e.target;

    const value = target.type ==='checkbox' ? target.checked : target.value;

    const name = target.name;

    setInputs(values=>({...values,[name]:value}))
  }

  console.log("ROLE", role);
  console.log("accessCode", accessCode);

  const Hierachy = location.state?.rowData.HIERARCHY === "Y";

  console.log("hierachy", Hierachy);

  useEffect(() => {
    getEmployees();
  }, [companyId]);

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);

    // Find selected role object
    const roleObj = roles.find((r) => r.ROLE_ID.toString() === roleId);

    // Store ROLE_CODE also
    if (roleObj) {
      setSelectedRoleCode(roleObj.ROLE_CODE);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (rowData) getProjectEmployee();
  }, []);

  const getProjectEmployee = async () => {
    // console.log("getProjectEmployeee");

    const projectId = rowData.PROJ_ID;

    // console.log("projectId",projectId);

    try {
      const res = await fetch(
        `http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${projectId}`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setProjEmployees(data.data);

      // console.log("data for project assignmnet",data);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  useEffect(() => {
    if (companyId) {
      dispatch(fetchRoles(companyId));
    }
  }, [companyId]);

  const getEmployees = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getEmployees?companyId=${companyId}`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      //   console.log("data of employees",data);
      setEmployees(data.data);

      console.log("get all employees", data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log("employees");

  const filteredEmployees = employees.filter((emp) =>
    emp.DISPLAY_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleAssignProject = async () => {
    // console.log("selectedRolecode",selectedRoleCode);
    // console.log("approveAccess",approveAccess);
    // console.log("SELECTED",selectedEmp);

    // console.log("handleAssignProject");
    try {
      const response = await fetch("http://localhost:3001/api/assignProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId: selectedEmp.EMP_ID,
          role: selectedRoleCode,
          status: isActive,
          startDate: moment(startDate).format("YYYY-MM-DD"),
          contractStart: moment(contractStartDate).format("YYYY-MM-DD"),
          contractEnd: moment(contractEndDate).format("YYYY-MM-DD"),
          approveAccess,
          email,
          orgId: companyId,
          projId: rowData.PROJ_ID,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Network response was not ok: ${errText}`);
      }

      const res = await response.json();
      getProjectEmployee();
      // console.log("Assign project response:", res);
      setVisible(false);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  const actionTemplate = (rowData) => (
    <button
      onClick={() => handleActionClick(rowData)}
      style={{
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
    >
      <HiOutlineDotsHorizontal />
    </button>
  );


 
const handleActionClick = (rowData) => {
  setSelectedActionRow(rowData);
  setModalVisible(true);
};

  const handleSelectEmp = (emp) => {
    // console.log("Selected Employee:", emp);
    setSelectedEmp(emp);
  };


  const handleSave = async()=>{
    console.log("clciked saved",selectedActionRow.EMP_ID);
    console.log("inputs.value saved",Object.keys(inputs).toString());


    

   try {
      const response = await fetch("http://localhost:3001/api/changeStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId: selectedActionRow.EMP_ID,
          role: selectedRoleCode,
          status: isActive,
          contractStart: moment(contractStartDate).format("YYYY-MM-DD"),
          contractEnd: moment(contractEndDate).format("YYYY-MM-DD"),
          // approveAccess,
          email,
          orgId: companyId,
          projId: selectedActionRow.PROJ_ID,
          checkedValue:actionType,

          // checkedValue:Object.keys(inputs).toString()
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Network response was not ok: ${errText}`);
      }

      const res = await response.json();
      console.log("res",res);
      
      if(res.status === 200)
      {
alert(res.message)
        getProjectEmployee();
        // console.log("Assign project response:", res);
        setVisible(false);
      }
    }catch (error) {
      console.error("Error occured",error);
      
    }


    
  }
  

  return (

<div className=" bg-white max-w-7xl mx-auto p-6">
  
  {/* Top Navigation */}
  <div className="mb-6">
    <button
      size="sm"
      onClick={() => navigate("/adminDashboard/projects")}
    >
      ← Projects Dashboard
    </button>
  </div>

  {/* Project Card */}
  <div className=" border border-red-200 rounded-lg p-2 shadow-sm">
    
    <div className="flex items-start justify-between">
      
      {/* Left Section */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-semibold text-gray-900">
            {rowData.PROJ_NAME}
          </h1>

          <Badge color="info" size="sm">
            {rowData.status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {rowData.PROJ_CODE}
          </span>

          <span>•</span>
<span>{rowData.CLIENT_NAME}</span>

          <span>•</span>
          <span>
            {rowData.START_DATE} - {rowData.END_DATE}
          </span>
        </div>
      </div>

     

    </div>
  </div>

  {/* tabs section */}
  <Tabs aria-label="Tabs with icons" variant="underline">
      <TabItem active title="OverView" >
     <ProjectProfile rowData={rowData}/>
      </TabItem>
      <TabItem title="Assignees" >
     <ProjectAssignees rowData={rowData}/>
      </TabItem>
      <TabItem title="Tasks" >
        This is <span className="font-medium text-gray-800 dark:text-white">Settings tab's associated content</span>.
        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
        control the content visibility and styling.
      </TabItem>
      {
        rowData.HIERARCHY === 'Y' && (
<TabItem title="Hierarchy">
        This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
        control the content visibility and styling.
      </TabItem>
        )
      }
      
       <TabItem title="Scheduled Hours">
        This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
        control the content visibility and styling.
      </TabItem>
       <TabItem title="Schedule ">
        This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
        control the content visibility and styling.
      </TabItem>
      
    </Tabs>
</div>

  );
};

export default ProjectAssignmnet;
