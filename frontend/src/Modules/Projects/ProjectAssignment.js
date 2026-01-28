import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { fetchRoles } from "../../Redux/actions/roleActions";

import { Badge } from "flowbite-react";
import { TabItem, Tabs } from "flowbite-react";

import ProjectProfile from "./Profile/ProjectProfile";
import ProjectAssignees from "./Assignees/ProjectAssignees";
import Approvals from "./Approvals";
import AddSchedules from "./Schedules/AddSchedules";



import "./ProjectAssignmentStyles.css";
import { ProjectDetails } from "../../apis/Project/ProjectDetails";
import { getProjectApprovers } from "../../apis/Project/getProjectApproverList";
import { ProjectEmp } from "../../apis/Project/ProjectEmp";
import { EmpList } from "../../apis/Employee/EmpList";
import ProjectHolidays from "./ProjectHolidays";
import PHolidays from "./ProjectHolidays/PHolidays";

const ProjectAssignmnet = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const rowData = location.state?.rowData || {};

  const dispatch = useDispatch();

  const companyId = useSelector((state) => state.user.companyId);
  const role = useSelector((state) => state.user.Role);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchRoles(companyId));
    }
  }, [companyId, dispatch]);

  const projId = rowData?.PROJ_ID;

  console.log("prjectis",projId);
  

  /* ---------------- PROJECT DETAILS ---------------- */

  const {
    data: project,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["project-details" ,projId,companyId],
    queryFn: () => ProjectDetails( projId,companyId),
    enabled: !!projId && !!companyId
  });


 const {data:approverList,isPending:isApprovers,isError:isApproverError,error:approverListError}  = useQuery({
    queryKey:["approverList",companyId,projId],
    queryFn:()=>getProjectApprovers(companyId,projId),
    enabled:!!companyId

  })


  const approverLists = approverList?.data ||[];


  const {data:projEmployee,isPending:isProjEmployeeLoading,isError:isProjEmpError,error:projEmpError} = useQuery({
    queryKey:["project-employee",companyId,projId],
    queryFn:()=>ProjectEmp(companyId,projId),
    enabled:!!projId && !!companyId


  })
  
  const projectEmpList = projEmployee?.data || [];

  console.log("projectEmpList",projectEmpList);
  

   const {data,isPending:isEmployee,isError:isEmpListError,error:empError}  = useQuery({
      queryKey:["employeesList",companyId],
      queryFn:()=>EmpList(companyId),
      enabled:!!companyId
  
    })

 const employeesList = data.data || [] ;

// const xyz = approvals;


// console.log("axyz",xyz);


  
  /* ---------------- UI STATES ---------------- */

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading project details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load project: {error?.message}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-full border-blue-400">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard/Projects")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Projects
        </button>
      </div>

      {/* Header Card */}
      <div className="rounded-lg p-3 shadow-sm bg-white mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-gray-900">
                {rowData.PROJ_NAME}
              </h1>

              <Badge color="info" size="sm">
                {rowData.STATUS}
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
                {moment(rowData.START_DATE).format("DD MMM YYYY")} -{" "}
                {moment(rowData.END_DATE).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs aria-label="Project tabs" variant="underline">
        <TabItem active title="Overview">
          <ProjectProfile project={project} approvals={approverLists} />
        </TabItem>

        <TabItem title="Assignees">
          <ProjectAssignees project={project} approvals={approverLists} projectEmpList ={projectEmpList} employeesList={employeesList}/>
        </TabItem>

        <TabItem title="Tasks">
          Coming soon...
        </TabItem>

        {rowData.HIERARCHY === "Y" && (
          <TabItem title="Hierarchy">
            <Approvals approvals={approverLists} project={project} employeesList={employeesList}/>
          </TabItem>
        )}

        <TabItem title="Holidays">
    <PHolidays/>
        </TabItem>

        <TabItem title="Schedule">
          <AddSchedules project={project} projectEmpList ={projectEmpList} />
        </TabItem>
      </Tabs>
    </div>
  );
};

export default ProjectAssignmnet;
