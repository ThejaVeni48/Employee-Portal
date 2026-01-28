import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useSelector } from "react-redux";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";

const LeaveManagement = () => {
  const [leavesTypes, setLeaveTypes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [leaveShortForm, setLeaveShortForm] = useState("");
  const [leaveDesc, setLeaveDesc] = useState("");
  const [days, setDays] = useState("");
  const companyId = useSelector((state) => state.companyId);
  const searchQuery = useSelector((state) => state.searchQuery);
  const [filteredData, setFilteredData] = useState([]);

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
    getLeavesTypes();
  }, []);

  const getLeavesTypes = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getLeaveTypes?companyId=${companyId}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const response = await res.json();
      console.log("response for getleavestypes", response);

      setLeaveTypes(response.data);
    } catch (error) {
      console.error("Error fetching leave types", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveType || !leaveShortForm || !leaveDesc || !days) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/leavesCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveType,
          leaveShortForm,
          leaveDesc,
          days,
          companyId,
        }),
      });

      const result = await res.json();
      if (result.status === 201) {
        alert(`${result.leaveType} has been created successfully`);
        setVisible(false);
        setLeaveType("");
        setLeaveShortForm("");
        setLeaveDesc("");
        setDays("");
        getLeavesTypes();
      }
    } catch (error) {
      console.error("Error creating leave type", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      setFilteredData(
        leavesTypes.filter(
          (item) =>
            item.DISPLAY_NAME?.toLowerCase().includes(term) ||
            item.EMP_ID?.toString().includes(term) ||
            item.DEPT_NAME?.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredData(leavesTypes);
    }
  }, [searchQuery, leavesTypes]);

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}> Add Leaves</div>

        <div style={styles.toolbar}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setVisible(true)} style={styles.button}>
              <IoIosAdd size={20} /> Add Leave Type
            </button>
            <button style={styles.button}>
              <MdOutlineFileUpload size={20} /> Upload File
            </button>
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
            field="LEAVE_NAME"
            header="Leave Type"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="DAYS"
            header="Days"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="DESCRIPTION"
            header="Description"
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
        header={
          <span style={{ fontSize: "22px", fontWeight: 600, color: "#1c3681" }}>
            Add New Leave Type
          </span>
        }
        visible={visible}
        style={{ width: "40vw", borderRadius: "10px", padding: "1rem" }}
        onHide={() => setVisible(false)}
        breakpoints={{ "960px": "75vw", "640px": "90vw" }}
      >
        <div
          style={{
            background: "#f9f9fb",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {/* Leave Type */}
            <div className="p-field">
              <label
                className="p-label"
                style={{
                  marginTop: "-20px",
                  marginLeft: "8px",
                  color: "#1c3681",
                }}
              >
                Leave Type <span style={{ color: "red" }}>•</span>
              </label>

              <InputText
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                placeholder="Leave Type"
                className="p-inputtext-lg"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="p-field">
              <label
                className="p-label"
                style={{
                  marginTop: "-20px",
                  marginLeft: "8px",
                  color: "#1c3681",
                }}
              >
                Short Form <span style={{ color: "red" }}>•</span>
              </label>

              <InputText
                value={leaveShortForm}
                onChange={(e) => setLeaveShortForm(e.target.value)}
                placeholder="Short Form"
                className="p-inputtext-lg"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="p-field">
              <label
                className="p-label"
                style={{
                  marginTop: "-20px",
                  marginLeft: "8px",
                  color: "#1c3681",
                }}
              >
                Description <span style={{ color: "red" }}>•</span>
              </label>

              <InputText
                value={leaveDesc}
                onChange={(e) => setLeaveDesc(e.target.value)}
                placeholder="Description"
                className="p-inputtext-lg"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="p-field">
              <label
                className="p-label"
                style={{
                  marginTop: "-20px",
                  marginLeft: "8px",
                  color: "#1c3681",
                }}
              >
                Days <span style={{ color: "red" }}>•</span>
              </label>

              <InputText
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Days"
                className="p-inputtext-lg"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <Button
              type="submit"
              label="Create Leave Type"
              icon="pi pi-check"
              className="p-button-rounded p-button-success p-button-lg"
              style={{ width: "100%", padding: "12px", fontWeight: 600 }}
            />
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
