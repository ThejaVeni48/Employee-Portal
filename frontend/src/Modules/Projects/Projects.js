import React, { useState, useEffect } from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateProject from "./CreateProject/CreateProject";
import ProjectList from './ProjectsList/ProjectList';




const Projects = ()=>{

 const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);


 const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const role = useSelector((state) => state.user.Role);
const [refreshProjects, setRefreshProjects] = useState(false);

  

  
  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
const accessCode = useSelector((state) => state.user.accessCode) || [];


console.log("role in projects",role);
console.log("accessCode in projects",accessCode);

console.log("companyId",companyId);



  const navigate = useNavigate();
  
  

 



  


  

  
  // ---------- Global Search ----------
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== "") {
      const filtered = projects.filter(
        (item) =>
          item.PROJECT_NAME?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          item.PROJECT_LEAD?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          item.STATUS?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(projects);
    }
  }, [searchQuery, projects]);

 return (
  <div className="max-w-7xl mx-auto">

    {/* ================= HEADER BAR ================= */}
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm mb-5">

      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Projects
        </h1>
        <p className="text-xs text-gray-500">
          Track and manage active projects
        </p>
      </div>

      <div className="flex items-center gap-3">

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
            min-w-[150px]
            border border-gray-300 rounded-lg
            px-3 py-2 text-sm text-gray-700
            bg-white
            focus:outline-none
            focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-500
          "
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Closed">Closed</option>
        </select>

        {/* CREATE PROJECT BUTTON */}
        <CreateProject onSuccess={() => setRefreshProjects(prev => !prev)} />

      </div>
    </div>

    {/* ================= PROJECT LIST CARD ================= */}
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <ProjectList refresh={refreshProjects} />
    </div>

  </div>
);







}


export default Projects

