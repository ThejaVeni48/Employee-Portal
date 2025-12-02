import React, { useState, useEffect } from "react";


import {  useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";

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


const Projects = () => {
  
  const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const role = useSelector((state) => state.user.Role);
  
  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
const accessCode = useSelector((state) => state.user.accessCode);


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

    
    <div style={styles.container}>
      
        <div style={styles.title}>Projects 111 {role}</div>



{
  (accessCode.includes('ALL_R') || accessCode.includes('PROJ_CR') || accessCode.includes('PROJ_MD') || role === 'Org Admin') && (
    <CreateProject />
  )
}


{
  (accessCode.includes('ALL_R') || accessCode.includes('PROJ_VW') || accessCode.includes('PROJ_MD') || role === 'Org Admin') && (
    <ProjectList />
  )
}

     

      
       
      

      {/* ---------- Add Project Dialog ---------- */}
      

    </div>
  );
};

export default Projects;
