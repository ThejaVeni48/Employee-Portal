import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { IoIosAdd } from "react-icons/io";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const OrgDesignation = () => {
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [visible, setVisible] = useState(false);
  const [designation, setDesignation] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [description, setDescription] = useState("");
  const [newStatus, setNewStatus] = useState("A");

  // 🔹 Added states
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [actionVisible, setActionVisible] = useState(false);

  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
  const userId = localStorage.getItem("userId");
  const location = useLocation();

  const role = location.state?.roleCode || "";

  /* ---------------- FETCH ROLES ---------------- */
  const fetchRoles = async () => {
    const res = await fetch(
      `http://localhost:3001/api/getOrgRole?companyId=${companyId}`
    );
    const data = await res.json();
    setRoles(data.data || []);
  };

  /* ---------------- FETCH DESIGNATIONS ---------------- */
  const fetchDesignations = async () => {
    const res = await fetch(
      `http://localhost:3001/api/getDesignation?companyId=${companyId}`
    );
    const data = await res.json();
    setDesignations(data.data || []);
  };

  useEffect(() => {
    fetchRoles();
    fetchDesignations();
  }, []);

  /* ---------------- FILTER DESIGNATIONS ---------------- */
  const filteredDesignations = designations.filter(
    (d) => d.ROLE_ID === selectedRole || d.ROLE_ID === role
  );

  /* ---------------- SAVE DESIGNATION ---------------- */
  const saveDesignation = async () => {
    if (!selectedRole) {
      alert("Please select a Role first!");
      return;
    }

    await fetch("http://localhost:3001/api/CreateDesignation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        designation,
        userId,
        description,
        roleCode,
        newStatus,
        selectedRole,
        companyId,
      }),
    });

    fetchDesignations();
    setVisible(false);
    setDesignation("");
    setRoleCode("");
    setDescription("");
    setNewStatus("Active");
  };

  /* ---------------- INACTIVATE DESIGNATION ---------------- */
  const handleDeactivateDesignation = async () => {
    if (!selectedDesignation) return;

    const confirm = window.confirm(
      "Are you sure you want to inactivate this designation?"
    );
    if (!confirm) return;

    const res = await fetch(
      "http://localhost:3001/api/inactiveDesignation",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          designationCode: selectedDesignation.DESGN_CODE,
          email,
        }),
      }
    );

    const data = await res.json();
    if (data.success) {
      alert("Designation marked as inactive");
      setActionVisible(false);
      setSelectedDesignation(null);
      fetchDesignations();
    } else {
      alert(data.message || "Failed to inactivate designation");
    }
  };

  /* ---------------- ACTION COLUMN ---------------- */
  const actionTemplate = (rowData) => {
    if (rowData.DESGN_STATUS === "I") {
      return <span style={{ color: "#999" }}>I</span>;
    }

    return (
      <button
        style={{ border: "none", background: "transparent", cursor: "pointer" }}
        onClick={() => {
          setSelectedDesignation(rowData);
          setActionVisible(true);
        }}
      >
        ⋯
      </button>
    );
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* ---------------- LEFT: ROLES ---------------- */}
      <div
        style={{
          width: "28%",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#f8f9fb",
        }}
      >
        <h3 style={{ color: "#1c3681" }}>Roles</h3>

        {roles.map((r) => (
          <div
            key={r.ROLE_ID}
            onClick={() => setSelectedRole(r.ROLE_ID)}
            style={{
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "6px",
              cursor: "pointer",
              background:
                selectedRole === r.ROLE_ID ? "#dbe3f5" : "#fff",
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

      {/* ---------------- RIGHT: DESIGNATIONS ---------------- */}
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
        </div>

        <DataTable
          value={filteredDesignations}
          paginator
          rows={6}
          stripedRows
          emptyMessage="No designations for this role."
        >
          <Column field="DESGN_NAME" header="Designation" />
          <Column field="DESGN_CODE" header="Code" />
          <Column field="DESGN_DESC" header="Description" />
          <Column field="DESGN_STATUS" header="Status" />
          <Column header="Action" body={actionTemplate} />
        </DataTable>
      </div>

      {/* ---------------- ADD DESIGNATION ---------------- */}
      <Dialog
        header="Add Designation"
        visible={visible}
        style={{ width: "400px" }}
        onHide={() => setVisible(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <InputText
            placeholder="Designation Name"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <InputText
            placeholder="Designation Code"
            value={roleCode}
            onChange={(e) => setRoleCode(e.target.value)}
          />
          <InputText
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            onClick={saveDesignation}
            style={{
              padding: "10px",
              background: "#1c3681",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Save
          </button>
        </div>
      </Dialog>

      {/* ---------------- ACTION DIALOG ---------------- */}
      <Dialog
        header="Designation Action"
        visible={actionVisible}
        style={{ width: "350px" }}
        onHide={() => setActionVisible(false)}
      >
        {selectedDesignation && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <strong>{selectedDesignation.DESGN_NAME}</strong>
            <span>Code: {selectedDesignation.DESGN_CODE}</span>
            <span>Status: {selectedDesignation.DESGN_STATUS}</span>

            <button
              onClick={handleDeactivateDesignation}
              style={{
                padding: "10px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Make Inactive
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default OrgDesignation;
