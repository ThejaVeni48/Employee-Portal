import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useSelector } from "react-redux";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const SSOLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [leaveName, setLeaveName] = useState("");
  const [description, setDescription] = useState("");
  const searchQuery = useSelector((state) => state.searchQuery);
  const [filteredData, setFilteredData] = useState([]);
  const [visible, setVisible] = useState(false);
 


    const [leaveCode,setLeaveCode] = useState('');
  const [newStatus, setNewStatus] = useState(null);

    const userId = useSelector((state) => state.userId);
  

  const [refresh, setRefresh] = useState(false);

        console.log("USERiD",userId);

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



  const statusOptions = [
    { label: "Active", value: "Active" },
   
    { label: "Inactive", value: "Inactive" }
  ];

  useEffect(() => {
    fetch(`http://localhost:3001/api/getSSOLeaves`)
      .then((res) => res.json())
      .then((data) => setLeaves(data.data))
      .catch((err) => console.error("Error fetching leaves:", err));
  }, [refresh]);


  


  

  useEffect(() => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      setFilteredData(
        leaves.filter(
          (item) =>
            item.LEAVE_TYPE?.toLowerCase().includes(term) ||
            item.LEAVE_CODE?.toString().includes(term)
        )
      );
    } else {
      setFilteredData(leaves);
    }
  }, [searchQuery, leaves]);


 
  const handleCreateRole = async () => {
    console.log("TRIGGGERED CREATE ROLE");

    if (!leaveName || !description) {
      alert("Please Enter the required fields.");
      return;
    }

    const res = await fetch("http://localhost:3001/api/createLeaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaveName,description,userId,leaveCode,newStatus }),
    });

    console.log("res", res);

    const response = await res.json();

    if (response.status === 201) {
      alert("Successfully created");

      setDescription("");
      setLeaveName("");
      setVisible(false);
      setRefresh((prev) => !prev);
    }
  };

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



  return (
    <div style={styles.container}>

      
       
                   <Card style={styles.card}>
        <div style={styles.title}>Leaves Management</div>

        <div style={styles.toolbar}>
          <div style={styles.buttonGroup}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setVisible(true)} style={styles.button}>
                <IoIosAdd size={20} /> New Leave
              </button>
              <button style={styles.button}>
                <MdOutlineFileUpload size={20} /> Upload File
              </button>
            </div>
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
            field="LEAVE_TYPE"
            header="LEAVE_TYPE"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="LEAVE_CODE"
            header="LEAVE_CODE"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="LEAVE_DESC"
            header="LEAVE_STATUS"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
           <Column
            field="LEAVE_STATUS"
            header="LEAVE_STATUS"
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
        header="Add Role"
        visible={visible}
        style={{ width: "35vw", borderRadius: "12px" }}
        onHide={() => setVisible(false)}
      >
        <div style={styles.dialogBody}>
          <span style={{ color: "red" }}>*</span>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Leave Name
          </label>
          <input
            type="text"
            value={leaveName}
            onChange={(e) => setLeaveName(e.target.value)}
            style={styles.input}
            placeholder="Enter department name"
          />
          <span style={{ color: "red" }}>*</span>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Leave Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            placeholder="Enter Description"
          />

           <span style={{ color: "red" }}>*</span>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Leave Code
          </label>
          <input
            type="text"
            value={leaveCode}
            onChange={(e) => setLeaveCode(e.target.value)}
            style={styles.input}
            placeholder="Enter Role Code"
          />

          <label>Status</label>
          <Dropdown
                value={newStatus}
                options={statusOptions}
                onChange={(e) => setNewStatus(e.value)}
                placeholder="Select Status"
                style={styles.dropdown}
              />
          
          <button style={styles.dialogButton} onClick={handleCreateRole}>
            Add Leave
          </button>
        </div>
      </Dialog>
      
    </div>
  );
};

export default SSOLeaves;
