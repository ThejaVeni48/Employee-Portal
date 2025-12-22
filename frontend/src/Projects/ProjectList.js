import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import {  useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";



 // ---------- Styles ----------
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



const ProjectList = ()=>{


     const [projects, setProjects] = useState([]);
      const [filteredData, setFilteredData] = useState([]);
 const role = useSelector((state) => state.user.Role);
  
  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
const accessCode = useSelector((state) => state.user.accessCode);


  const navigate = useNavigate();


  useEffect(() => {
    // getPM();
    showProjects();
  }, []);


  const showProjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/getProject?companyId=${companyId}&empId=${empId}&role=${role}`
        );
        const data = await res.json();
        console.log("DATA FOR PROJECTS",data);
        
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


    return(
        <>
<Card>
             <DataTable
              value={filteredData}
              paginator
              rows={8}
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No projects found."
              style={styles.tableStyle}
            >
              <Column
      field="PROJ_NAME"
      header="Project Name"
      headerStyle={styles.headerStyle}
      bodyStyle={styles.cellStyle}
      body={(rowData) => (
        <button 
    onClick={() => navigate('/adminDashboard/projectassignment', { state: { rowData } })
    }
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          {rowData.PROJ_NAME}
        </button>
      )}
    />
    
             
             
              <Column
                field="START_DATE"
                header="Start Date"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />
              <Column
                field="CLIENT_NAME"
                header="Client"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />
              
    
              <Column
                field="CURRENT_STATUS"
                header="Status"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />
              {
      (accessCode.includes("ALL_R") || accessCode.includes("PROJ_MD")) &&
      (
              <Column
                header="Action"
                body={actionTemplate}
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />
      )}
            </DataTable> 
</Card>

        </>
    )








}


export default ProjectList