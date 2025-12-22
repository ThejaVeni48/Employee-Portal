import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import * as XLSX from "xlsx";

// 9820027072

//6355822749


const Employees = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const accessCode = useSelector((state) => state.user.accessCode);

  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.user.searchQuery);

  const navigate = useNavigate();
  const location = useLocation();
  const createdBy = location.state?.createdBy || "";

  const role = useSelector((state) => state.user.Role);


  const styles = {
    container: {
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      padding: " 0 10px",
    },
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
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "#1c3681",
      fontSize: "0.9rem",
      cursor: "pointer",
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
    },
    cellStyle: {
      textAlign: "left",
      fontSize: "12px",
      borderBottom: "1px solid #e0e0e0",
    },
    dialogFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.75rem",
      marginTop: "1rem",
    },
    saveButton: {
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      cursor: "pointer",
    },
    cancelButton: {
      backgroundColor: "#ccc",
      color: "#333",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      cursor: "pointer",
    },
    dialogContainer: { border: "2px solid red", width: "30%" },

    dialogContainer: {
      width: "400px",
      maxWidth: "90%",
      borderRadius: "12px",
      padding: "1.5rem",
      backgroundColor: "#fff",
      boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
      fontFamily: "'Inter', sans-serif",
    },
    dialogHeader: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#1c3681",
      marginBottom: "1rem",
    },
    dialogText: {
      marginBottom: "1rem",
      fontSize: "0.95rem",
      color: "#333",
    },
    dropdown: {
      width: "100%",
      marginBottom: "1.5rem",
    },
    dialogFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.75rem",
    },
    saveButton: {
      backgroundColor: "#1c3681",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1.25rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 500,
      transition: "all 0.2s",
    },
    cancelButton: {
      backgroundColor: "#f2f2f2",
      color: "#333",
      border: "none",
      padding: "0.5rem 1.25rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 500,
      transition: "all 0.2s",
    },
    saveButtonHover: {
      backgroundColor: "#15306a",
    },
    cancelButtonHover: {
      backgroundColor: "#e0e0e0",
    },
  };

  useEffect(() => {
    const getAllTimesheets = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/getEmp?companyId=${companyId}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();

        setTimesheets(result.data || []);
        setFilteredData(result.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    getAllTimesheets();
  }, [refresh, companyId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        console.log("searchQuery:", searchQuery);

        const filtered = timesheets.filter(
          (item) =>
            item.DISPLAY_NAME?.toLowerCase().includes(
              searchQuery.toLowerCase()
            ) ||
            item.EMP_ID?.toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.EMAIL?.toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

        setFilteredData(filtered);
      } else {
        setFilteredData(timesheets);
      }
    }, 400);

    return () => clearInterval(handler);
  }, [searchQuery, timesheets]);

  const handleStatusFilter = (role) => {
    setFilterStatus(role);
    if (role === "All") setFilteredData(timesheets);
    else setFilteredData(timesheets.filter((item) => item.ROLE === role));
  };

  const handleActionClick = (emp) => {
    setSelectedEmp(emp);
    setNewStatus(emp.STATUS);
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedEmp || !newStatus) return;
    try {
      const response = await fetch(`http://localhost:3001/api/updateStatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId: selectedEmp.EMP_ID,
          status: newStatus,
          companyId,
          createdBy,
        }),
      });
      const result = await response.json();
      if (result.status === 200) {
        alert("Status has been saved");
        setShowModal(false);
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const actionTemplate = (rowData) => (
    <button
      onClick={() =>
        navigate("/adminDashboard/profile", {
          state: { empId: rowData.EMP_ID },
        })
      }
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { raw: false });

      if (!rows.length) {
        alert("No data found in the file!");
        return;
      }

      rows.forEach((r) => {
        if (r.hireDate)
          r.hireDate = new Date(r.hireDate).toISOString().split("T")[0];
      });

      const res = await fetch("http://localhost:3001/api/createEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employees: rows,
          companyId,
          createdBy,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
      } else {
        console.error(result);
        alert("Upload failed! Check console for details.");
      }
    } catch (err) {
      console.error("Failed to read file:", err);
      alert("Failed to read file!");
    }
  };

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Maternity Leave", value: "Maternity Leave" },
    { label: "Paternity Leave", value: "Paternity Leave" },
    { label: "Inactive", value: "Inactive" },
    { label: "Resigned", value: "Resigned" },
    { label: "Terminated", value: "Terminated" },
  ];

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Employees</div>

        <div style={styles.toolbar}>
          <div style={styles.buttonGroup}>
            {["All", "Employee", "Manager"].map((role) => (
              <button
                key={role}
                onClick={() => handleStatusFilter(role)}
                style={{
                  ...styles.button,
                  backgroundColor:
                    filterStatus === role ? "#1c3681" : "#cfdaf1",
                  color: filterStatus === role ? "white" : "#1c3681",
                  fontWeight: filterStatus === role ? "600" : "500",
                }}
              >
                {role}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/addEmp", { state: { createdBy } })}
              style={styles.button}
            >
              <IoIosAdd size={20} /> Add Employee
            </button>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              id="employeeFileInput"
              onChange={handleFileChange}
            />
            <Button
              label="Upload Employees File"
              icon="pi pi-upload"
              className="p-button-outlined"
              onClick={() =>
                document.getElementById("employeeFileInput").click()
              }
            />
          </div>
        </div>

        <DataTable
          value={filteredData}
          paginator
          rows={8}
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="No employees found."
          style={styles.tableStyle}
        >
          <Column
            field="EMP_ID"
            header="Employee ID"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="DISPLAY_NAME"
            header="Employee Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="EMAIL"
            header="Mail"
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

      <Dialog
        header="Update Employee Status"
        visible={showModal}
        style={styles.dialogContainer}
        modal
        onHide={() => setShowModal(false)}
      >
        <div>
          <p style={styles.dialogText}>
            Select new status for <strong>{selectedEmp?.DISPLAY_NAME}</strong>:
          </p>

          <Dropdown
            value={newStatus}
            options={statusOptions}
            onChange={(e) => setNewStatus(e.value)}
            placeholder="Select Status"
            style={styles.dropdown}
          />

          <div style={styles.dialogFooter}>
            <button
              style={styles.cancelButton}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button style={styles.saveButton} onClick={handleSaveStatus}>
              Update
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Employees;
