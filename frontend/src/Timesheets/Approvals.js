import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";



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
const Approvals = () => {

const [filterStatus, setFilterStatus] = useState("All");
const [selectedRow, setSelectedRow] = useState(null);

      const [filteredData, setFilteredData] = useState([]);
    const [weeks,setWeeks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const Navigation = useNavigate();
 const companyId = useSelector((state) => state.user.companyId);
   const empId = useSelector((state) => state.user.empId);
  const role = useSelector((state) => state.user.Role);
  const [visible,setVisible] = useState(false);
  const [remarks,setRemarks] = useState('');
  const location = useLocation();

  const weekId = location.state?.rowData.TC_MASTER_ID || '';

  console.log("weekId",weekId);
  



  // console.log("projectId",projectId);
  
  


 
const actionTemplate = (rowData) => {
  console.log("ROW FROM TEMPLATE:", rowData);
  return (
    <button
      style={{ border: "none", background: "transparent" }}
      onClick={() => {
        console.log("SELECTED:", rowData);
        setSelectedRow(rowData);
        setVisible(true);
      }}
    >
      <HiOutlineDotsHorizontal />
    </button>
  );
};




     useEffect(()=>{
       getWeekTimesheets();
     },[])


     const getWeekTimesheets = async()=>{
      try {
        const data = await fetch(`http://localhost:3001/api/getAllEmpTimesheets?orgId=${companyId}&weekId=${weekId}&empId=${empId}`);

        if(!data.ok)
        {
          throw new Error("Network response was not ok");
          
        }


        const res = await data.json();


        console.log("res for week tiemsheets",res);
        setWeeks(res.data || []);
        setFilteredData(res.data || [])
        
        
      } catch (error) {
        console.error("Error occured",error);
        
      }
     }


const handleAcceptTimesheet = async () => {

  console.log("orgId",companyId);

  console.log("weekId",weekId);
  console.log("remarks",remarks);

  console.log("ROWdATA",selectedRow);

   const projId = selectedRow.PROJ_ID;
  const  employeeId = selectedRow.EMP_ID;
  
  
  try {
    const response = await fetch("http://localhost:3001/api/acceptTimesheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "A",
        orgId: companyId,
        approverId:empId,
        weekId,
        remarks,
        projId,
        empId:employeeId
      }),
    });

    const result = await response.json();
    console.log("result", result);

    if (result.status === 1) {
      alert("Timesheet approved");
      setVisible(false);
      getWeekTimesheets();
    }
  } catch (error) {
    console.error("Error occurred", error);
  }
};




const handleRejectTimesheet = async () => {

  console.log("orgId",companyId);

  console.log("weekId",weekId);
  console.log("remarks",remarks);

  console.log("ROWdATA",selectedRow);

   const projId = selectedRow.PROJ_ID;
  const  employeeId = selectedRow.EMP_ID;
  
  
  try {
    const response = await fetch("http://localhost:3001/api/acceptTimesheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "R",
        orgId: companyId,
        approverId:empId,
        weekId,
        remarks,
        projId,
        empId:employeeId
      }),
    });

    const result = await response.json();
    console.log("result", result);

    if (result.status === 1) {
      alert("Timesheet rejected");
      setVisible(false);
      getWeekTimesheets();
    }
  } catch (error) {
    console.error("Error occurred", error);
  }
};



  return (
   <>
   <p>Approvals WAERSTYUI</p>
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
                                   field="DISPLAY_NAME"
                                   header="Employee"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                   
                         
                                 />
                                 <Column
                                   field="EMP_ID"
                                   header="EMP_ID"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                   
                         
                                 />
                                  <Column
                                   field="PROJ_ID"
                                   header="PROJ_ID"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                   
                         
                                 />
                                 <Column
                                   field="DAY1"
                                   header="Mon"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                 />
                                   <Column
                                   field="DAY2"
                                   header="Tue"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                 />
                                 <Column
                                   field="DAY3"
                                   header="Wed"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                 />
                                  <Column
                                   field="DAY4"
                                   header="Thu"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                 />
                                  <Column
                                   field="DAY5"
                                   header="Fri"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                 />
                                  <Column
                                   field="DAY6"
                                   header="Sat"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                 />
                                  <Column
                                   field="DAY7"
                                   header="Sun"
                                   headerStyle={styles.headerStyle}
                                   bodyStyle={styles.cellStyle}
                                 />
                                  <Column
                                   field="STATUS"
                                   header="STATUS"
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
                               <Dialog
                                header="Add Role"
        visible={visible}
        style={{ width: "35vw", borderRadius: "12px" }}
        onHide={() => setVisible(false)}>
 <div style={styles.dialogBody}>
  <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Role Name
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={styles.input}
            placeholder="Enter Remarks"
          />
      <button onClick={handleAcceptTimesheet}>Accept</button>
      <button onClick={handleRejectTimesheet}>Reject</button>
 </div>
                               </Dialog>
                </Card>
   </>
  )
};

export default Approvals;
