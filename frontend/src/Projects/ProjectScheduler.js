import React, { useState, useEffect } from "react";
import {  useSelector } from "react-redux";


export default function ProjectSchedulerUI({ employees = {}, orgId }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hours, setHours] = useState(Array(7).fill(""));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projEmployee, setProjEmployees] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]); 
  const companyId = useSelector((state) => state.user.companyId);

const [projectId,setProjectId] = useState('');
  




  useEffect(() => {
    if (employees) {
      setProjEmployees(employees.projEmployees || []);
      setProjectId(employees.projectId)
    }
  }, [employees]);


  console.log("employees",employees);


  console.log("projectId",projectId);
  

  

  const getWeekDays = (date) => {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7)); // move to Monday

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(selectedDate);


  // console.log("weekDays",weekDays);
  

  useEffect(() => {
    if (!selectedEmployee) return;

    const startDate = weekDays[0].toISOString().slice(0, 10);
    const endDate = weekDays[6].toISOString().slice(0, 10);
    const orgId = companyId;


console.log("startDate",startDate);
console.log("endDate",endDate);



    fetch(
      `http://localhost:3001/api/checkPHolidays?startDate=${startDate}&endDate=${endDate}&orgId=${orgId}&projId=${projectId}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data for holidays",data);
        
        // Extract all holiday dates
        const holidays = data.data.map((h) =>
          new Date(h.START_DATE).toDateString()
        );
        setBlockedDays(holidays);
      })
      .catch((err) => {
        console.error("Error fetching public holidays:", err);
        setBlockedDays([]);
      });
  }, [selectedDate, selectedEmployee, orgId, projectId]);


  console.log("holidays",blockedDays);
  
  const styles = {
    mainWrapper: {
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Inter, Arial",
    },
    container: {
      display: "flex",
      width: "80%",
      height: "calc(100vh - 80px)",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
    leftPanel: {
      width: "30%",
      borderRight: "1px solid #e0e0e0",
      padding: "25px 20px",
      display: "flex",
      flexDirection: "column",
    },
    panelTitle: {
      fontSize: "20px",
      color: "#1c3681",
      marginBottom: "20px",
      fontWeight: "600",
    },
    searchInput: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      marginBottom: "20px",
      fontSize: "14px",
    },
    empList: { overflowY: "auto", paddingRight: "5px" },
    empCard: {
      padding: "15px 15px",
      borderRadius: "12px",
      marginBottom: "15px",
      cursor: "pointer",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      background: "#fff",
    },
    empId: {
      fontWeight: "bold",
      fontSize: "14px",
      color: "#1c3681",
      marginBottom: "3px",
    },
    empName: { fontSize: "13px", color: "#444" },
    rightPanel: {
      width: "100%",
      padding: "30px 35px",
      backgroundColor: "#f9faff",
    },
    scheduleTitle: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "15px",
      color: "#1c3681",
      textAlign: "left",
    },
    datePicker: {
      padding: "10px",
      fontSize: "14px",
      marginBottom: "20px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    gridHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "10px",
    },
    gridHeaderCell: {
      width: "100px",
      backgroundColor: "#e6e9f7",
      padding: "10px 0",
      textAlign: "center",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "14px",
      color: "#1c3681",
    },
    gridRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "20px",
    },
    hourInput: {
      width: "100px",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      textAlign: "center",
      fontSize: "15px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    saveBtn: {
      padding: "12px 32px",
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
      marginTop: "10px",
    },
  };


  console.log("selectedDate",selectedDate);
  

  return (
    <div style={styles.mainWrapper}>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <h3 style={styles.panelTitle}>Employees</h3>
          <input
            type="text"
            placeholder="Search Employee..."
            style={styles.searchInput}
          />
          <div style={styles.empList}>
            {projEmployee.map((emp) => (
              <div
                key={emp.EMP_ID}
                style={styles.empCard}
                onClick={() => setSelectedEmployee(emp)}
              >
                <div style={styles.empId}>{emp.EMP_ID}</div>
                <div style={styles.empName}>{emp.DISPLAY_NAME}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.rightPanel}>
          <h2 style={styles.scheduleTitle}>
            {selectedEmployee
              ? `${selectedEmployee.DISPLAY_NAME}'s Schedule`
              : "Select Employee"}
          </h2>

          <input
            type="date"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            style={styles.datePicker}
          />

          <div style={styles.gridHeader}>
            {weekDays.map((d) => (
              <div key={d.toDateString()} style={styles.gridHeaderCell}>
                {d.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
            ))}
          </div>

          <div style={styles.gridRow}>
            {weekDays.map((d, index) => {
              const isBlocked = blockedDays.includes(d.toDateString());
              return (
                <input
                  key={index}
                  style={{
                    ...styles.hourInput,
                    backgroundColor: isBlocked ? "#cdcdcd" : "white",
                  }}
                  value={hours[index]}
                  onChange={(e) => {
                    const newHours = [...hours];
                    newHours[index] = e.target.value;
                    setHours(newHours);
                  }}
                  placeholder="0"
                  disabled={isBlocked}
                />
              );
            })}
          </div>

          <button style={styles.saveBtn}>Save Schedule</button>
        </div>
      </div>
    </div>
  );
}
