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
  const [editDVisible, setEditDVisible] = useState(false);
  const companyId = useSelector((state) => state.user.companyId);
 const email = useSelector((state) => state.user.email);
   const [selectedRow, setSelectedRow] = useState(null);
 
  console.log("companyId",companyId);
  
   const navigate = useNavigate();

    const [roleCode,setRoleCode] = useState('');
  const [newStatus, setNewStatus] = useState(null);

    const userId = useSelector((state) => state.userId);
  

  const [refresh, setRefresh] = useState(false);

    const isEditMode = !!selectedRow?.ROLE_CODE;


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
    },
    button: {
      padding: "0.5rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "white",
      cursor: "pointer",
    },
    tableStyle: {
      width: "100%",
      fontSize: "0.9rem",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    headerStyle: {
      backgroundColor: "#cfdaf1",
      color: "#1c3681",
      fontSize: "13px",
    },
    cellStyle: {
      fontSize: "12px",
      borderBottom: "1px solid #e0e0e0",
    },
    dialogBody: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    dangerBtn: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  const statusOptions = [
    { label: "Active", value: "A" },
   
    { label: "Inactive", value: "I" }
  ];

  /* ---------------- FETCH ROLES ---------------- */
  useEffect(() => {
    fetch(`http://localhost:3001/api/getOrgRole?companyId=${companyId}`)
      .then((res) => res.json())
      .then((data) => setRoles(data.data || []))
      .catch(console.error);
  }, [companyId, refresh]);

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (!searchQuery) setFilteredData(roles);
    else {
      const q = searchQuery.toLowerCase();
      setFilteredData(
        roles.filter((r) =>
          r.ROLE_NAME?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, roles]);

  /* ---------------- ACTION COLUMN ---------------- */
  const actionTemplate = (rowData) => {
    if (rowData.ROLE_STATUS === "Inactive") {
      return <span style={{ color: "#999" }}>Inactive</span>;
    }

    return (
      <button
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        onClick={() => {
          setSelectedRow(rowData);
          setEditDVisible(true);
        }}
      >
        <HiOutlineDotsHorizontal />
      </button>
    );
  };
// craete role
  const handleCreateRole = async () => {
  };


  /* ---------------- DEACTIVATE ROLE ---------------- */
  const handleDeactivateRole = async () => {
    if (!selectedRow) return;

    const confirm = window.confirm(
      "Are you sure you want to make this role inactive?"
    );
    if (!confirm) return;

    const res = await fetch(
      "http://localhost:3001/api/inactiveRole",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId:companyId,
          roleCode: selectedRow.ROLE_CODE,
          email,

        }),
      }
    );

    const data = await res.json();
    if (data.success) {
      alert("Role marked as inactive");
      setVisible(false);
      setSelectedRow(null);
      setRefresh((p) => !p);
    } else {
      alert(data.message || "Unable to deactivate role");
    }
  };

  const handleFileChange = async (e) => {
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
          style={styles.tableStyle}
        >
          <Column
            field="ROLE_NAME"
            header="Role Name"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
            body={(row) => (
              <button
                style={{ background: "none", border: "none", color: "blue" }}
                onClick={() =>
                  navigate("/adminDashboard/orgdesignations", {
                    state: { roleCode: row.ROLE_CODE },
                  })
                }
              >
                {row.ROLE_NAME}
              </button>
            )}
          />
          <Column field="ROLE_CODE" header="Code" />
          <Column field="ROLE_DESCRIPTION" header="Description" />
          <Column field="ROLE_STATUS" header="Status" />
          <Column header="Action" body={actionTemplate} />
        </DataTable>
      </Card>

      {/* ---------------- EDIT / INACTIVATE DIALOG ---------------- */}
      <Dialog
        header="Role Actions"
        visible={editDVisible}
        style={{ width: "30vw" }}
        onHide={() => setEditDVisible(false)}
      >
        {selectedRow && (
          <div style={styles.dialogBody}>
            <strong>{selectedRow.ROLE_NAME}</strong>
            <p>Code: {selectedRow.ROLE_CODE}</p>
            <p>Status: {selectedRow.ROLE_STATUS}</p>

            {selectedRow.ROLE_STATUS === "Active" && (
              <button
                style={styles.dangerBtn}
                onClick={handleDeactivateRole}
              >
                Make Inactive
              </button>
            )}
          </div>
        )}
      </Dialog>

      {/* ---------------- add DIALOG ---------------- */}
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
