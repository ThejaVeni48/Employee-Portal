import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import { fetchTasks } from "../Redux/actions/tasksActions";
import { fetchHierarchy } from "../Redux/actions/gethierarchyActions";
import { useLocation } from "react-router-dom";

const WeekTimesheet = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Redux
  const companyId = useSelector((s) => s.user.companyId);
  const empId = useSelector((s) => s.user.empId);
  const tasks = useSelector((s) => s.tasks.tasksList);
const { levels = [] } = useSelector((s) => s.Hierarchy || {});

const [Schedulers,setSchedulers]= useState([
  {scheduledHours:'',
  }
])

const [variance, setVariance] = useState({});


  // console.log("levels",levels);
  

  const passedWeekStart = (() => {
    try {
      if (
        location.state &&
        location.state.rowData &&
        location.state.rowData.WEEK_START &&
        moment(location.state.rowData.WEEK_START, "YYYY-MM-DD", true).isValid()
      ) {
        return moment(location.state.rowData.WEEK_START).format("YYYY-MM-DD");
      }
    } catch (err) {
      console.warn("Invalid WEEK_START passed:", err);
    }
    return null;
  })();

  // Use passed week or today
  const [currentDate, setCurrentDate] = useState(
    passedWeekStart || moment().format("YYYY-MM-DD")
  );

  // State
  const [days, setDays] = useState([]); 
  const [daysList, setDaysList] = useState([]); 
  const [projects, setProjects] = useState([]);
  const [rows, setRows] = useState([
    { id: `temp-${Date.now()}`, projectId: "", taskId: "" },
  ]);
  const [timesheet, setTimesheet] = useState({});
  const [totalHours, setTotalHours] = useState({});
  const [status, setStatus] = useState("NONE");
  const [readOnly, setReadOnly] = useState(false);
  const [notesVisible, setNotesVisible] = useState({});
  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState("");
  const [currentApprover, setCurrentApprover] = useState(null);
  const [finalApprover, setFinalApprover] = useState(null);




  useEffect(() => {
    if (levels && levels.length > 0) {
      setCurrentApprover(levels[0].approverId);
      setFinalApprover(levels[levels.length - 1].approverId);
    }
  }, [levels]);

  useEffect(() => {

    getWeeks();
    fetchActiveProjects(currentDate);
  }, [currentDate]);

  const generateWeekDays = (dateString) => {

    // console.log("dateString",dateString);
    
    const start = moment(dateString); 
    // console.log("start",start);
    
    const arr = [];
    for (let i = 0; i < 7; i++) {
//  console.log("i",i);
      const day = start.clone().add(i, "day");
      // console.log("day",day);
      
      arr.push({
        label: day.format("ddd, MMM D"),
        date: day.format("YYYY-MM-DD"),
      });
     
      
    }
    setDaysList(arr);
    // console.log("arr",arr);
    
  };


  // console.log("daysList",daysList);
  


  // console.log("days",days);
  

  // console.log("CURRENTapprover",currentApprover);
  // console.log("finalapprover",finalApprover);
  

  // Fetching current week 
  const getWeeks = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/currentWeek?currentDate=${currentDate}&orgId=${companyId}`
      );
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      // console.log("json for weeks", json.data);


      const date = json.data[0].WEEK_START;


      // console.log("date",date);

      generateWeekDays(date);

    
      

      
      setDays(json.data || []);
    } catch (err) {
      console.error("getWeeks error:", err);
    }
  };


  
  // Fetch projects
  const fetchActiveProjects = async (date = currentDate) => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const res = await fetch(
        `http://localhost:3001/api/empProjects?orgId=${companyId}&empId=${empId}&currentDate=${formattedDate}`
      );
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setProjects(json.data || []);
      const notesState = {};
      (json.data || []).forEach((p) => {
        if (p.NOTES === "YES") notesState[p.PROJ_ID] = true;
      });
      setNotesVisible(notesState);
    } catch (err) {
      console.error("fetchActiveProjects error:", err);
    }
  };

  useEffect(() => {
    if (daysList.length !== 7 || days.length === 0) return;

    const weekId = days[0].TC_MASTER_ID;
    getLatestTimeSheet(weekId);
  }, [daysList, days]);

  // Fetch timesheet
  const getLatestTimeSheet = async (weekId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getSavedTimeSheetEntries?companyId=${companyId}&empId=${empId}&weekId=${weekId}`
      );
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      //  console.log("json",json);
       if(json.data.length >0)
       {

      
       
      setStatus(json.data[0].STATUS || "NONE");
      setReadOnly(json.data[0].STATUS === "SU" || json.data[0].STATUS === "A" );
      mapTimesheetToUI(json.data || []);
       }
    } catch (err) {
      console.error("getLatestTimeSheet error:", err);
      ensureDefaultRow();
    }
  };



  // console.log("STATUS",status);
  

  const mapTimesheetToUI = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      ensureDefaultRow();
      return;
    }

    const ts = {};
    const totals = {};
    const newRows = [];

    data.forEach((entry) => {
      const rowId = `proj-${entry.PROJ_ID}`;
      newRows.push({
        id: rowId,
        projectId: entry.PROJ_ID,
        taskId: entry.TASK_ID ?? "",
      });

      ts[rowId] = {
        [daysList[0].date]: entry.DAY1 ?? 0,
        [daysList[1].date]: entry.DAY2 ?? 0,
        [daysList[2].date]: entry.DAY3 ?? 0,
        [daysList[3].date]: entry.DAY4 ?? 0,
        [daysList[4].date]: entry.DAY5 ?? 0,
        [daysList[5].date]: entry.DAY6 ?? 0,
        [daysList[6].date]: entry.DAY7 ?? 0,
      };

      const total = Object.values(ts[rowId]).reduce((a, b) => a + Number(b), 0);
      totals[rowId] = total.toFixed(2);
    });

    setRows(newRows);
    setTimesheet(ts);
    setTotalHours(totals);
  };

  const ensureDefaultRow = () => {
    setRows((prev) =>
      prev.length === 0
        ? [{ id: `temp-${Date.now()}`, projectId: "", taskId: "" }]
        : prev
    );
  };

  // Handlers
  const handleProjectChange = (rowId, projectId) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, projectId, taskId: "" } : r))
    );
    dispatch(fetchTasks(companyId, projectId));
    dispatch(fetchHierarchy(companyId, projectId,empId));
  };

  const handleSelectTask = (rowId, taskId) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, taskId } : r)));
  };

  const handleHoursChange = (rowId, date, value) => {
    if (readOnly) return;
    const hours = parseFloat(value) || 0;
    setTimesheet((prev) => {
      const updatedRow = { ...(prev[rowId] || {}), [date]: hours };
      const total = Object.values(updatedRow).reduce(
        (a, b) => a + Number(b),
        0
      );
      setTotalHours((prev) => ({ ...prev, [rowId]: total.toFixed(2) }));
      return { ...prev, [rowId]: updatedRow };
    });
    // calculateVariance();
  };

  const handleAddRow = () => {
    if (readOnly) return;
    setRows((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, projectId: "", taskId: "" },
    ]);
  };

  const handleRemoveRow = (rowId) => {
    if (readOnly) return;
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setTimesheet((prev) => {
      const n = { ...prev };
      delete n[rowId];
      return n;
    });
    setTotalHours((prev) => {
      const n = { ...prev };
      delete n[rowId];
      return n;
    });
  };

  const buildEntriesPayload = () => {
    return rows
      .filter((r) => r.projectId)
      .map((r) => ({
        projectId: r.projectId,
        taskId: r.taskId || null,
        hoursByDate: daysList.map((d) => ({
          date: d.date,
          hours: Number(timesheet[r.id]?.[d.date] || 0),
        })),
      }));
  };

  const weekId = days[0]?.TC_MASTER_ID;

  const handleSave = async () => {

    console.log("handlesave");
    
    if (!weekId) return;
    const payload = {
      empId,
      orgId: companyId,
      weekId,
      totalHours: Object.values(totalHours).reduce(
        (a, b) => a + Number(b || 0),
        0
      ),
      variance:Number(Object.values(variance)),
      status: "S",
      entries: buildEntriesPayload(),
      currentApprover,
      finalApprover,
      scheduledHours:Schedulers[0].scheduledHours
    };

    console.log("payload",payload);
    

    
    
    // try {
    //   await fetch("http://localhost:3001/api/saveTimesheet", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   });
    //   getLatestTimeSheet(weekId);
    // } catch (err) {
    //   console.error("Save error:", err);
    // }
  };

  const handleSubmit = async () => {
    if (!weekId) return;
    const payload = {
      empId,
      orgId: companyId,
      weekId,
      totalHours: Object.values(totalHours).reduce(
        (a, b) => a + Number(b || 0),
        0
      ),
      status: "SU",
      entries: buildEntriesPayload(),
      currentApprover,
      finalApprover,
      scheduledHours:Schedulers[0].scheduledHours,
       variance:Number(Object.values(variance)),
    };

    console.log("payload",payload);
    

    // try {
    //   await fetch("http://localhost:3001/api/saveTimesheet", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   });
    //   getLatestTimeSheet(weekId);
    // } catch (err) {
    //   console.error("Submit error:", err);
    // }
  };


   useEffect(()=>{
    if(projects?.length&& days?.length)
    {
       const projectId = projects[0].PROJ_NO;

    const weekStart = days[0].WEEK_START;

    const weekEnd = days[0].WEEK_END;
      fetchScheduledHours(projectId,weekStart,weekEnd);
    }
   },[projects,days])


   const fetchScheduledHours = async (projectId, weekStart, weekEnd) =>{
    // console.log("fetch schedulers");

    // console.log("projects",projects);
    // console.log("days",days);

    console.log("weekStart",weekStart);
    console.log("weekEnd",weekEnd);
    

   
    
    try {

      const data = await fetch(`http://localhost:3001/api/getScheduledHours?orgId=${companyId}&empId=${empId}&projId=${projectId}&weekStart=${weekStart}&weekEnd=${weekEnd}`);


      if(!data)
      {
        throw new Error("Network response was not ok");
        
      }

      const res = await data.json();
      
      
      console.log("res",res);


      setSchedulers([
        {

          scheduledHours:res.totalScheduledHours
        }
      ])

      
      
    } catch (error) {
      console.error("Error occured",error);
      
    }
    
  }


useEffect(() => {
  if (!Schedulers.length) return;

  const scheduledHours = Number(Schedulers[0].scheduledHours) || 0;

  const newVariance = {};
  Object.keys(totalHours).forEach((rowId) => {
    const entered = Number(totalHours[rowId]) || 0;
    newVariance[rowId] = Math.abs(scheduledHours - entered).toFixed(2);
  });

  setVariance(newVariance);
}, [Schedulers, totalHours]);


console.log("variance",variance);


  return (
    
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.dateSection}>
          <div style={styles.dateBox}>
            {daysList.length === 7 ? (
              <span>
                {daysList[0].label} - {daysList[6].label}
              </span>
            ) : (
              <span>Loading week...</span>
            )}
            <button
              style={styles.todayBtn}
              onClick={() => setCurrentDate(moment().format("YYYY-MM-DD"))}
              >
              Today
            </button>
              <span>ScheduledHours:{Schedulers[0].scheduledHours}</span>
          </div>
        </div>
        <div>
          <strong style={{ marginRight: 12 }}>
            {status === "SU" ? "Submitted" : status === "S" ? "Saved" :status ==="R"
              ? "Rejected" : status ==='A' ? "Approved" : 'Not started'
            }
          </strong>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.projectHeader}>Project</th>
            <th style={styles.dayHeader}>Task Type</th>
            {daysList.map((d, i) => (
              <th key={i} style={styles.dayHeader}>
                {d.label}
              </th>
            ))}
            <th style={styles.dayHeader}>Total</th>
            <th style={styles.dayHeader}>Variance</th>
            <th style={styles.dayHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={styles.row}>
              <td style={styles.projectCell}>
                <select
                  value={row.projectId}
                  onChange={(e) => handleProjectChange(row.id, e.target.value)}
                  style={styles.select}
                  disabled={readOnly}
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
                  value={row.taskId}
                  onChange={(e) => handleSelectTask(row.id, e.target.value)}
                  style={styles.select}
                  disabled={readOnly || !row.projectId}
                >
                  <option value="">Select Task Type</option>
                  {row.projectId &&
                    tasks.map((task) => (
                      <option key={task.TASK_ID} value={task.TASK_ID}>
                        {task.TASK_NAME}
                      </option>
                    ))}
                </select>
              </td>
              {daysList.map((day) => (
                <td key={day.date} style={styles.hourCell}>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.25"
                    placeholder="0.00"
                    style={styles.hourInput}
                    value={timesheet[row.id]?.[day.date] ?? ""}
                    onChange={(e) =>
                      handleHoursChange(row.id, day.date, e.target.value)
                    }
                    disabled={readOnly || !row.projectId}
                  />
                  {notesVisible[row.projectId] && (
                    <button
                      onClick={() => {
                        setVisible(true);
                        setNotes(`Notes for project ${row.projectId}`);
                      }}
                      style={{ marginLeft: 6 }}
                    >
                      +
                    </button>
                  )}
                </td>
              ))}
              <td style={styles.totalCell}>{totalHours[row.id] || "0.00"}</td>
              <td style={styles.totalCell}>{variance[row.id] || "0.00"}</td>
              <td>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleRemoveRow(row.id)}
                  disabled={readOnly}
                >
                  <MdDeleteOutline size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.rightHeader}>
        {!readOnly && (
          <>
            <button style={styles.addBtn} onClick={handleAddRow}>
              + Add Row
            </button>
            <button style={styles.saveBtn} onClick={handleSave}>
              Save
            </button>
            <button style={styles.submitBtn} onClick={handleSubmit}>
              Submit
            </button>
          </>
        )}
        <Dialog
          header="Notes"
          visible={visible}
          style={{ width: "400px" }}
          onHide={() => setVisible(false)}
        >
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter Notes"
            style={{ width: "100%", padding: "8px" }}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default WeekTimesheet;

// Styles
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
  dateBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fff",
    padding: "8px 14px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
    width: "120%",
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
  totalCell: { textAlign: "center", fontWeight: "bold", background: "#fafafa" },
  deleteBtn: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
};
