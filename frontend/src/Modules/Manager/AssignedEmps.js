import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEye } from "react-icons/fa";








const AssignedEmps = ()=>{


  const navigate = useNavigate();

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
    dialogBody: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      padding: "10px",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
    },
    dialogButton: {
      alignSelf: "flex-end",
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      padding: "0.6rem 1.2rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

    const location = useLocation();

    const assigneesList = location.state?.assigneesList || [];


    console.log("assigneesList",assigneesList);
    

    const actionTemplate = (rowData) => (
        <button
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          
           onClick={()=>handleNav(rowData)}
        >
          <FaEye />
        </button>
      );


      const handleNav = (rowData)=>{
        console.log("rowData",rowData);

        // const empId = rowData.EMP_ID;
navigate(`/adminDashboard/EmpTimesheet`,{state:{rowData}})
        
      }


    return(
        <>
        
        <p>AssignedEmps</p>

        <DataTable
                  value={assigneesList}
                  paginator
                  rows={8}
                  stripedRows
                  responsiveLayout="scroll"
                  emptyMessage="No timesheets found."
                  style={styles.tableStyle}
                >
                  
                  <Column
                    field="DISPLAY_NAME"
                    header="Name"
                    headerStyle={styles.headerStyle}
                    bodyStyle={styles.cellStyle}
                   
                  />
                  <Column
                    field="EMP_ID"
                    header="ID"
                    headerStyle={styles.headerStyle}
                    bodyStyle={styles.cellStyle}
                  />
                  <Column
                    field="EMAIL"
                    header="EMAIL"
                    headerStyle={styles.headerStyle}
                    bodyStyle={styles.cellStyle}
                  />
                   <Column
                    field="START_DATE"
                    header="JOINING DATE"
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
                    header="View Timesheets"
                    body={actionTemplate}
                    headerStyle={styles.headerStyle}
                    bodyStyle={styles.cellStyle}
                  />
                </DataTable>
        
        
        </>
    )








}


export default AssignedEmps