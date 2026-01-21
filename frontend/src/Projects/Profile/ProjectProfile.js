import React from "react";
import { Badge } from "flowbite-react";









const ProjectProfile = ({ rowData = {} }) => {

  console.log("rowData", rowData);
  console.log("Project Name:", rowData.PROJ_NAME);

  return (
    <>
     
      <div className="space-y-6">
      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              {/* <Calendar className="w-5 h-5 text-blue-600" /> */}
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium text-gray-900"> {rowData.START_DATE} - {rowData.END_DATE}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              {/* <DollarSign className="w-5 h-5 text-emerald-600" /> */}
            </div>
            <div>
              <p className="text-xs text-gray-500">Billing Type</p>
              <p className="text-sm font-medium text-gray-900">{rowData.BILLABLE}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              {/* <Users className="w-5 h-5 text-purple-600" /> */}
            </div>
            <div>
              <p className="text-xs text-gray-500">Team Members</p>
              <p className="text-sm font-medium text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              {/* <Clock className="w-5 h-5 text-orange-600" /> */}
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Hours</p>
              <p className="text-sm font-medium text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Configuration Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`bg-white rounded-lg border-2 p-4 ${isHierarchyBased ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isHierarchyBased ? 'bg-blue-100' : 'bg-purple-100'}`}>
              {isHierarchyBased ? (
                <GitBranch className="w-6 h-6 text-blue-600" />
              ) : (
                <UserCheck className="w-6 h-6 text-purple-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Approval Type</p>
              <p className="font-medium text-gray-900 mb-1">
                {isHierarchyBased ? 'Hierarchy-Based Approval' : 'Direct Project Manager Approval'}
              </p>
              <p className="text-xs text-gray-600">
                {isHierarchyBased 
                  ? `${project.approvalLevels?.length || 3}-level approval chain`
                  : 'Single-step approval by Project Manager'
                }
              </p>
              {!isHierarchyBased && project.projectManager && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <p className="text-xs text-gray-500">Project Manager</p>
                  <p className="text-sm font-medium text-gray-900">{project.projectManager}</p>
                </div>
              )}
              {isHierarchyBased && project.approvalLevels && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">Approvers</p>
                  <div className="space-y-1">
                    {project.approvalLevels.map((level) => (
                      <p key={level.level} className="text-xs text-gray-900">
                        L{level.level}: {level.approver || 'Not assigned'}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {project.supportIdentifier && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Support Identifier</p>
                <p className="font-medium text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                  {project.supportIdentifier}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Reference ID for tracking and support
                </p>
              </div>
            </div>
          </div>
        )}
      </div> */}

      {/* Project Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">Project Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Project Name</label>
            <p className="text-sm text-gray-900 font-medium">{rowData.PROJ_NAME}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Project Code</label>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded inline-block">{rowData.PROJ_CODE}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Client</label>
            <p className="text-sm text-gray-900">{rowData.CLIENT_NAME}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            {/* <StatusBadge type="status" value={rowData.STATUS} /> */}
             <p className="text-sm text-gray-900">{rowData.STATUS}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 block mb-1">Description</label>
            <p className="text-sm text-gray-900">
             {rowData.PROJ_DESC}
            </p>
          </div>
        </div>
      </div>

      {/* Project Metrics */}
      {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">Progress & Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Overall Progress</span>
              <span className="text-gray-900 font-medium">0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tasks Completed</span>
              <span className="text-gray-900 font-medium">0</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div> */}
    </div>

    </>
  )
}


export default ProjectProfile