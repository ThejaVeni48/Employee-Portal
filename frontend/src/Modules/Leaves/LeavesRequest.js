import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useSelector } from "react-redux";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosCheckmark, IoIosClose } from "react-icons/io";

const LeavesRequest = () => {
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);
  const deptId = useSelector((state) => state.deptId);
  const role = useSelector((state) => state.Role);
  const searchQuery = useSelector((state) => state.searchQuery);

  const [leavesRequest, setLeavesRequest] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const styles = {
    container: {
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      background: "#f7f9fb",
    },
    card: {
      borderRadius: "12px",
      padding: "18px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      backgroundColor: "white",
      margin: "20px auto",
      maxWidth: "1100px",
    },
    title: {
      fontSize: "1.15rem",
      fontWeight: 600,
      color: "#1c3681",
      marginBottom: "12px",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "14px",
      gap: "12px",
      flexWrap: "wrap",
    },
    button: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "#1c3681",
      fontSize: "0.9rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    tableStyle: {
      width: "100%",
      fontSize: "0.95rem",
      borderRadius: "10px",
      overflow: "hidden",
    },
    headerStyle: {
      backgroundColor: "#cfdaf1",
      color: "#1c3681",
      fontSize: "13px",
      fontWeight: 600,
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "13px",
      borderBottom: "1px solid #eef2f5",
      padding: "12px 8px",
    },
    emptyMessageStyle: {
      padding: "28px",
      textAlign: "center",
      color: "#666",
    },
  };

  useEffect(() => {
    getPendingLeaves();
  }, [refresh, companyId, deptId, empId, role]);

  const getPendingLeaves = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getPendingLeaves?companyId=${companyId}&deptId=${deptId}&empId=${empId}&role=${role}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const result = await res.json();
      const dataArr = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];
      setLeavesRequest(dataArr);
      setFilteredData(dataArr);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setLeavesRequest([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const filtered = leavesRequest.filter((item) => {
        const name =
          ((item.FIRST_NAME || "") + " " + (item.LAST_NAME || "")).toLowerCase();
        return (
          name.includes(q) ||
          (item.REASON || "").toLowerCase().includes(q) ||
          (item.STATUS || "").toLowerCase().includes(q)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(leavesRequest);
    }
  }, [searchQuery, leavesRequest]);

  const nameBody = (rowData) => {
    const fullName = `${rowData.FIRST_NAME || ""} ${rowData.LAST_NAME || ""}`.trim() || "Unknown";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 600, color: "#2b2b2b" }}>{fullName}</div>
        <div style={{ color: "#888", fontSize: 12 }}>
          {rowData.EMP_ID ? `(${rowData.EMP_ID})` : null}
        </div>
      </div>
    );
  };

  const statusBody = (rowData) => {
    const status = (rowData.STATUS || "").toString().toLowerCase();
    let bg = "#fff4e5";
    let color = "#e65100";
    if (status === "approved" || status === "approve") {
      bg = "#e7f9ef";
      color = "#2e7d32";
    } else if (status === "declined" || status === "decline" || status === "rejected") {
      bg = "#ffe8e8";
      color = "#c62828";
    }
    return (
      <span
        style={{
          display: "inline-block",
          padding: "6px 12px",
          borderRadius: 20,
          background: bg,
          color,
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        {(rowData.STATUS || "Pending").toString()}
      </span>
    );
  };

  // ✅ Updated handlers to accept and use requestId
  const handleApproveLeave = async (requestId) => {
    try {
      const res = await fetch("http://localhost:3001/api/acceptRejectLeave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action: "Approved",
          comments: "Approved by manager",
        }),
      });
      const result = await res.json();
      if (result.status === 200) {
        alert(`Leave request ${requestId} approved successfully!`);
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async (requestId) => {
    try {
      const res = await fetch("http://localhost:3001/api/acceptRejectLeave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action: "Rejected",
          comments: "Rejected by manager",
        }),
      });
      const result = await res.json();
      if (result.status === 201) {
        alert(`Leave request ${requestId} rejected successfully!`);
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const actionTemplate = (rowData) => (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <button
        title="Approve"
        style={{
          border: "none",
          background: "#e7f9ef",
          color: "#2e7d32",
          padding: "6px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={() => handleApproveLeave(rowData.REQUEST_ID)}
      >
        <IoIosCheckmark size={18} />
      </button>
      <button
        title="Reject"
        style={{
          border: "none",
          background: "#ffe8e8",
          color: "#c62828",
          padding: "6px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={() => handleRejectLeave(rowData.REQUEST_ID)}
      >
        <IoIosClose size={18} />
      </button>
      <button
        title="More"
        style={{
          border: "none",
          background: "transparent",
          color: "#444",
          padding: "6px",
          cursor: "pointer",
        }}
        onClick={() => console.log("More actions for", rowData.REQUEST_ID)}
      >
        <HiOutlineDotsHorizontal size={18} />
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Leaves Requests</div>

        <div style={styles.toolbar}>
          <button
            style={styles.button}
            onClick={() =>
              filteredData.length
                ? alert("Export functionality not implemented yet.")
                : alert("No data to export")
            }
          >
            Export
          </button>

          <select
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #dcdcdc",
              background: "#fff",
            }}
            defaultValue="all"
            onChange={(e) => {
              const v = e.target.value;
              if (v === "all") setFilteredData(leavesRequest);
              else setFilteredData(leavesRequest.filter((r) => (r.STATUS || "").toLowerCase() === v));
            }}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <DataTable
          value={filteredData}
          paginator
          rows={8}
          stripedRows
          responsiveLayout="scroll"
          emptyMessage={<div style={styles.emptyMessageStyle}>No leave requests found.</div>}
          style={styles.tableStyle}
        >
          <Column header="Name" body={nameBody} headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column field="START_DATE" header="From" headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column field="END_DATE" header="To" headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column field="DAYS" header="Days" headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column field="REASON" header="Reason" headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column header="Status" body={statusBody} headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
          <Column header="Actions" body={actionTemplate} headerStyle={styles.headerStyle} bodyStyle={styles.cellStyle} />
        </DataTable>
      </Card>
    </div>
  );
};

export default LeavesRequest;
