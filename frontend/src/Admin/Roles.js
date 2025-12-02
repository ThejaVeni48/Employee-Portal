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
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const searchQuery = useSelector((state) => state.searchQuery);
  const [filteredData, setFilteredData] = useState([]);
  const [visible, setVisible] = useState(false);
  const companyId = useSelector((state) => state.user.companyId);
 const email = useSelector((state) => state.user.email);
  console.log("companyId",companyId);
  
   const navigate = useNavigate();

    const [roleCode,setRoleCode] = useState('');
  const [newStatus, setNewStatus] = useState(null);

    const userId = useSelector((state) => state.userId);
  

  const [refresh, setRefresh] = useState(false);

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
   fetch(`http://localhost:3001/api/getOrgRole?companyId=${companyId}`)
      .then((res) => res.json())
        .then((data) => {
      setRoles(data.data);
      console.log("RES:", data.data);
    })
      
      .catch((err) => console.error("Error fetching roles:", err));
  }, [refresh]);


  


  

  useEffect(() => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      setFilteredData(
        roles.filter(
          (item) =>
            item.ROLE_NAME?.toLowerCase().includes(term) ||
            item.ROLE_ID?.toString().includes(term)
        )
      );
    } else {
      setFilteredData(roles);
    }
  }, [searchQuery, roles]);


 
  const handleCreateRole = async () => {
    console.log("TRIGGGERED CREATE ROLE");

    if (!roleName || !description) {
      alert("Please Enter the required fields.");
      return;
    }

    const res = await fetch("http://localhost:3001/api/createOrgRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleName,description,userId,roleCode,newStatus,email,companyId }),
    });

    console.log("res", res);

    const response = await res.json();

    if (response.status === 201) {
      alert("Successfully created");

      setDescription("");
      setRoleName("");
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

// Inside your Roles component

const handleFileChange = async (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  let formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("companyId", companyId);
  formData.append("createdBy", userId);

  try {
    const res = await fetch("http://localhost:3001/api/uploadOrgRoles", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.status === 201) {
      alert("Roles uploaded successfully!");
      setRefresh((prev) => !prev); // reload table
    } else {
      alert("Failed to upload file");
    }
  } catch (err) {
    console.error("Error uploading file:", err);
    alert("Something went wrong during upload");
  }
};




  return (
    <div style={styles.container}>

      
       
                   <Card style={styles.card}>
        <div style={styles.title}>Role Management</div>

        <div style={styles.toolbar}>
          <div style={styles.buttonGroup}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setVisible(true)} style={styles.button}>
                <IoIosAdd size={20} /> New Role
              </button>
            <button
  style={styles.button}
  onClick={() => document.getElementById("fileInput").click()}
>
  <MdOutlineFileUpload size={20} /> Upload File
</button>

<input
  id="fileInput"
  type="file"
  accept=".csv, .xlsx"
  style={{ display: "none" }}
  onChange={handleFileChange}
/>

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
            field="ROLE_NAME"
            header="Role Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
            body={(rowData) => (
    <button 
onClick={() => navigate('/adminDashboard/orgdesignations', { state: { roleCode:rowData.ROLE_CODE } })
}
      style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
    >
      {rowData.ROLE_NAME}
    </button>
  )}
          />
          <Column
            field="ROLE_CODE"
            header="Code"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="ROLE_DESCRIPTION"
            header="Description"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
           <Column
            field="ROLE_STATUS"
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
        header="Add Role"
        visible={visible}
        style={{ width: "35vw", borderRadius: "12px" }}
        onHide={() => setVisible(false)}
      >
        <div style={styles.dialogBody}>
          <span style={{ color: "red" }}>*</span>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Role Name
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            style={styles.input}
            placeholder="Enter department name"
          />
          <span style={{ color: "red" }}>*</span>
          <label style={{ fontWeight: "600", color: "#2e3e50" }}>
            Role Description
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
            Role Code
          </label>
          <input
            type="text"
            value={roleCode}
            onChange={(e) => setRoleCode(e.target.value)}
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
            Add Role
          </button>
        </div>
      </Dialog>
      
    </div>
  );
};

export default Roles;
