import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProjectsList } from "../../../apis/Project/ProjectsList";

const ProjectList = () => {
  const role = useSelector((state) => state.user.Role);
  const companyId = useSelector((state) => state.user.companyId);
    const empId = useSelector((state) => state.user.empId);


    console.log("em,pId",empId);
    console.log("em,pId",role);
    

  const navigate = useNavigate();

  const {
    data,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects", companyId,empId, role,],
    queryFn: () => ProjectsList(companyId, empId,role,),
    enabled: !!companyId && !!role,
  });

  const projectList = data?.data || [];


  console.log("projecyList",projectList);
  

  if (isPending) {
    return <p className="p-4">Loading projects...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        {error.message}
      </p>
    );
  }

  return (
    <div className="p-4 max-w-7xl border border-gray-200 rounded-lg">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">

          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Project
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Duration
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Billable
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-100 bg-white">
            {projectList.map((rowData) => (
              <tr
                key={rowData.PROJ_ID}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm font-bold text-gray-800">
                  {rowData.PROJ_NAME}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600">
                  {rowData.CLIENT_NAME}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600">
                  {rowData.START_DATE} - {rowData.END_DATE}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600">
                  {rowData.BILLABLE}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600">
                  {rowData.STATUS}
                </td>

                <td className="px-4 py-3 text-sm text-blue-600">
                  <button
                    onClick={() =>
                      navigate("/projectAssignment", {
                        state: { rowData },
                      })
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ProjectList;
