import React, { useState, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Card } from "primereact/card";
import {  useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


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




const ProjectHolidays = ()=>{


          const [filteredData, setFilteredData] = useState([]);
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
      header="Holiday"
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
                field="CLIENT_NAME"
                header="End Date"
                headerStyle={styles.headerStyle}
                bodyStyle={styles.cellStyle}
              />
              
    
              <Column
                field="STATUS"
                header="Days"
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
        </>
    )




}



export default ProjectHolidays