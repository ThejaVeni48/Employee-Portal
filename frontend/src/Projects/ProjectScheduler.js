import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

export default function ProjectSchedulerUI({ employees = {} }) {
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);

  const [projectId, setProjectId] = useState("");
  const [projEmployee, setProjEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [contractMonths, setContractMonths] = useState([]);

  /* ---------------- PROJECT ID ---------------- */
  useEffect(() => {
    if (employees) setProjectId(employees);
  }, [employees]);

  /* ---------------- LOAD EMPLOYEES ---------------- */
  useEffect(() => {
    if (projectId) loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getSchedule?projId=${projectId}&orgId=${companyId}`
      );
      const json = await res.json();
      setProjEmployees(json.data || []);
    } catch (err) {
      console.error("Employee fetch failed", err);
    }
  };

  /* ---------------- MONTH DAYS ---------------- */
  const loadMonthDays = (contractStart, contractEnd, month) => {
    const start = month.clone().startOf("month");
    const end = month.clone().endOf("month");

    const tempDays = [];
    let d = start.clone();
    while (d.isSameOrBefore(end)) {
      tempDays.push(d.clone());
      d.add(1, "day");
    }

    setDays(tempDays);
    setHours(Array(tempDays.length).fill(""));

    fetch(
      `http://localhost:3001/api/checkPHolidays?startDate=${start.format(
        "YYYY-MM-DD"
      )}&endDate=${end.format(
        "YYYY-MM-DD"
      )}&orgId=${companyId}&projId=${projectId}`
    )
      .then((res) => res.json())
      .then((json) => setBlockedDays(json.data.map((h) => h.START_DATE)))
      .catch(() => setBlockedDays([]));
  };

  /* ---------------- BLOCK LOGIC ---------------- */
  const isDateBlocked = (date) => {
    const d = date.format("YYYY-MM-DD");
    const start = moment(selectedEmployee.CONTRACT_START_DATE);
    const end = moment(selectedEmployee.CONTRACT_END_DATE);

    return (
      blockedDays.includes(d) ||
      date.isBefore(start, "day") ||
      date.isAfter(end, "day") ||
      !date.isSame(currentMonth, "month")
    );
  };

  /* ---------------- CONTRACT MONTHS ---------------- */
  const generateContractMonths = (startDate, endDate) => {
    const months = [];
    let m = moment(startDate).startOf("month");
    const end = moment(endDate).startOf("month");

    while (m.isSameOrBefore(end)) {
      months.push(m.clone());
      m.add(1, "month");
    }
    return months;
  };

  /* ---------------- FETCH SAVED SCHEDULE ---------------- */
  const fetchMonthSchedules = async (empId, month) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getSchedulers?orgId=${companyId}&empId=${empId}&projId=${projectId}&month=${month}`
      );

      if (!res.ok) throw new Error("Network error");

      const json = await res.json();
      const scheduleArr = json?.data?.schedule || [];

      const filledHours = Array(days.length).fill("");

      scheduleArr.forEach((item) => {
        const idx = days.findIndex(
          (d) => d.format("YYYY-MM-DD") === item.date
        );
        if (idx !== -1) filledHours[idx] = item.hours;
      });

      setHours(filledHours);
    } catch (error) {
      console.error("Error fetching scheduler", error);
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /* ---------------- EMPLOYEE SELECT ---------------- */
  const handleSelect = (emp) => {
    setSelectedEmployee(emp);

    const start = moment(emp.CONTRACT_START_DATE);
    const end = moment(emp.CONTRACT_END_DATE);

    const months = generateContractMonths(start, end);
    setContractMonths(months);

    const firstMonth = months[0];
    setCurrentMonth(firstMonth);

    loadMonthDays(start, end, firstMonth);

    // ✅ AUTO-LOAD SAVED MONTH DATA
    fetchMonthSchedules(emp.EMP_ID, firstMonth.format("YYYY-MM"));
  };

  /* ---------------- CALENDAR MATRIX ---------------- */
  const getCalendarMatrix = () => {
    const start = currentMonth.clone().startOf("month").startOf("isoWeek"); // Monday
    const end = currentMonth.clone().endOf("month").endOf("isoWeek");

    const matrix = [];
    let day = start.clone();

    while (day.isBefore(end)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day.clone());
        day.add(1, "day");
      }
      matrix.push(week);
    }
    return matrix;
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const payload = {
      proj_id: projectId,
      emp_id: selectedEmployee.EMP_ID,
      org_id: companyId,
      email,
      month_year: currentMonth.format("YYYY-MM"),
      startDate: days[0]?.format("YYYY-MM-DD"),
      endDate: days[days.length - 1]?.format("YYYY-MM-DD"),
      hours,
      total_hours: hours.reduce((s, h) => s + (parseInt(h) || 0), 0),
    };

    try {
      const res = await fetch("http://localhost:3001/api/saveScheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      alert(json.message);
    } catch {
      alert("Save failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: 20, background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", background: "#fff", borderRadius: 10 }}>
        <div style={{ width: "25%", padding: 20, borderRight: "1px solid #ddd" }}>
          <h3>Project Employees</h3>
          {projEmployee.map((emp) => (
            <div
              key={emp.EMP_ID}
              style={{
                padding: 10,
                borderRadius: 6,
                cursor: "pointer",
                marginBottom: 8,
                background: "#f5f7fa",
              }}
              onClick={() => handleSelect(emp)}
            >
              <b>{emp.EMP_ID}</b>
              <div>{emp.DISPLAY_NAME}</div>
            </div>
          ))}
        </div>

        <div style={{ width: "75%", padding: 20 }}>
          {selectedEmployee ? (
            <>
              <h2>{selectedEmployee.DISPLAY_NAME} Schedule</h2>

              <div style={{ marginBottom: 10 }}>
                {contractMonths.map((m) => (
                  <button
                    key={m.format("YYYY-MM")}
                    onClick={() => {
                      setCurrentMonth(m);
                      loadMonthDays(
                        moment(selectedEmployee.CONTRACT_START_DATE),
                        moment(selectedEmployee.CONTRACT_END_DATE),
                        m
                      );
                      fetchMonthSchedules(
                        selectedEmployee.EMP_ID,
                        m.format("YYYY-MM")
                      );
                    }}
                    style={{
                      padding: "6px 14px",
                      marginRight: 8,
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      background: currentMonth.isSame(m, "month")
                        ? "#1c3681"
                        : "#ddd",
                      color: currentMonth.isSame(m, "month")
                        ? "#fff"
                        : "#000",
                    }}
                  >
                    {m.format("MMMM YYYY")}
                  </button>
                ))}
              </div>
      <div  style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  textAlign:'center'
                }}>
  {weekDays.map((day) => (
    <div key={day} className="day-name">
      {day}
    </div>
  ))}
</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  border: "1px solid #ddd",
                }}
              >
                {getCalendarMatrix()
                  .flat()
                  .map((day, i) => {
                    const idx = days.findIndex((d) => d.isSame(day, "day"));
                    const blocked = isDateBlocked(day);

                    return (
                      <div
                        key={i}
                        style={{
                          minHeight: 90,
                          padding: 6,
                          textAlign: "center",
                          borderBottom: "1px solid #eee",
                          borderRight: "1px solid #eee",
                          background: blocked ? "#f5f5f5" : "#fff",
                        }}
                      >
                        <b>{day.date()}</b>
                        {!blocked && idx !== -1 && (
                          <input
                            type="number"
                            min="0"
                            max="24"
                            value={hours[idx] || ""}
                            onChange={(e) => {
                              const copy = [...hours];
                              copy[idx] = e.target.value;
                              setHours(copy);
                            }}
                            style={{ width: 45, marginTop: 5 }}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={handleSave}
                style={{
                  marginTop: 15,
                  padding: "10px 25px",
                  background: "#1c3681",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Save Schedule
              </button>
            </>
          ) : (
            <h3>Select Employee</h3>
          )}
        </div>
      </div>
    </div>
  );
}
