import React, { useState, useEffect } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useDispatch,useSelector } from "react-redux";
import moment from "moment";
import { MdDeleteOutline } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import {fetchTasks} from "../Redux/actions/tasksActions";

const WeekTimesheet = () => {
  const [projects, setProjects] = useState([]);
  const [days, setDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState("");
  const [timesheet, setTimesheet] = useState({});
  const [totalHours, setTotalHours] = useState({});
  const timesheetCode = useSelector((state) => state.timesheetCode);
  const [timesheetId, setTimesheetId] = useState();
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isTimesheetSubmitted, setIsTimesheetSubmitted] = useState(false);
  const location = useLocation();
  const [leaveStatus, setLeaveStatus] = useState("");
  const role = useSelector((state) => state.user.Role);
  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const tasks = useSelector((state) => state.tasks.tasksList);
  const [isFutureDate, setIsFutureDate] = useState(false);
  const dispatch = useDispatch();
  const rowData = location.state?.rowData || [];
  // const [tasks,setTasks] = useState([]);


  console.log("tasks in timesheet",tasks);
  

  const [notesVisible, setNotesVisible] = useState({});

  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState("");

  // console.log("rowData",rowData);

  // console.log("role",role);

  // console.log("rowData",rowData);

  //  console.log("timeshhet");
  useEffect(() => {
    checkFutureDate(days);
  }, [days]);

  const checkFutureDate = (weekDays) => {
    const today = moment();
    const isFuture = weekDays.some((d) => moment(d.date).isAfter(today));
    setIsFutureDate(isFuture);
  };

  useEffect(() => {
    if (!rowData || !rowData.TIMESHEET_ID) return;

    // console.log("rowdDaa",rowData);

    setTimesheetId(rowData.TIMESHEET_ID);
    // getSavedTimeSheetEntries(rowData.TIMESHEET_ID);

    // setRows([
    //   {
    //     id: rowData.TIMESHEET_ID,
    //     projectId: "0",
    //     projectName: "Internal Project",
    //   },
    // ]);

    // setTimesheet({
    //   [rowData.TIMESHEET_ID]: {
    //     [rowData.WEEK_START]: rowData.TOTAL_HOURS || 0,
    //   },
    // });

    // setTotalHours({
    //   [rowData.TIMESHEET_ID]: rowData.TOTAL_HOURS || 0,
    // });

    if (rowData.STATUS === "Submit" || rowData.STATUS === "Approved") {
      setIsTimesheetSubmitted(true);
    } else {
      setIsTimesheetSubmitted(false);
    }

    const startDate = new Date(rowData.WEEK_START);
    setCurrentDate(startDate);
    updateWeek(startDate);
  }, [rowData]);

  const updateWeek = (date) => {
    // console.log("update week");

    const monday = getMonday(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startStr = moment(monday).format("MMM DD");
    const endStr = moment(sunday).format("MMM DD, YYYY");
    setDateRange(`${startStr} - ${endStr}`);
    getSavedTimeSheetEntries(startStr, endStr);
    const weekDays = generateWeekDays(monday);
    setDays(weekDays);

    checkFutureDate(weekDays); // <-- update isFutureDate here
  };

  useEffect(() => {
    status();
    checkHolidays();
  }, []);

  useEffect(() => {
    if (days.length > 0) {
      checkHolidays();
    }
  }, [days]);

  // console.log("timesheetId",timesheetId);

  const checkHolidays = async () => {
    // console.log("check holidays trigger");

    try {
      if (!days.length) return;
      // console.log("days:", days);

      // Extract only dates from your week days
      const xyz = days.map((item) => item.date);
      // console.log("xyz (dates):", xyz);
      const weekStart = days[0].date;
      const weekEnd = days[days.length - 1].date;

      // console.log("weekEnd",weekEnd);
      // console.log("weekStart",weekStart);
      // Send both API requests in parallel
      const [leavesRes, holidaysRes] = await Promise.all([
        fetch("http://localhost:3001/api/checkLeaves", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weekEnd, weekStart, empId, companyId }),
        }),
        fetch("http://localhost:3001/api/checkHolidays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weekStart, weekEnd, companyId }),
        }),
      ]);

      // Check response validity
      if (!leavesRes.ok || !holidaysRes.ok)
        throw new Error("Failed to fetch holiday or leave data");

      // Parse both results
      const leavesResult = await leavesRes.json();
      const holidaysResult = await holidaysRes.json();
      // console.log("leavesResult",leavesResult);
      // console.log("statsus of the leave",leavesResult.data[0].STATUS)

      // if(!leavesResult && leavesResult.data.length  >0 )
      // {

      //   setLeaveStatus(leavesResult.data[0].STATUS);
      // }

      // console.log("Leaves API result:", leavesResult);
      // console.log("Holidays API result:", holidaysResult);

      // Update your state with holidays
      if (holidaysResult.data && holidaysResult.data.length > 0) {
        setHolidays(holidaysResult.data);
      } else {
        // console.log("No holidays found for this week");
        setHolidays([]);
      }

      // Update your state with leaves
      if (leavesResult.data && leavesResult.data.length > 0) {
        setLeaves(leavesResult.data);
        setLeaveStatus(leavesResult.data[0].STATUS);
      } else {
        // console.log("No leaves found for this week");
        setLeaves([]);
      }
    } catch (error) {
      console.error("Error checking holidays and leaves:", error.message);
    }
  };

  const status = async (newDate = new Date()) => {
    try {
      const monday = getMonday(newDate);
      const formattedMonday = monday.toISOString().split("T")[0];

      const response = await fetch("http://localhost:3001/api/getTimesheetId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: formattedMonday, companyId, empId }),
      });

      const result = await response.json();
      if (result.data && result.data.length > 0) {
        return result.data[0].timesheetId;
      }
      return null;
    } catch (error) {
      console.error("Error fetching timesheet ID:", error);
      return null;
    }
  };

  const [rows, setRows] = useState([{ id: Date.now(), projectId: "" }]);

  // --- Get Monday of current week ---
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // --- Generate week days ---
  const generateWeekDays = (startDate) => {
    const daysArr = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(startDate);
      next.setDate(startDate.getDate() + i);
      daysArr.push({
        label: next.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        date: moment(next).format("YYYY-MM-DD"),
      });
    }
    // checkFutureDate(date);
    return daysArr;
  };

  // --- Update week view ---

  useEffect(() => {
    updateWeek(currentDate);
    fetchProjects();
  }, [currentDate]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    const today = new Date();
    const day = today.getDay();

    // Enable submit only if today is Friday (5)
    if (day === 5) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, []);

  const fetchProjects = async () => {
    console.log("triggering fetch projects");

    try {
      const formattedDate = moment(currentDate).format("YYYY-MM-DD");
      const response = await fetch(
        `http://localhost:3001/api/empProjects?orgId=${companyId}&empId=${empId}&currentDate=${formattedDate}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProjects(data.data);

       
      const notesState = {};
      const res = data.data;


;
     

     


      res.forEach((project) => {
        notesState[project.PROJ_ID] = project.NOTES === "YES";
      });
      setNotesVisible(notesState);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // console.log("notesvisible",notesVisible);

  // --- Week navigation ---
  const handleWeekChange = async (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);

    // Update week view
    updateWeek(newDate);

    // getSavedTimeSheetEntries();
    // 1️⃣ Get the new timesheetId for that week
    // const id = await status(newDate);
    // setTimesheetId(id);

    // // 2️⃣ If an ID exists, load saved data
    // if (id) {
    //   const monday = getMonday(newDate);
    //   const sunday = new Date(monday);
    //   sunday.setDate(monday.getDate() + 6);
    //   const startStr = moment(monday).format("YYYY-MM-DD");
    //   const endStr = moment(sunday).format("YYYY-MM-DD");

    //   // console.log("startDate if id exists",startStr);

    //   await getSavedTimeSheetEntries(startStr, endStr, id);
    // }
    // else {
    //   // Reset UI if no data
    //   setTimesheet({});
    //   setTotalHours({});
    //   setRows([{ id: Date.now(), projectId: "" }]);
    // }
  };

  const handleAddRow = () => {
    const newRow = { id: Date.now(), projectId: "" };
    setRows((prev) => [...prev, newRow]);
  };

  const handleProjectChange = (rowId, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, projectId: value } : r))
    );
    const projectId = value;

dispatch(fetchTasks(companyId,projectId));    
  };

  // --- Handle hours input ---
  const handleHoursChange = (rowId, day, value) => {
    const hours = parseFloat(value) || 0;
    setTimesheet((prev) => {
      const updated = {
        ...prev,
        [rowId]: {
          ...prev[rowId],
          [day]: hours,
        },
      };
      calculateTotalHours(rowId, updated[rowId]);
      return updated;
    });
  };

  // --- Calculate total hours per row ---
  const calculateTotalHours = (rowId, rowData) => {
    const total = Object.values(rowData || {}).reduce(
      (sum, val) => sum + (isNaN(val) ? 0 : val),
      0
    );
    setTotalHours((prev) => ({
      ...prev,
      [rowId]: total.toFixed(2),
    }));
  };

  // Submit
  const handleSubmit = async () => {
    if (leaveStatus === "Pending") {
      alert("Your leave is not approved");
      return;
    }
    // console.log("leavesResult",leaves);

    // console.log("leavestatus",leaveStatus);

    try {
      const entries = rows.map((row) => {
        const rowData = timesheet[row.id] || {};
        return {
          projectId: row.PROJ_ID,
          hoursByDate: days.map((d) => ({
            date: d.date,
            hours: rowData[d.date] || 0,
          })),
          totalHours: totalHours[row.id] || 0,
        };
      });
      const totalHoursValue = Object.values(totalHours)
        .map(Number)
        .reduce((a, b) => a + b, 0);

      const payload = {
        empId,
        companyId,
        startDate: days[0]?.date,
        endDate: days[6]?.date,
        totalHours: totalHoursValue,
        entries,
        status: "Submit",
        timesheetCode,
      };

      const res = await fetch("http://localhost:3001/api/submitTimeSheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      // console.log("result",result);

      if (result.response === 1 || result.response === 2) {
        alert("Timesheet submitted successfully!");
      } else {
        alert("Failed to save timesheet");
      }
    } catch (error) {
      console.error("Error saving timesheet:", error);
      alert("An error occurred while saving the timesheet.");
    }
  };

  // console.log("leaveStatus",leaveStatus);

  const handleSave = async () => {
    try {
      const entries = rows.map((row) => {
        const rowData = timesheet[row.id] || {};
        return {
          projectId: row.PROJ_ID,
          taskId:row.TASK_ID,
          hoursByDate: days.map((d) => ({
            date: d.date,
            hours: rowData[d.date] || 0,
          })),
          totalHours: totalHours[row.id] || 0,
        };
      });
      const totalHoursValue = Object.values(totalHours)
        .map(Number)
        .reduce((a, b) => a + b, 0);

      const payload = {
        empId,
        companyId,
        startDate: days[0]?.date,
        endDate: days[6]?.date,
        totalHours: totalHoursValue,
        entries,
        status: "Saved",
        timesheetCode,
      };

      // console.log("PAYLOAD",payload);

      const res = await fetch("http://localhost:3001/api/saveTimeSheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.response === 1 || result.response === 2) {
        alert("Timesheet saved successfully!");
      } else {
        alert("Failed to save timesheet");
      }
    } catch (error) {
      console.error("Error saving timesheet:", error);
      alert("An error occurred while saving the timesheet.");
    }
  };

  useEffect(() => {
    if (timesheetId) {
      // console.log("triggering timesheetod");

      getSavedTimeSheetEntries();
    }
  }, [timesheetId]);

  const getSavedTimeSheetEntries = async (startStr, endStr) => {
    // console.log("startStr",startStr);
    // console.log("endStr",endStr);

    const sDate = moment(startStr).format("YYYY-MM-DD");
    const EDate = moment(endStr).format("YYYY-MM-DD");

    //  console.log("sDate",sDate);
    //   console.log("EDate",EDate);

    //   console.log("getSavedTimesheet entries");
    try {
      // if (!tId) return;

      const res = await fetch(
        `http://localhost:3001/api/getSavedTimeSheetEntries?timeSheetId=${timesheetId}&companyId=${companyId}&startDate=${sDate}&endDate=${EDate}`
      );
      // console.log("res",res);

      if (!res.ok) throw new Error("Network response was not ok");

      const result = await res.json();
      // console.log("RESULT for getsaved Timesheet ",result);

      const timesheetData = result?.data || [];

      // console.log("Fetched timesheet data:", timesheetData);

      if (timesheetData.length === 0) {
        setIsTimesheetSubmitted(false); // no data, treat as not submitted
        return;
      }

      // Check if any entry has status 'submitted'
      // const submitted = timesheetData.some((entry) => entry?.STATUS === "Submit");
      // setIsTimesheetSubmitted(submitted);

      // Extract unique projects
      const uniqueProjects = Array.from(
        new Map(
          timesheetData.map((item) => [item.PROJ_ID, item.PROJ_NAME])
        ).entries()
      ).map(([PROJ_ID, PROJ_NAME]) => ({
        projectId: PROJ_ID,
        projectName: PROJ_NAME,
      }));

      const normalizedProjects = uniqueProjects.map((p) => ({
        id: p.projectId,
        projectId: p.projectId,
        projectName: p.projectName,
      }));

      setRows(normalizedProjects);

      // Build timesheet object and total hours
      const timesheetObj = {};
      const totalHoursObj = {};

      normalizedProjects.forEach((proj) => {
        const entries = timesheetData.filter(
          (item) => item.PROJ_ID === proj.projectId
        );

        const dayHours = {};
        let total = 0;

        entries.forEach((entry) => {
          const formattedDate = moment(entry.ENTRY_DATE).format("YYYY-MM-DD");
          const hours = parseFloat(entry.DAILY_HOURS) || 0;
          dayHours[formattedDate] = hours;
          total += hours;
        });

        timesheetObj[proj.projectId] = dayHours;
        totalHoursObj[proj.projectId] = total.toFixed(2);
      });

      setTimesheet(timesheetObj);
      setTotalHours(totalHoursObj);
    } catch (error) {
      console.error("Error fetching saved timesheet entries:", error);
      // setIsTimesheetSubmitted(false); // fail-safe
    }
  };

  const isHoliday = (d) => {
    return holidays.some((item) =>
      moment(d.date).isBetween(item.START_DATE, item.END_DATE, null, [])
    );
  };

  const isLeave = (d) => {
    return leaves.some((item) => {
      const status = item.STATUS?.toLowerCase().trim();
      if (status === "pending" || status === "approved") {
        return moment(d.date).isBetween(
          item.START_DATE,
          item.END_DATE,
          null,
          "[]"
        );
      }
      return false;
    });
  };

  const isBlocked = (d) => isHoliday(d) || isLeave(d);

  console.log("rows", rows);


  // console.log("tasks",tasks);



//     useEffect(() => {
//   if (projectId) {
//     dispatch(fetchTasks(projectId));
//   }
// }, [companyId]);

const handleSelectTask = (row,value)=>{
  console.log("row",row);
  console.log("value",value);
  
}

  

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.dateSection}>
          <span style={styles.label}>DATE RANGE</span>

          <div style={styles.dateBox}>
            <button
              onClick={() => handleWeekChange("prev")}
              style={{
                ...styles.iconBtn,
                display: isTimesheetSubmitted ? "none" : null,
              }}
            >
              <GoArrowLeft />
            </button>
            <span>{dateRange}</span>
            <button
              onClick={() => handleWeekChange("next")}
              style={{
                ...styles.iconBtn,
                display: isTimesheetSubmitted ? "none" : null,
              }}
            >
              <GoArrowRight />
            </button>
            <button
              style={styles.todayBtn}
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.projectHeader}>Project</th>
          <th>Task Type</th>
            {days.map((d, idx) => (
              <th
                key={idx}
                disabled={isBlocked(d)}
                style={{
                  ...styles.dayHeader,
                  backgroundColor: isHoliday(d)
                    ? "#ededed"
                    : isLeave(d)
                    ? "#ededed"
                    : "#fff",
                  color: isLeave(d) ? "red" : "black",
                  cursor: isBlocked(d) ? "not-allowed" : "pointer",
                }}
              >
                {d.label}
              </th>
            ))}
            <th style={styles.dayHeader}>Total</th>
            <th
              style={{
                ...styles.dayHeader,
                display: isTimesheetSubmitted ? "none" : null,
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={styles.row}>
              {/* Project Select */}
              <td style={styles.projectCell}>
                <select
                  value={row.projectId}
                  onChange={(e) => handleProjectChange(row.id, e.target.value)}
                  style={styles.select}
                  disabled={isTimesheetSubmitted}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.PROJ_ID} value={p.PROJ_ID}>
                      {p.PROJ_NAME}
                    </option>
                  ))}
                </select>
              </td>

      
              <td style={styles.projectCell}>
                <select
                value={row.projectId}
                onChange={(e)=>handleSelectTask(row.id, e.target.value)}
                style={styles.select}>
                  <option value="">Select Task Type</option>
                  {
                    row.projectId && (
                       tasks.map((task)=>(
                      <option key={task.TASK_ID} value={task.TASK_ID}>
                        {task.TASK_NAME}
                      </option>
                    ))
                  )
                  }
                 
                </select>
              </td>
              

              {days.map((d, idx) => (
                <td key={idx} style={styles.hourCell}>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    placeholder="0.00"
                    value={timesheet[row.projectId]?.[d.date] || ""}
                    disabled={isTimesheetSubmitted || isBlocked(d)}
                    onChange={(e) =>
                      handleHoursChange(row.projectId, d.date, e.target.value)
                    }
                    style={{
                      ...styles.hourInput,
                      backgroundColor: isHoliday(d)
                        ? "#ededed"
                        : isLeave(d)
                        ? "#cdcdcd"
                        : "#fff",
                      color: isLeave(d) ? "red" : "black",
                      cursor: isBlocked(d) ? "not-allowed" : "pointer",
                    }}
                  />

                  
                </td>
              ))}

              {/* Total Hours */}
              <td style={styles.totalCell}>
                {totalHours[row.projectId] || "0.00"}
              </td>

              {/* Delete Button */}
              <td>
                <button
                  style={{
                    ...styles.deleteBtn,
                    display: isTimesheetSubmitted ? "none" : "block",
                  }}
                  onClick={() =>
                    setRows((prev) => prev.filter((r) => r.id !== row.id))
                  }
                >
                  <MdDeleteOutline size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.rightHeader}>
        <button
          style={{
            ...styles.addBtn,
            //         backgroundColor: (isTimesheetSubmitted) ? "#cdcdcd" : "green",
            // cursor: ( isTimesheetSubmitted) ? "not-allowed" : "pointer"
            display: isTimesheetSubmitted ? "none" : "block",
          }}
          onClick={handleAddRow}
        >
          + Add Row
        </button>
        <button
          style={{
            ...styles.saveBtn,
            //  backgroundColor: (isTimesheetSubmitted) ? "#cdcdcd" : "green",
            //     cursor: ( isTimesheetSubmitted) ? "not-allowed" : "pointer"
            display: isTimesheetSubmitted ? "none" : "block",
          }}
          onClick={handleSave}
        >
          Save
        </button>

        <button
          onClick={handleSubmit}
          disabled={isFutureDate || isTimesheetSubmitted}
          style={{
            ...styles.submitBtn,
            backgroundColor:
              isFutureDate || isTimesheetSubmitted ? "#cdcdcd" : "green",
            cursor:
              isFutureDate || isTimesheetSubmitted ? "not-allowed" : "pointer",
            display: isTimesheetSubmitted ? "none" : "block",
          }}
        >
          Submit
        </button>

        <Dialog
          header="Add Designation"
          visible={visible}
          style={{ width: "400px", zIndex: 1000 }}
          onHide={() => setVisible(false)}
        >
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter Notes"
          />
        </Dialog>
      </div>
    </div>
  );
};

export default WeekTimesheet;

const styles = {
  container: {
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f9fafc",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  dateSection: { display: "flex", flexDirection: "column" },
  label: { fontSize: "12px", color: "#777", marginBottom: "5px" },
  dateBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fff",
    padding: "8px 14px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  todayBtn: {
    backgroundColor: "#1c3681",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
  },
  rightHeader: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "30px",
  },
  addBtn: {
    backgroundColor: "#1c3681",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#ffcc00",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  submitBtn: {
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  projectHeader: {
    textAlign: "left",
    backgroundColor: "#f3f4f6",
    color: "#333",
    padding: "12px 18px",
  },
  dayHeader: {
    textAlign: "center",
    backgroundColor: "#f3f4f6",
    color: "#333",
    padding: "10px",
    fontSize: "13px",
  },
  row: { borderBottom: "1px solid #eee" },
  projectCell: { padding: "12px" },
  select: {
    width: "100%",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  hourCell: { textAlign: "center", padding: "10px" },
  hourInput: {
    width: "70px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "6px",
    outline: "none",
  },
  totalCell: {
    textAlign: "center",
    fontWeight: "bold",
    background: "#fafafa",
  },
  deleteBtn: {
    border: "none",
    backgroundColor: "transparent",
  },
};
