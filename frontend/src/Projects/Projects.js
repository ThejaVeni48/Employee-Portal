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

  

  
  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
const accessCode = useSelector((state) => state.user.accessCode) || [];


console.log("role in projects",role);
console.log("accessCode in projects",accessCode);


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

  return(
<div className="p-4 max-w-7xl border border-gray-200 rounded-lg">

  <div className="mb-4 flex items-center justify-between flex-wrap gap-4 border-2">

    <h3 className="text-xl font-semibold text-gray-900">
      Projects
    </h3>

    <div className="flex items-center gap-3 flex-wrap border-2">

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="
          w-[160px]
          border border-gray-300 rounded-md
          px-3 py-2 text-sm text-gray-700
          bg-white shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        "
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="On Hold">On Hold</option>
        <option value="Closed">Closed</option>
      </select>

      <CreateProject />

    </div>
  </div>
      <ProjectList/>

</div>


  )







}


export default Projects

