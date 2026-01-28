import React from "react";
import { Badge } from "flowbite-react";









const ProjectProfile = ({ project = {} ,approvals =[]}) => {


  console.log("project",project);
  

  // console.log("project", project);


  console.log("approvals",approvals);
  
 
  const projects = project[0];


  const Hierarchy = projects.HIERARCHY;

console.log("Hierarchy",Hierarchy);

 
  




  
  

  

  return (
    <>
     
      <div className="space-y-6">
      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium text-gray-900"> {projects.START_DATE} - {projects.END_DATE}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            </div>
            <div>
              <p className="text-xs text-gray-500">Billing Type</p>
              <p className="text-sm font-medium text-gray-900">{projects.BILLABLE}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            </div>
            <div>
              <p className="text-xs text-gray-500">Team Members</p>
              <p className="text-sm font-medium text-gray-900">{projects.EMP_COUNT}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Hours</p>
              <p className="text-sm font-medium text-gray-900">{projects.TOTAL_HOURS || 0}</p>
            </div>
          </div>
        </div>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* ---------- Approval Type Card ---------- */}
  <div
    className={`bg-white rounded-lg border-2 p-4 ${
      Hierarchy
        ? "border-blue-200 bg-blue-50"
        : "border-purple-200 bg-purple-50"
    }`}
  >
    <div className="flex items-start gap-3">

      {/* Icon */}
      <div>
        {Hierarchy ? (
          <svg
            className="w-6 h-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a4 4 0 0 1-4 4h-1a3 3 0 0 0-3 3"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Approval Type
        </p>

        <p className="font-medium text-gray-900 mb-1">
          {Hierarchy
            ? "Hierarchy-Based Approval"
            : "Direct Project Manager Approval"}
        </p>

        <p className="text-xs text-gray-600">
          {Hierarchy
            ? `${approvals?.length || 1}-level approval chain`
            : "Single-step approval by Project Manager"}
        </p>

        {/* Project Manager */}
        {Hierarchy && projects?.MANAGER_NAME && (
          <div className="mt-2 pt-2 border-t border-purple-200">
            <p className="text-xs text-gray-500">Project Manager</p>
            <p className="text-sm font-medium text-gray-900">
              {projects.MANAGER_NAME}
            </p>
          </div>
        )}

        {/* Approvers List */}
        {Hierarchy && approvals?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-blue-200">
            <p className="text-xs text-gray-500 mb-1">Approvers</p>
            <div className="space-y-1">
              {approvals.map((level) => (
                <p
                  key={level.LEVEL_NO}
                  className="text-xs text-gray-900"
                >
                  L{level.LEVEL_NO}:{" "}
                  {level.DISPLAY_NAME || "Not assigned"}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* ---------- Support Identifier Card ---------- */}
  {projects?.PROJ_ID && (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Support Identifier
          </p>

          <p className="font-medium text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
            {projects.PROJ_ID} || NO 
          </p>

          <p className="text-xs text-gray-600 mt-2">
            Reference ID for tracking and support
          </p>
        </div>
      </div>
    </div>
  )}

</div>

      {/* Project Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">Project Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Project Name</label>
            <p className="text-sm text-gray-900 font-medium">{projects.PROJ_NAME}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Project Code</label>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded inline-block">{projects.PROJ_CODE}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Client</label>
            <p className="text-sm text-gray-900">{projects.CLIENT_NAME}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
             <p className="text-sm text-gray-900">{projects.STATUS}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 block mb-1">Description</label>
            <p className="text-sm text-gray-900">
             {projects.PROJ_DESC}
            </p>
          </div>
        </div>
      </div>

      
    </div>

    </>
  )
}


export default ProjectProfile