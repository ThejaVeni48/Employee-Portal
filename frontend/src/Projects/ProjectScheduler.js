import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

export default function ProjectSchedulerUI({ employees = {} }) {
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hours, setHours] = useState(Array(7).fill(""));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projEmployee, setProjEmployees] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);

  const [weeks, setWeeks] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (employees) {
      setProjectId(employees);
    }
  }, [employees]);

  console.log("projectEMployees", employees);


  useEffect(()=>{
      if(projectId)
      loadData();
  },[projectId])


const loadData = async () => {
  const startDate = moment(weeks[0]).format("YYYY-MM-DD");
  const endDate = moment(weeks[30]).format("YYYY-MM-DD");

  try {
    const [empRes, holidayRes] = await Promise.allSettled([
      fetch(`http://localhost:3001/api/getSchedule?projId=${projectId}&orgId=${companyId}`),
      fetch(`http://localhost:3001/api/checkPHolidays?startDate=${startDate}&endDate=${endDate}&orgId=${companyId}&projId=${projectId}`)
    ]);

    let employeesData = [];
    if (empRes.status === "fulfilled") {
      const json = await empRes.value.json();
      employeesData = json.data;
      setProjEmployees(json.data);
    } else {
      console.error("Employees API failed:", empRes.reason);
      setProjEmployees([]); 
    }

    let holidaysData = [];
    if (holidayRes.status === "fulfilled") {
      const json = await holidayRes.value.json();
      holidaysData = json.data;

      const blockedDays = json.data.map(item => item.START_DATE);
      setBlockedDays(blockedDays);
    } else {
      console.error("Holidays API failed:", holidayRes.reason);
      setBlockedDays([]); 
    }


  } catch (error) {
    console.error("General Error:", error);
  }
};





  const styles = {
    scrollContainer: {
      overflowX: "auto",
      whiteSpace: "nowrap",
      paddingBottom: "10px",
    },

    scrollInner: {
      display: "inline-flex",
      gap: "12px",
    },

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
      border: "3px solid red",
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
      border: "3px solid pink",
    },
    gridRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "20px",
      border: "3px solid yellow",
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

  const handleSave = async () => {
    if (!selectedEmployee) return alert("Select an employee");

    const total_hours = hours.reduce((sum, h) => sum + (parseInt(h) || 0), 0);
    const month_year = selectedDate.toISOString().slice(0, 7); // YYYY-MM

    const startDate = moment(weeks[0]).format("YYYY-MM-DD");

    const endDate = moment(weeks[30]).format("YYYY-MM-DD");

    const payload = {
      proj_id: projectId,
      emp_id: selectedEmployee.EMP_ID,
      org_id: companyId,
      month_year,
      hours,
      total_hours,
      startDate,
      endDate,
      email,
    };

    console.log("payload", payload);

    try {
      const res = await fetch("http://localhost:3001/api/saveScheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error saving schedule");
    }
  };

  const handleSelect = (emp) => {
    const empId = emp.EMP_ID;

    // console.log("EMPiD",empId);

    const empData = projEmployee.find((item) => item.EMP_ID === empId);

    let getDate = "";

    if (empData.SCHEDULES.length > 0) {
      // console.log("old employee");

      const schedule = empData.SCHEDULES;
      const getEndDate = schedule.map((item) => item.SCHEDULE_ENDDATE);

      //  console.log("getEndDate",getEndDate);

      const getMaxDate = new Date(
        Math.max(...getEndDate.map((d) => new Date(d)))
      );

      //  console.log("getMaxDate",getMaxDate);

      getDate = getMaxDate;
    } else {
      getDate = new Date(emp.PROJECT_ALLOCATIONDATE);
    }

    // console.log("getDate",getDate);

    const weekDays = getWeekDays(getDate);

    console.log("weekDays", weekDays);
    setWeeks(weekDays);
    setSelectedDate(getDate);
  };


  const getWeekDays = (date) => {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7)); // move to Monday

    return Array.from({ length: 31 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

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
                onClick={() => handleSelect(emp)}
                // onClick={() => setSelectedEmployee(emp)}
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

          {/* 31–Day Schedule Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#e6e9f7",
                    color: "#1c3681",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#e6e9f7",
                    color: "#1c3681",
                  }}
                >
                  Day
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#e6e9f7",
                    color: "#1c3681",
                  }}
                >
                  Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 31 }).map((_, i) => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + i);
                const newDate = moment(d).format("YYYY-MM-DD");
                const isBlocked = blockedDays.includes(newDate);

                return (
                  <tr key={i}>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {d.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        max="24"
                        style={{
                          width: "60px",
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          textAlign: "center",
                          backgroundColor: isBlocked ? "#cdcdcd" : "white",
                        }}
                        value={hours[i] || ""}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[i] = e.target.value;
                          setHours(newHours);
                        }}
                        placeholder="0"
                        disabled={isBlocked}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button style={styles.saveBtn} onClick={handleSave}>
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
