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


const Shifts = () => {
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
  const searchQuery = useSelector((state) => state.searchQuery);

  const [shifts, setShifts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  const [shiftName, setShiftName] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [periodType, setPeriodType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [shiftDetailType, setShiftDetailType] = useState("");
  const [desc, setDesc] = useState("");
  const [newStatus, setNewStatus] = useState(null);

  const isEditMode = !!selectedRow?.SHIFT_ID;


   const statusOptions = [
    { label: "Active", value: "Active" },
   
    { label: "Inactive", value: "Inactive" }
  ];

  //  4429007029

  /* ================= STYLES  ================= */
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
    fetch(`http://localhost:3001/api/getShifts?orgId=${companyId}`)
      .then((res) => res.json())
      .then((data) => setShifts(data.data));
  }, [refresh, companyId]);

  useEffect(() => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      setFilteredData(
        shifts.filter(
          (s) =>
            s.SHIFT_NAME?.toLowerCase().includes(term) ||
            s.SHIFT_CODE?.toLowerCase().includes(term) ||
            s.SHIFT_TYPE?.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredData(shifts);
    }
  }, [searchQuery, shifts]);

  const resetForm = () => {
    setShiftName("");
    setShiftType("");
    setShiftCode("");
    setPeriodType("");
    setStartTime("");
    setEndTime("");
    setCategory("");
    setDuration("");
    setShiftDetailType("");
    setDesc("");
    setSelectedRow(null);
  };

  const handleAdd = () => {
    resetForm();
    setVisible(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);

    setShiftName(row.SHIFT_NAME || "");
    setShiftType(row.SHIFT_TYPE || "");
    setShiftCode(row.SHIFT_CODE || "");
    setPeriodType(row.PERIOD_TYPE || "");
    setStartTime(row.START_TIME || "");
    setEndTime(row.END_TIME || "");
    setCategory(row.CATEGORY || "");
    setDuration(row.DURATION || "");
    setShiftDetailType(row.SHIFT_DETAIL_TYPE || "");
    setDesc(row.DESCRIPTION || "");
    setNewStatus(row.STATUS || '');
    setVisible(true);
  };

  const handleSubmit = async () => {
    const payload = {
      shiftType:selectedRow?.SHIFT_TYPE || shiftType,
      shiftCode:selectedRow?.SHIFT_CODE || shiftCode,
      periodType,
      startTime,
      endTime,
      category,
      duration:duration? Number(duration) :null,
      shiftDetailType,
      desc,
      orgId: companyId,
      email,
      shiftName:selectedRow?.SHIFT_NAME || shiftName,
      // shiftId: selectedRow?.SHIFT_ID,
      newStatus
    };


    console.log("payload",payload);
    



    const url = isEditMode
      ? "http://localhost:3001/api/updateShift"
      : "http://localhost:3001/api/createShifts";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await res.json();

    if (response.status === 201 || response.status === 200) {
      alert(isEditMode ? "Shift updated" : "Shift created");
      setVisible(false);
      resetForm();
      setRefresh((p) => !p);
    }
  };

  const actionTemplate = (row) => (
    <button
      style={{ border: "none", background: "transparent", cursor: "pointer" }}
      onClick={() => handleEdit(row)}
    >
      <HiOutlineDotsHorizontal />
    </button>
  );


  console.log("selected",selectedRow);
  

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Shift Management</div>

        <div style={styles.toolbar}>
          <button style={styles.button} onClick={handleAdd}>
            <IoIosAdd size={20} /> New Shift
          </button>
          <button style={styles.button}>
            <MdOutlineFileUpload size={20} /> Upload File
          </button>
        </div>

        <DataTable value={filteredData} paginator rows={8} style={styles.tableStyle}>
          <Column field="SHIFT_NAME" header="Shift" headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column field="SHIFT_CODE" header="Code" headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column field="SHIFT_TYPE" header="Type" headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column header="Action" body={actionTemplate} />
        </DataTable>
      </Card>

      <Dialog
        header={isEditMode ? "Edit Shift" : "Add Shift"}
        visible={visible}
        style={{ width: "35vw" }}
        onHide={() => setVisible(false)}
      >
        <div style={styles.dialogBody}>
          <input style={styles.input} value={shiftName} onChange={(e) => setShiftName(e.target.value)} placeholder="Shift Name" />
          <input style={styles.input} value={shiftType} onChange={(e) => setShiftType(e.target.value)} placeholder="Shift Type" />
          <input style={styles.input} value={shiftCode} onChange={(e) => setShiftCode(e.target.value)} placeholder="Shift Code" />
          <input style={styles.input} value={periodType} onChange={(e) => setPeriodType(e.target.value)} placeholder="Period Type" />
          <input style={styles.input} value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start Time" />
          <input style={styles.input} value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End Time" />
          <input style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          <input style={styles.input} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" />
          <input style={styles.input} value={shiftDetailType} onChange={(e) => setShiftDetailType(e.target.value)} placeholder="Shift Detail Type" />
          <input style={styles.input} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />

          {isEditMode && (
  <>
    <label>Status</label>
    <Dropdown
      value={newStatus}
      options={statusOptions}
      onChange={(e) => setNewStatus(e.value)}
      placeholder="Select Status"
      style={styles.input}
    />
  </>
)}


          <button style={styles.dialogButton} onClick={handleSubmit}>
            {isEditMode ? "Update Shift" : "Create Shift"}
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default Shifts;
