import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const AddDept = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [deptName, setDeptName] = useState("");
  const companyId = useSelector((state) => state.companyId);
  const createdBy = useSelector((state) => state.createdBy);
  const searchQuery = useSelector((state) => state.searchQuery);
  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    showDepartments();
  }, [refresh]);

  const showDepartments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/showDept?companyId=${companyId}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const res = await response.json();
      setDepartments(res.data || []);
      setFilteredData(res.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

useEffect(() => {
  if (searchQuery && searchQuery.trim() !== "") {
    const filtered = departments.filter(
      (item) =>
        item.DEPT_NAME?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.DEPT_ID?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  } else {
    setFilteredData(departments);
  }
}, [searchQuery, departments]);

  const createDept = async () => {
    if (!deptName.trim()) {
      alert("Please enter a department name");
      return;
    }

    try {
      const data = await fetch("http://localhost:3001/api/addDept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deptName, companyId, createdBy }),
      });
      const res = await data.json();

      if (res.status === 201) {
        alert(`${res.deptName} has been successfully created.`);
        setDeptName("");
        setVisible(false);
        setRefresh((prev) => !prev);
      } else {
        alert("Failed to create department");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
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

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Departments</div>

        <div style={styles.toolbar}>
          <button
            style={styles.button}
            onClick={() => setVisible(true)}
          >
            <IoIosAdd size={20} /> Add Department
          </button>
          <button style={styles.button}>
            <MdOutlineFileUpload size={20} /> Upload File
          </button>
        </div>

        <DataTable
          value={filteredData}
          paginator
          rows={8}
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="No departments found."
          style={styles.tableStyle}
        >
          <Column
            field="DEPT_NAME"
            header="Department Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="DEPT_CODE"
            header="Department Code"
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
        header="Add Department"
        visible={visible}
        style={{ width: "35vw", borderRadius: "12px" }}
        onHide={() => setVisible(false)}
      >
        <div style={styles.dialogBody}>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Department Name
          </label>
          <input
            type="text"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            style={styles.input}
            placeholder="Enter department name"
          />
          <button style={styles.dialogButton} onClick={createDept}>
            Add Department
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default AddDept;
