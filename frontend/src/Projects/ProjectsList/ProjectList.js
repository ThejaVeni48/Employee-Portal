import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    borderRadius: "12px",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1c3681",
    marginBottom: "1rem",
  },
  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    background: "#cfdaf1",
    color: "#1c3681",
    fontSize: "0.9rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease-in-out",
  },
  tableStyle: {
    width: "100%",
    fontSize: "0.9rem",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  headerStyle: {
    backgroundColor: "#cfdaf1",
    color: "#1c3681",
    fontSize: "13px",
    textAlign: "center",
  },
  cellStyle: {
    fontSize: "12px",
    borderBottom: "1px solid #e0e0e0",
  },
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const role = useSelector((state) => state.user.Role);

  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
  const accessCode = useSelector((state) => state.user.accessCode) || [];



  const navigate = useNavigate();

  useEffect(() => {
    showProjects();
  }, []);

  const showProjects = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getProject?companyId=${companyId}&empId=${empId}&role=${role}`
      );
      const data = await res.json();
      console.log("DATA FOR PROJECTS", data);

      setProjects(data.data || []);
      setFilteredData(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const actionTemplate = (rowData) => (
    <button
      // onClick={() => handleActionClick(rowData)}
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



  return (
    <div className="p-4 max-w-7xl border border-gray-200 rounded-lg">
  <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">              Client
            </th>
<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">              Duration
            </th>
<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">              Billable
            </th>
<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">              Status
            </th>
<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">              Actions
            </th>
          </tr>
        </thead>

      <tbody className="divide-y divide-gray-100 bg-white">
  {projects.map((rowData) => (
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

      <td className="px-4 py-3 text-sm text-gray-600">
        {rowData.email}
      </td>

      {/* View Action */}
    <td className="px-4 py-3 text-sm text-gray-600 upper tracking-wider">
<button
  className="px-4 py-3 text-sm text-blue-600"
  onClick={() =>
    navigate("/projectassignment", { state: { rowData } })
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
