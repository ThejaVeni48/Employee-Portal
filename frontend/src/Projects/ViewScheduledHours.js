import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";

/* ---------- Styles ---------- */
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
    textAlign: "center",
  },
};

const ViewScheduledHours = ({ employees = {} }) => {
  const [projectId, setProjectId] = useState("");
  const [emp, setEmp] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const companyId = useSelector((state) => state.user.companyId);
  const accessCode = useSelector((state) => state.user.accessCode);
  const navigate = useNavigate();

  /* -------- SET PROJECT -------- */
  useEffect(() => {
    if (employees) setProjectId(employees);
  }, [employees]);

  /* -------- LOAD SCHEDULED HOURS -------- */
  useEffect(() => {
    if (projectId) {
      showProjects();
    }
  }, [projectId]);

  const showProjects = async () => {
    console.log("COMPANUID",companyId);
    console.log("projectId",projectId);
    
    try {
      const res = await fetch(
        `http://localhost:3001/api/getScheduleHours?orgId=${companyId}&projId=${projectId}`
      );
      const data = await res.json();

      console.log("DATA FOR SCHEDULED HOURS", data);

      setEmp(data.data || []);
      setFilteredData(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* -------- ACTION COLUMN -------- */
  const actionTemplate = (rowData) => (
    <button
      style={{
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
      onClick={() => {
        console.log("Row clicked:", rowData);
        // navigate(...) if needed later
      }}
    >
      <HiOutlineDotsHorizontal />
    </button>
  );

  return (
    <Card style={styles.card}>
      <DataTable
        value={filteredData}
        paginator
        rows={8}
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="No scheduled hours found."
        style={styles.tableStyle}
      >
        {/* Employee Name */}
        <Column
          field="DISPLAY_NAME"
          header="Employee"
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
        />

        {/* Month */}
        <Column
          field="month_year"
          header="Month"
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
          body={(row) => row.month_year}
        />

        {/* Total Hours */}
        <Column
          field="total_hours"
          header="Total Hours"
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
        />

        {/* Action */}
        <Column
          header="Action"
          body={actionTemplate}
          headerStyle={styles.headerStyle}
          bodyStyle={styles.cellStyle}
        />
      </DataTable>
    </Card>
  );
};

export default ViewScheduledHours;
