import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { IoIosAdd } from "react-icons/io";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";

const Designation = () => {
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [visible, setVisible] = useState(false);
  const [designation, setDesignation] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [description, setDescription] = useState("");
  const [newStatus, setNewStatus] = useState("Active");

  const userId = localStorage.getItem("userId");

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/getDefaultRoles");
      const data = await response.json();
      setRoles(data.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  // Fetch designations
  const fetchDesignations = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/getDefaultDesgn");
      const data = await response.json();
      setDesignations(data.data);
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchDesignations();
  }, []);

  // Filter based on selected role
  const filteredDesignations = designations.filter(
    (d) => d.ROLE_ID === selectedRole
  );

  // Save new designation
  const saveDesignation = async () => {
    if (!selectedRole) {
      alert("Please select a Role first!");
      return;
    }

    console.log("roleid",selectedRole);
    
    
    try {
      const response = await fetch("http://localhost:3001/api/createDefaultDesgn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designation,
          userId,
          description,
          roleCode,
          newStatus,
          selectedRole,
        }),
      });

      if (response.ok) {
        fetchDesignations();
        setVisible(false);
        setDesignation("");
        setRoleCode("");
        setDescription("");
        setNewStatus("Active");
      }
    } catch (err) {
      console.error("Error adding designation:", err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

      {/* -------------------------------- LEFT SIDE: ROLES -------------------------------- */}
      <div
        style={{
          width: "28%",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#f8f9fb",
        }}
      >
        <h3 style={{ color: "#1c3681", marginBottom: "15px" }}>Roles</h3>

        {roles.map((r) => (
          <div
            key={r.ROLE_ID}
            onClick={() => setSelectedRole(r.ROLE_ID)}
            style={{
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor:
                selectedRole === r.ROLE_ID ? "#dbe3f5" : "#ffffff",
              border:
                selectedRole === r.ROLE_ID
                  ? "2px solid #1c3681"
                  : "1px solid #ccc",
            }}
          >
            {r.ROLE_NAME}
          </div>
        ))}
      </div>

      {/* ------------------------------- RIGHT SIDE: DESIGNATIONS --------------------------- */}
      <div
        style={{
          width: "72%",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ color: "#1c3681" }}>Designations</h3>

          <button
            disabled={!selectedRole}
            onClick={() => setVisible(true)}
            style={{
              padding: "8px 15px",
              background: "#1c3681",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: selectedRole ? 1 : 0.5,
              cursor: selectedRole ? "pointer" : "not-allowed",
            }}
          >
            <IoIosAdd size={20} /> Add
          </button>
          <button>Upload File</button>
        </div>

        <DataTable
          value={filteredDesignations}
          paginator
          rows={6}
          stripedRows
          emptyMessage="No designations for this role."
          responsiveLayout="scroll"
        >
          <Column field="DESGN_NAME" header="Designation" />
          <Column field="DESGN_CODE" header="Code" />
          <Column field="DESGN_DESC" header="Description" />
          <Column field="DESGN_STATUS" header="Status" />
        </DataTable>
      </div>

      {/* -------------------------------- ADD DIALOG -------------------------------- */}
      <Dialog
        header="Add Designation"
        visible={visible}
        style={{ width: "400px" }}
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

          <div>
            <label>Designation Name</label>
            <InputText
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <div>
            <label>Designation Code</label>
            <InputText
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <InputText
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label>Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <button
            onClick={saveDesignation}
            style={{
              padding: "10px",
              background: "#1c3681",
              color: "white",
              borderRadius: "6px",
              border: "none",
              marginTop: "10px",
            }}
          >
            Save
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default Designation;
