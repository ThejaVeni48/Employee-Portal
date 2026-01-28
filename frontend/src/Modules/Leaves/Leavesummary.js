import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { useSelector } from "react-redux";
import moment from "moment";

const LeaveSummary = () => {
  const empId = useSelector((state) => state.empId);
  const companyId = useSelector((state) => state.companyId);
  const projectId = useSelector((state) => state.projectId);

  const [totalLeaves, setTotalLeaves] = useState(0);
  const [usedLeaves, setUsedLeaves] = useState(0);
  const [availableLeaves, setAvailableLeaves] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [leaveType, setLeaveType] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reason, setReason] = useState("");
  const [daysLeave, setDaysLeave] = useState(0);
  const [leavesHistory,setLeaveHistory] = useState([]);

  useEffect(() => {
    leavessummary();
    leaveHistory();
    getLeavesTypes();
  }, []);

  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 0;

    let count = 0;
    let current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  useEffect(() => {
    if (fromDate && toDate) {
      setDaysLeave(calculateWorkingDays(fromDate, toDate));
    }
  }, [fromDate, toDate]);

  const leavessummary = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/leavesummary?empId=${empId}&companyId=${companyId}`
      );
      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();
      console.log("response for leavesummary", response);
      const data = response.data[0];
      setLeaveBalance(response.data);
      setTotalLeaves(data?.TOTAL_LEAVES || 0);
      setUsedLeaves(data?.USED_LEAVES || 0);
      setAvailableLeaves(data?.AVAILABLE_LEAVES || 0);
    } catch (error) {
      console.error("error occurred in leavessummary", error);
    }
  };

  const getLeavesTypes = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/leaveTypes?companyId=${companyId}`
      );
      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();
      console.log("response", response.data);
      setLeaveTypes(
        response.data.map((t) => ({
          label: t.LEAVE_NAME,
          value: t.LEAVE_ID,
        }))
      );
    } catch (error) {
      console.error("error occurred in getLeavesTypes", error);
    }
  };

  const leaveHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/leaveHistory?empId=${empId}&companyId=${companyId}`
      );
      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();
      console.log("response", response);
      setLeaveHistory(response.data)

    } catch (error) {
      console.error("error occurred in leaveHistory", error);
    }
  };

const handleSubmitLeave = async () => {
  if (!leaveType || !fromDate || !toDate || !reason.trim()) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  const payload = {
    empId,
    companyId,
    selectedLeaveType: leaveType, // match backend field name
    fromDate: moment(fromDate).format("YYYY-MM-DD"),
    toDate: moment(toDate).format("YYYY-MM-DD"),
    reason,
    daysLeave,
projectId  };

  console.log("payload", payload);

  try {
    const res = await fetch("http://localhost:3001/api/submitLeave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Always read the response body, even for errors
    const response = await res.json();

    if (res.status === 409) {
      alert(response.message || "Leave already applied for this date range.");
      return;
    }

    if (res.status === 200) {
      alert("Leave request submitted successfully!");
      setVisible(false);
      leaveHistory();
      leavessummary();
      // Reset form
      setLeaveType(null);
      setFromDate(null);
      setToDate(null);
      setReason("");
      setDaysLeave(0);
    } else {
      alert(response.message || "Something went wrong while submitting leave.");
    }

  } catch (error) {
    console.error("Error occurred while submitting leave:", error);
    alert("Failed to connect to the server. Please try again later.");
  }
};


  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>My Leave Summary</h2>
        <Button
          label="+ Create Leave Request"
          style={styles.createBtn}
          onClick={() => setVisible(true)}
        />
      </div>

      {/* Leave Summary Cards */}
      <div style={styles.cardContainer}>
        <div style={{ ...styles.card, backgroundColor: "#e8edff" }}>
          <p style={styles.number}>
            {totalLeaves}
            <span style={styles.total}> / 24</span>
          </p>
          <p style={styles.label}>Total Leaves</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#fff2e5" }}>
          <p style={styles.number}>
            {usedLeaves}
            <span style={styles.total}> / {totalLeaves}</span>
          </p>
          <p style={styles.label}>Used Leaves</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#e8f5ec" }}>
          <p style={styles.number}>
            {availableLeaves}
            <span style={styles.total}> / {totalLeaves}</span>
          </p>
          <p style={styles.label}>Available Leaves</p>
        </div>
      </div>

      {/* Upcoming Leaves Table */}
      <div style={styles.tableSection}>
        <h3 style={styles.subTitle}>Leaves history</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Leave Type</th>
              <th style={styles.th}>Period</th>
              <th style={styles.th}>Days</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>            </tr>
          </thead>
          <tbody>
            {
              leavesHistory.map((item)=>(
                <tr>
                  <td>{item.LEAVE_NAME}</td>
                  <td>{item.START_DATE}-{item.END_DATE}</td>
                  <td>{item.DAYS}</td>
                  <td>{item.REASON}</td>
                  <td>{item.STATUS}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Leave Request Dialog */}
      <Dialog
        header="Submit Leave Request"
        visible={visible}
        style={{ width: "32rem" }}
        modal
        onHide={() => setVisible(false)}
      >
        <div style={styles.dialogContent}>
          <label style={styles.labelField}>Leave Type</label>
          <Dropdown
            value={leaveType}
            options={leaveTypes}
            onChange={(e) => setLeaveType(e.value)}
            placeholder="Select Leave Type"
            style={styles.input}
          />

          <label style={styles.labelField}>From Date</label>
          <Calendar
            value={fromDate}
            onChange={(e) => setFromDate(e.value)}
            dateFormat="dd-mm-yy"
            showIcon
            style={styles.input}
          />

          <label style={styles.labelField}>To Date</label>
          <Calendar
            value={toDate}
            onChange={(e) => setToDate(e.value)}
            dateFormat="dd-mm-yy"
            showIcon
            style={styles.input}
          />

          <label style={styles.labelField}>Number of Working Days</label>
          <input
            type="text"
            value={daysLeave || ""}
            readOnly
            style={{
              ...styles.input,
              backgroundColor: "#f4f4f4",
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          />

          <label style={styles.labelField}>Reason</label>
          <InputTextarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            autoResize
            placeholder="Enter reason for leave"
            style={styles.input}
          />

          <div style={styles.btnRow}>
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => setVisible(false)}
            />
            <Button
              label="Submit"
              style={{ backgroundColor: "#1c3681", border: "none" }}
              onClick={handleSubmitLeave}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

// ✅ Styles
const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#fff",
    padding: "2rem",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1c3681",
    margin: 0,
  },
  createBtn: {
    // backgroundColor: "#1c3681",
    border: "none",
    fontWeight: "600",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    flex: "1 1 200px",
    borderRadius: "40px",
    padding: "1.5rem",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  number: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#000",
  },
  total: {
    fontSize: "1rem",
    color: "#555",
    marginLeft: "4px",
  },
  label: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#333",
  },
  tableSection: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  subTitle: {
    marginBottom: "1rem",
    fontWeight: "600",
    color: "#1c3681",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #e0e0e0",
    padding: "0.75rem",
    color: "#555",
    fontWeight: "600",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  labelField: {
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
  },
  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
    marginTop: "1rem",
  },
};

export default LeaveSummary;
