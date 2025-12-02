import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const TimeSheetsInfo = () => {
  const nav = useNavigate();
  const userId = useSelector((state) => state.userId);
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);
  const firstName = useSelector((state) => state.firstName);
  const lastName = useSelector((state) => state.lastName);
  const [weeks, setWeeks] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [leavesData] = useState([]);

  const firstLetter = firstName ? firstName[0] : "";
  const lastLetter = lastName ? lastName[0] : "";

  // --- Inline styles ---
  const styles = {
    container: { minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "1.5rem" },
    card: { borderRadius: "12px", backgroundColor: "white", padding: "1.5rem" },
    title: { fontSize: "1.25rem", fontWeight: "600", color: "#1c3681", marginBottom: "1rem" },
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
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      border: "none",
      background: "#cfdaf1",
      color: "#1c3681",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    },
    tableStyle: {
      width: "100%",
      fontSize: "0.9rem",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    headerStyle: { backgroundColor: "#cfdaf1", color: "#1c3681", fontSize: "13px" },
    cellStyle: { textAlign: "center", fontSize: "13px", borderBottom: "1px solid #e0e0e0" },
  };

  // --- Date to Week Calculation ---
  useEffect(() => {
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function getPreviousWeeks(numberOfWeeks = 5) {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
      const recentMonday = new Date(currentDate);
      recentMonday.setDate(currentDate.getDate() - diffToMonday);

      const weekArray = [];

      for (let i = 0; i < numberOfWeeks; i++) {
        const start = new Date(recentMonday);
        start.setDate(recentMonday.getDate() - i * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 4);

        const fullDates = [];
        for (let j = 0; j < 5; j++) {
          const day = new Date(start);
          day.setDate(start.getDate() + j);
          fullDates.push(formatDate(day));
        }

        weekArray.push({
          startWeek: formatDate(start),
          endWeek: formatDate(end),
          fullDates,
        });
      }

      return weekArray;
    }

    const pastWeeks = getPreviousWeeks();
    setWeeks(pastWeeks);
  }, []);

  useEffect(() => {
    if (weeks.length > 0 && empId) status();
  }, [weeks]);

  // --- Fetch status from API ---
  const status = async () => {
    try {
      const formattedDates = weeks.map((week) => week.startWeek);

      const response = await fetch("http://localhost:3001/api/getStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: formattedDates, userId, companyId, empId }),
      });

      if (!response.ok) throw new Error("Failed to fetch timesheet status");
      const result = await response.json();

      const statusObj = {};
      if (result.data?.length) {
        result.data.forEach((item) => {
          const formattedDate = new Date(item.date);
          const newFormattedDate = formattedDate.toISOString().split("T")[0];
          statusObj[newFormattedDate] = {
            status: item.status,
            hours: item.totalHours,
            timesheetId: item.timesheetId,
            remarks: item.remarks,
            empId: item.empId,
            companyId: item.companyId,
          };
        });
      }
      setStatusMap(statusObj);
    } catch (error) {
      console.error("Error fetching timesheet status:", error.message);
    }
  };

  // --- Navigation handlers ---
  const handleNav = async (dates) => {
    const [leavesRes, holidaysRes] = await Promise.all([
      fetch("http://localhost:3001/api/checkLeaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates, empId, companyId }),
      }),
      fetch("http://localhost:3001/api/checkHolidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates, companyId }),
      }),
    ]);

    const leavesResult = await leavesRes.json();
    const holidaysResult = await holidaysRes.json();

    nav("/TimeSheetEntries", {
      state: {
        dates,
        triggered: "openButton",
        apiData: leavesResult.data,
        holidays: holidaysResult.data,
      },
    });
  };

  const openTimeSheet = (info, dates) =>
    nav("/TimeSheetEntries", {
      state: {
        timeSheetId: info.timeSheetId,
        hours: info.hours,
        triggered: "ViewButton",
        dates,
        companyId: info.companyId,
      },
    });

  const openSaved = (info, dates) =>
    nav("/TimeSheetEntries", {
      state: {
        timeSheetId: info.timeSheetId,
        dates,
        triggered: "saveButton",
        companyId,
        empId,
      },
    });

  const editTimesheet = (info) =>
    nav("/TimesheetEntries", {
      state: {
        timeSheetId: info.timeSheetId,
        triggered: "rejectedbutton",
        status: info.status,
        remarks: info.remarks,
      },
    });

  // --- Combine weeks with statusMap for DataTable ---
  const tableData = weeks.map((week) => {
    const info = statusMap[week.startWeek] || {
      status: "Pending",
      hours: 0,
      timesheetId: 0,
    };
    return {
      weekRange: `${week.startWeek} - ${week.endWeek}`,
      status: info.status,
      hours: info.hours,
      fullDates: week.fullDates,
      info,
    };
  });

  // --- Filter logic ---
  const filteredData =
    filterStatus === "All"
      ? tableData
      : tableData.filter((row) => row.status === filterStatus);

  // --- Renderers ---
  const actionTemplate = (rowData) => {
    const { status } = rowData.info;
    return (
      <>
        {status === "Pending" && (
          <button
            style={styles.button}
            onClick={() => handleNav(rowData.fullDates)}
          >
            Open
          </button>
        )}
        {status === "Saved" && (
          <button
            style={styles.button}
            onClick={() => openSaved(rowData.info, rowData.fullDates)}
          >
            Open
          </button>
        )}
        {(status === "Submitted" || status === "Approved") && (
          <button
            style={styles.button}
            onClick={() => openTimeSheet(rowData.info, rowData.fullDates)}
          >
            View
          </button>
        )}
        {status === "Rejected" && (
          <button
            style={styles.button}
            onClick={() => editTimesheet(rowData.info)}
          >
            Edit
          </button>
        )}
      </>
    );
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.title}>Weekly Timesheets</div>

        <div style={styles.toolbar}>
          <div style={styles.buttonGroup}>
            {["All", "Approved", "Submitted", "Rejected", "Pending"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    ...styles.button,
                    backgroundColor:
                      filterStatus === status ? "#1c3681" : "#cfdaf1",
                    color: filterStatus === status ? "white" : "#1c3681",
                    fontWeight: filterStatus === status ? "600" : "500",
                  }}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Date"
          />
        </div>

        <DataTable
          value={filteredData}
          paginator
          rows={7}
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="No timesheets found."
          style={styles.tableStyle}
        >
          <Column
            field="weekRange"
            header="Week"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="status"
            header="Status"
            headerStyle={styles.headerStyle}
            bodyStyle={styles.cellStyle}
          />
          <Column
            field="hours"
            header="Hours"
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
    </div>
  );
};

export default TimeSheetsInfo;
