import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

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

const EmpTimesheet = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [visible, setVisible] = useState(false);
  const [remarks, setRemarks] = useState("");

  const companyId = useSelector((state) => state.user.companyId);
    const approverId = useSelector((state) => state.user.empId);
  const location = useLocation();

const empId = location.state?.rowData?.EMP_ID || '';

// const weekId = selectedRow?.WEEK_ID;

//     console.log("weekId",weekId);
    

  const email = useSelector((state) => state.user.email);

  const [timesheetList, setTimesheetList] = useState([]);

  console.log("EMPiD", empId);

  useEffect(() => {
    getEmpTimesheet();
  }, [empId, companyId]);

  const getEmpTimesheet = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/empTimesheetSummary?orgId=${companyId}&empId=${empId}`,
      );
      const data = await res.json();
      console.log("data", data);

      setTimesheetList(data.data || []);
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  const actionTemplate = (rowData) => (
  <button
    disabled={rowData.STATUS !== "SU"}
    style={{
      border: "none",
      background: "transparent",
      cursor: rowData.STATUS === "SU" ? "pointer" : "not-allowed",
      opacity: rowData.STATUS === "SU" ? 1 : 0.4
    }}
  >
    <HiOutlineDotsHorizontal />
  </button>
);





  const handleAcceptTimesheet = async () => {
    console.log("orgId", companyId);
    console.log("selectedRow",selectedRow);
    

    const weekId = selectedRow.WEEK_ID;
      console.log("weekId",weekId);
      
      console.log("EMPLOYEEID",empId);

      console.log("approverid",approverId);
      
      

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
            empId
          }),
        });

        const result = await response.json();
        console.log("result", result);

        if (result.status === 1) {
          alert("Timesheet approved");
          setVisible(false);
        //   getWeekTimesheets();
        }
      } catch (error) {
        console.error("Error occurred", error);
      }
  };

  const handleRejectTimesheet = async () => {
    console.log("orgId", companyId);

     const weekId = selectedRow.WEEK_ID;
      console.log("ROWdATA",selectedRow);

    //    const projId = selectedRow.PROJ_ID;
      const  employeeId = selectedRow.EMP_ID;


    //   console.log("weekId",weekId);
    //   console.log("remarks",remarks);

    //   console.log("ROWdATA",selectedRow);

    //    const projId = selectedRow.PROJ_ID;
    //   const  employeeId = selectedRow.EMP_ID;

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
            // projId,
            empId:employeeId
          }),
        });

        const result = await response.json();
        console.log("result", result);

        if (result.status === 1) {
          alert("Timesheet rejected");
          setVisible(false);
        //   getWeekTimesheets();
        }
      } catch (error) {
        console.error("Error occurred", error);
      }
  };
console.log("timesheet",timesheetList);

  return (
    <>
      <p>EmpTimesheet :{empId}</p>

      <DataTable
        value={timesheetList}
        paginator
        rows={8}
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="No tasks found."
        style={styles.tableStyle}
      >
        <Column
          field="WEEK"
          header="WEEK"
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
        />
        <Column
          field="WEEK_START"
          header="WEEK_START"
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
        />
        <Column
          field="WEEK_ID"
          header="WEEK_ID"
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
        />
        <Column
          field="TOTAL_HOURS"
          header="TOTAL_HOURS"
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
        />
       
       {
        
       }
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
      </DataTable>

      <Dialog
        header="Add Role"
        visible={visible}
        style={{ width: "35vw", borderRadius: "12px" }}
        onHide={() => setVisible(false)}
      >
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
    </>
  );
};

export default EmpTimesheet;
