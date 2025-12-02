import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useSelector } from "react-redux";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import '../PM/Projects/PMProjects.css';


const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
  const [sideBar, setSideBar] = useState(false);
  const [selectedProject, setSelectedProject] = useState([]);
  const [projectEmp, setProjectEmp] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const styles = {
    container: { minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
    card: { borderRadius: "12px", backgroundColor: "transparent" },
    title: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1c3681",
      marginBottom: "1rem",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    buttonGroup: { display: "flex", gap: "0.75rem" },
    button: {
      padding: "0.5rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "white",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "background 0.2s ease-in-out",
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
    },
    cellStyle: {
        textAlign: "left",
      fontSize: "12px",
      borderBottom: "1px solid #e0e0e0",
    },
  };


  useEffect(()=>{

    const getProjects = async()=>{
      try {
        const data = await fetch(`http://localhost:3001/api/empProjects?empId=${empId}&companyId=${companyId}`);
        if(!data.ok)
        {
          throw new Error("network response was not ok");
          
        }
        const  response = await data.json();
          setProjects(response.data);
          setFilteredData(response.data);
          console.log("respnse",response.data);
          

      } catch (error) {
        console.error("Error occured",error);
        
      }
    }
    getProjects();
  },[empId,companyId])

  



 

  useEffect(() => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      setFilteredData(
        projects.filter(
          (item) =>
            item.PROJECT_NAME?.toLowerCase().includes(term) ||
            item.END_DATE?.toLowerCase().includes(term) ||
            item.STATUS?.toLowerCase().includes(term) ||
            item.START_DATE?.toLowerCase().includes(term) 
          
        )
      );
    } else {
      setFilteredData(projects);
    }
  }, [searchQuery, projects]);

 const actionTemplate = (rowData) => {
     console.log("rowData", rowData);
     setSelectedProject(rowData);
     const projectId = rowData.PROJECT_ID;
     const projectCode = rowData.PROJECT_CODE;
     return (
       <>
         <button
           onClick={() => openSideBar(projectId, projectCode)}
           style={{
             border: "none",
             outline: "none",
             backgroundColor: "transparent",
             cursor: "pointer",
           }}
         >
           <HiOutlineDotsHorizontal />
         </button>
       </>
     );
   };
   
  const openSideBar = (projectId, projectCode) => {
    setSideBar((prev) => !prev);
    getProjectEmployee(projectId, projectCode);
  
  };
   const getProjectEmployee = async (projectId, projectCode) => {
    const xy = projectId;
    const xx = projectCode;
    try {
      const data = await fetch(
        `http://localhost:3001/api/getProjectEmployee?companyId=${companyId}&projectId=${xy}&projectCode=${xx}`
      );

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await data.json();

      console.log("response", response.data);
      setProjectEmp(response.data);

    } catch (error) {
      console.error("Error occured", error);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>My Projects</div>

      

        <DataTable
          value={filteredData}
          paginator
          rows={8}
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="No timesheets found."
          style={styles.tableStyle}
        >
          <Column
            field="PROJECT_ID"
            header="Project ID"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="PROJECT_NAME"
            header="Project Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
                   
             <Column
            field="START_DATE"
            header="Start Date"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="END_DATE"
            header="Deadline"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
            <Column
            field="STATUS"
            header="Status"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
        
          <Column
            header="Action"
            body={actionTemplate}
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
        </DataTable>
      </Card>
      {sideBar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "320px",
            height: "100vh",
            background: "#f0f4ff",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            zIndex: 2000,
            padding: "20px",
            overflowY: "auto",
            transition: "right 0.3s ease",
            borderRadius: "10px 0 0 10px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ color: "#1c3681", margin: 0, fontSize: "0.9rem" }}>
              {selectedProject.PROJECT_NAME}
            </h3>
            <button
              onClick={() => setSideBar(false)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
                color: "#1c3681",
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              fontSize: "12px",
            }}
          >
            <p style={{ color: "#1c3681" }}>Client: </p>
            <p style={{ color: "#374151" }}>{selectedProject.CLIENT}</p>
          </div>
       
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              fontSize: "12px",
            }}
          >
            <p style={{ color: "#1c3681" }}>Project Manager:</p>
            <p style={{ color: "#374151" }}>
              {" "}
              {selectedProject.PROJECT_MANAGER}
            </p>
          </div>
             <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              fontSize: "12px",
            }}
          >
            <p style={{ color: "#1c3681" }}>Team Lead:</p>
            <p style={{ color: "#374151" }}>
              {" "}
              {selectedProject.TEAM_LEAD}
            </p>
          </div>
        

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#1c3681" }}>
              Assignees:
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {projectEmp.slice(0, 2).map((emp, index) => {
                const initials =
                  (emp.FIRST_NAME?.[0]?.toUpperCase() || "") +
                  (emp.LAST_NAME?.[0]?.toUpperCase() || "");
                return (
                  <div
                    key={index}
                    title={`${emp.FIRST_NAME} ${emp.LAST_NAME}`}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#1c3681",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "13px",
                      position: "relative",
                      left: `${index * -10}px`,
                      border: "2px solid #f0f4ff",
                      zIndex: projectEmp.length - index,
                    }}
                  >
                    {initials}
                  </div>
                );
              })}

              {projectEmp.length > 2 && (
                <button
                  onClick={() => setShowMore((prev) => !prev)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#cfdaf1",
                    color: "#1c3681",
                    fontWeight: "600",
                    fontSize: "13px",
                    border: "2px solid #f0f4ff",
                    position: "relative",
                    left: `${2 * -10}px`,
                    cursor: "pointer",
                  }}
                >
                  +{projectEmp.length - 2}
                </button>
              )}
            </div>
          </div>
    {showMore && (
            <div style={{ marginTop: "12px", marginLeft: "70px" }}>
              {projectEmp.slice(2).map((emp, index) => {
                const initials =
                  (emp.FIRST_NAME?.[0]?.toUpperCase() || "") +
                  (emp.LAST_NAME?.[0]?.toUpperCase() || "");
                return (
                  <div>
                 
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: "#1c3681",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: "13px",
                        marginRight: "10px",
                      }}
                    >
                      {initials}  
                    </div>
                
                  </div>
                    <p>
{emp.FIRST_NAME} {emp.LAST_NAME}
                  </p>
                   </div>
                );
              })}
            </div>
          )}
          
        
        </div>
      )}
    </div>
  );
};

export default MyProjects;
