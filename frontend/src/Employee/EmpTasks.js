import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiOutlineDotsHorizontal } from "react-icons/hi";




const EmpTask =()=>{

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

   const [task,setTask] = useState([]);
     const [filteredData, setFilteredData] = useState([]);
   
const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);

   useEffect(()=>{
  
      const getTasks = async()=>{
        try {
          const data = await fetch(`http://localhost:3001/api/EmpTask?empId=${empId}&companyId=${companyId}`);
          if(!data.ok)
          {
            throw new Error("network response was not ok");
            
          }
          const  response = await data.json();
            setTask(response.data);
            setFilteredData(response.data);
            console.log("respnse",response.data);
            
  
        } catch (error) {
          console.error("Error occured",error);
          
        }
      }
      getTasks();
    },[empId,companyId])

    
     const actionTemplate = (rowData) => {
         console.log("rowData", rowData);

         return (
           <>
             <button
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


 return(
    <>
    <p>Employee Task</p>
    
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
                field="task_id"
                header="Task ID"
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
                field="task_name"
                header="Task Name"
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
                field="status"
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
    </>
 )






}

export default EmpTask