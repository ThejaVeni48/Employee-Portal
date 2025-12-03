import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


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


const TimesheetWeeks = ()=>{

      const [filteredData, setFilteredData] = useState([]);
const companyId = useSelector((state) => state.user.companyId);
const empId = useSelector((state) => state.user.empId);
const accessCode = useSelector((state) => state.user.accessCode);
  const role = useSelector((state) => state.user.Role);
   const [weeks,setWeeks] = useState([]);
  const navigate = useNavigate();

  //  const activeprojects = useSelector((state) => state.activeprojects.activeProjectsList);
  


  //   const projectsId = activeprojects.map((item)=>item.PROJ_ID);

  // console.log("Received projectIds in Approvals:", projectsId);
    


    const actionTemplate = (rowData) => (
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
     );


    useEffect(()=>{

      getTimesheetWeeks();
    },[])



    const getTimesheetWeeks = async()=>{
      try {
        const data = await fetch(`http://localhost:3001/api/getPendingTimesheets?orgId=${companyId}&empId=${empId}`);

        if(!data.ok)
        {
          throw new Error("Network response was not ok");
          
        }


        const res = await data.json();


        console.log("res",res);
        setWeeks(res.data || []);
        setFilteredData(res.data || [])
        
        
      } catch (error) {
        console.error("Error occured",error);
        
      }
    }
    return(
        <>
        <p>ERtzy</p>
       <Card>
             <DataTable
                              value={filteredData}
                              paginator
                              rows={8}
                              stripedRows
                              responsiveLayout="scroll"
                              emptyMessage="No tasks found."
                              style={styles.tableStyle}
                            >
                              
                              <Column
                                field="WEEK"
                                header="Week Start - Week End"
                                headerStyle={styles.headerStyle}
                                bodyStyle={styles.cellStyle}
                                body={(rowData)=>(
                                  <button 
                                  onClick={()=>navigate('/adminDashboard/timesheetapprovals',{state : {rowData}})}>
                                    {rowData.WEEK}
                                  </button>
                                )}
                      
                              />
                              <Column
                                field="SUBMITTED_COUNT"
                                header="Submitted Count"
                                headerStyle={styles.headerStyle}
                                bodyStyle={styles.cellStyle}
                              />

                              
                               
                                 {/* {
       (accessCode.includes('ALL_R') || accessCode.includes('PROJ_TASK_CR')  || role === 'Org Admin') && ( */}
                              <Column
                                header="Action"
                                body={actionTemplate}
                                headerStyle={styles.headerStyle}
                                bodyStyle={styles.cellStyle}
                              />
       {/* )
     } */}
                            </DataTable>
             </Card>
        
        
        </>
    )










}


export default TimesheetWeeks