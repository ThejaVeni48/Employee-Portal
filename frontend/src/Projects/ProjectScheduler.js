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
  const [isEditMode, setIsEditMode] = useState(false);

  const [searchEmp, setSearchEmp] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);

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

    return tempDays;
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
  const fetchMonthSchedules = async (empId, month, monthDays = days) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getSchedulers?orgId=${companyId}&empId=${empId}&projId=${projectId}&month=${month}`
      );

      const json = await res.json();

      const scheduleArr = json?.data?.schedule || [];

      if (scheduleArr.length > 0) {
        setIsEditMode(false); // disable fields if schedule exists
      } else {
        setIsEditMode(true); // enable fields if schedule empty
      }

      const filledHours = Array(monthDays.length).fill("");

      scheduleArr.forEach((item) => {
        const idx = monthDays.findIndex(
          (d) => d.format("YYYY-MM-DD") === item.date
        );
        if (idx !== -1) filledHours[idx] = item.hours;
      });

      setHours(filledHours);
    } catch (error) {
      console.error("Error fetching scheduler", error);
    }
  };

  /* ---------------- CALENDAR MATRIX ---------------- */
  const getCalendarMatrix = () => {
    if (!currentMonth) return [];
    const start = currentMonth.clone().startOf("month").startOf("isoWeek"); // Monday
    const end = currentMonth.clone().endOf("month").endOf("isoWeek");

    const matrix = [];
    let day = start.clone();

    while (day.isSameOrBefore(end)) {
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
      setIsEditMode(false);
       setIsEditMode(false);
    setSelectedEmp(null);
    setSelectedEmployee(null);
    setHours([]);
    setDays([]);
    setCurrentMonth(null);
    } catch {
      alert("Save failed");
    }
  };

  /* ---------------- SEARCH + SINGLE SELECT ---------------- */
  const filteredEmployees = projEmployee.filter(
    (emp) =>
      emp.DISPLAY_NAME.toLowerCase().includes(searchEmp.toLowerCase()) ||
      emp.EMP_ID.toString().includes(searchEmp)
  );

  const handleCheckboxSelect = (emp) => {
    setSelectedEmployee(emp);
    setSelectedEmp(emp);
    setSearchEmp("");

    const start = moment(emp.CONTRACT_START_DATE);
    const end = moment(emp.CONTRACT_END_DATE);

    const months = generateContractMonths(start, end);
    setContractMonths(months);

    const firstMonth = months[0];
    setCurrentMonth(firstMonth);

    const generatedDays = loadMonthDays(start, end, firstMonth);
    fetchMonthSchedules(emp.EMP_ID, firstMonth.format("YYYY-MM"), generatedDays);
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: 20, background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", background: "#fff", borderRadius: 10 }}>
        <div style={{ width: "25%", padding: 20, borderRight: "1px solid #ddd" }}>
          <h3>Project Employees</h3>
          <input
            type="text"
            placeholder="Search employee..."
            value={searchEmp}
            onChange={(e) => setSearchEmp(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginTop: "6px",
            }}
          />

          {searchEmp && filteredEmployees.length > 0 && (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {filteredEmployees.map((emp) => (
                <label
                  key={emp.EMP_ID}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 10px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedEmp?.EMP_ID === emp.EMP_ID}
                    onChange={() => handleCheckboxSelect(emp)}
                    style={{ marginRight: "10px" }}
                  />
                  {emp.DISPLAY_NAME}
                </label>
              ))}
            </div>
          )}

          {selectedEmp && (
            <div
              style={{
                background: "#f1f5ff",
                padding: "10px",
                borderRadius: "6px",
                fontWeight: "500",
                marginTop: "6px",
              }}
            >
              Selected: {selectedEmp.DISPLAY_NAME}
            </div>
          )}
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

              {/* Week Days */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  textAlign: "center",
                }}
              >
                {weekDays.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Calendar */}
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
                            disabled={!isEditMode}
                            value={
                              hours[idx] !== undefined && hours[idx] !== null
                                ? hours[idx]
                                : ""
                            }
                            onChange={(e) => {
                              if (!isEditMode) return;
                              const copy = [...hours];
                              copy[idx] =
                                e.target.value === "" ? "" : Number(e.target.value);
                              setHours(copy);
                            }}
                            style={{
                              width: 45,
                              marginTop: 5,
                              background: !isEditMode ? "#eee" : "#fff",
                              cursor: !isEditMode ? "not-allowed" : "text",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Edit / Save Button */}
              <div style={{ marginTop: 15 }}>
                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(true)}
                    style={{
                      padding: "10px 25px",
                      background: "#777",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      marginRight: 10,
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    style={{
                      padding: "10px 25px",
                      background: "#1c3681",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                    }}
                  >
                    Save
                  </button>
                )}
              </div>
            </>
          ) : (
            <h3>Select Employee</h3>
          )}
        </div>
      </div>
    </div>
  );
}
