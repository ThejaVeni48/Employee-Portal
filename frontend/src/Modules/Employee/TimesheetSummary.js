import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useSelector } from "react-redux";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";


const TimesheetSummary = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
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
  };



  useEffect(() => {
    if (companyId) getAllTimesheets();
  }, [companyId]);

  const getAllTimesheets = async () => {
    console.log("getAllTimesheets");
    
    try {
      const response = await fetch(
        `http://localhost:3001/api/empTimesheetSummary?orgId=${companyId}&empId=${empId}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      console.log("result",result);
      
      setTimesheets(result.data || []);
      setFilteredData(result.data || []);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    if (status === "All") {
      setFilteredData(timesheets);
    } else {
      setFilteredData(timesheets.filter((item) => item.STATUS === status));
    }
  };



  const actionTemplate = (rowData) => (
    // const timesheetId = rowData.TIMESHEET_ID;
    <button
      style={{
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
      onClick={()=>handleNav(rowData)}
    >
      <HiOutlineDotsHorizontal />
    </button>
  );

  const handleNav = (rowData) => {
    console.log("rowDtaaa",rowData);
    navigate('/employeedashboard/weektimesheet',{state: {rowData}})
    
    
  // navigate(`/employeedashboard/weektimesheet/${rowData.TIMESHEET_ID}`);};
  }

  useEffect(() => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      setFilteredData(
        timesheets.filter(
          (item) =>
            item.DISPLAY_NAME?.toLowerCase().includes(term) ||
            item.EMP_ID?.toString().includes(term) ||
            item.START_WEEK?.toLowerCase().includes(term) ||
            item.STATUS?.toLowerCase().includes(term) ||
            item.DEPT_NAME?.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredData(timesheets);
    }
  }, [searchQuery, timesheets]);

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Timesheets Overviews</div>

        <div style={styles.toolbar}>
          <div style={styles.buttonGroup}>
            {["All", "Approved", "Submit", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                style={{
                  ...styles.button,
                  backgroundColor:
                    filterStatus === status ? "#1c3681" : "#cfdaf1",
                  color: filterStatus === status ? "white" : "#1c3681",
                  fontWeight: filterStatus === status ? "600" : "500",
                  transition: "all 0.3s ease",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

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
            field="WEEK"
            header="Week Start"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
            body={(rowData) => (
        <button 
    onClick={() => navigate('/adminDashboard/weektimesheet', { state: { rowData } })
    }
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          {rowData.WEEK}
        </button>
      )}
          />
           
          <Column
            field="PROJ_ID"
            header="PROJECT ID"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />

          <Column
            field="TOTAL_HOURS"
            header="Total Hours"
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
            field="APPROVER_ID"
            header="Approved/Rejected By"
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
    </div>
  );
};

export default TimesheetSummary;
