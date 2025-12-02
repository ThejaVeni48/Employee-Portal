import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import gstsLogo from "../Assests/GSTS.png";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoMdSave } from "react-icons/io";
import moment from "moment";

const PendingTimeSheets = () => {
  const location = useLocation();
  const navi = useNavigate();
  const timeSheetId = location.state?.timeSheetId || "";
  const triggeredButton = location.state?.triggered || "";
  const remarks = location.state?.remarks || "";
  // console.log("triggeredbutton",triggeredButton);
  const status = location.state?.status || "";
  const hours = location.state?.hours || "";
  const [weeks, setWeeks] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [apiCalled, setApiCalled] = useState(false);
  const [startDate, setStartDate] = useState("");
  const profile = useSelector((state) => state.profileImage);
  const [moments, setMoment] = useState([]);
  const companyId = useSelector((state) => state.companyId);
  const timesheetCode = useSelector((state) => state.timesheetCode);
  // console.log("companyId",companyId);
  const firstName = useSelector((state) => state.firstName);
  const lastName = useSelector((state) => state.lastName);
  const empId = useSelector((state) => state.empId);
  const firstLetter = firstName ? firstName[0] : "";
  const lastLetter = lastName ? lastName[0] : "";
  const [leaveApprovalStatus] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [blockedDaysObj, setBlockedDatesObj] = useState({});
  const { apiData = [], holidays = [] } = location.state || {};

  useEffect(() => {
    getBlockedDays();
  }, [apiData, holidays]);

  // for holidays and leaves

  const getBlockedDays = () => {
    if (apiData.length > 0 || holidays.length > 0) {
      const combined = {};

      apiData.forEach((item) => {
        const start = new Date(item.START_DATE);
        const end = new Date(item.END_DATE);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = new Date(d).toISOString().split("T")[0];
          combined[dateStr] = { type: "leave", status: item.STATUS };
        }
      });

      holidays.forEach((item) => {
        const start = new Date(item.START_DATE);
        const end = new Date(item.END_DATE);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = new Date(d).toISOString().split("T")[0];
          combined[dateStr] = { type: "holiday" };
        }
      });

      setBlockedDatesObj(combined);
    }
  };

  const isDateBlocked = (date) => {
    const blocked = blockedDaysObj[date];

    if (!blocked) return false;

    if (
      blocked.type === "leave" ||
      blocked.status === "Pending" ||
      blocked.status === "Approved"
    )
      return true;

    if (blocked.type === "holiday") return true;
  };

  console.log("projects", projects);
  useEffect(() => {
    if (timeSheetId) {
      if (triggeredButton === "saveButton") {
        // this block is used for getting the saved timesheets  on clicking the save button
        getSavedTimeSheetEntries();
        // console.log("save button");
      } else if (triggeredButton === "picker" && status === "Saved") {
        // this block is used for getting the saved timesheets navigating from the date picker
        getSavedTimeSheetEntries();
        // console.log("picker saved button")
      } else if (triggeredButton === "picker" && status === "submitted") {
        // this block is used for viewing the submitted timesheets navigating from the date picker
        // console.log("picker submitted")
        setApiCalled(true);
        getTimeSheetEntries();
      } else if (
        (triggeredButton === "rejectedbutton" && status === "Rejected") ||
        (status === "REJECTED" && triggeredButton === "picker")
      ) {
        // this block is used for editig the rejected timesheet from picker or clickin on edit button
        getTimeSheetEntries();
        setApiCalled(false);
      } 
      else if (triggeredButton === "picker") {
        const dates = location.state?.dates || [];
        getProjects(dates);
        getBlockedDays();
      } else {
        // this block is used for viewing the timesheets on clicking the view button
        // console.log("nested else block");
        getTimeSheetEntries();
        setApiCalled(true);
        setTotalHours(hours);
        // getProjects();
      }
    } else {
      console.log("else block is trggereed");

      const dates = location.state?.dates || [];

      const momentdays = dates.map((date) => moment(date, "YYYY-MM-DD"));

      // const momentdaysssss = dates.map((date) => {
      //   const xys = holidays.some((bd) =>
      //     moment(bd, "YYYY-MM-DD").isSame(date, "day")
      //   );

      //   return xys;
      // });

      setMoment(momentdays);
      // setWeekss(momentdays)
      setWeeks(dates);
      const initialRow = {
        projectType: "",
        billable: "",
        hours: dates.map(() => ""),
        notes: dates.map(() => ""),
        showNotes: dates.map(() => false),
      };
      // console.log("initialRows",initialRow);

      setRows([initialRow]);
      getProjects(dates);
    }
  }, [timeSheetId]);



// to see the saved timesheet
  const getSavedTimeSheetEntries = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getSavedTimeSheetEntries?timeSheetId=${timeSheetId}&companyId=${companyId}`
      );
      if (!res.ok) throw new Error("network response was not ok");
      const result = await res.json();
      // console.log("RESULT for getsaved",result);

      const timesheetData = result.data;
      // console.log("timesheetDate",timesheetData);
      if (!timesheetData || timesheetData.length === 0) return;

      const weekDates = [
        ...new Set(
          timesheetData.map(
            (item) => new Date(item.ENTRY_DATE).toISOString().split("T")[0]
          )
        ),
      ];
      // console.log("weeks 148",weeks);

      const momentdays = weekDates.map((date) => moment(date).format("ddd,ll"));
      setMoment(momentdays);
      setWeeks(weekDates);

      const groupedRows = [];
      const groupMap = {};

      timesheetData.forEach((entry) => {
        const key = `${entry.PROJECT_TYPE}__${entry.BILLABLE_TYPE}`;
        if (!groupMap[key]) {
          groupMap[key] = {
            projectType: entry.PROJECT_TYPE || "",
            billable: entry.BILLABLE_TYPE || "",
            hours: Array(weekDates.length).fill(""),
            notes: Array(weekDates.length).fill(""),
            showNotes: Array(weekDates.length).fill(false),
          };
        }

        const dateStr = new Date(entry.ENTRY_DATE).toISOString().split("T")[0];
        const dayIndex = weekDates.indexOf(dateStr);
        if (dayIndex !== -1) {
          groupMap[key].hours[dayIndex] =
            entry.DAILY_HOURS != null ? entry.DAILY_HOURS.toString() : "";
          groupMap[key].notes[dayIndex] = entry.TASK || "";
        }
      });

      for (let key in groupMap) {
        groupedRows.push(groupMap[key]);
      }

      groupedRows.forEach((row) => {
        row.hours =
          row.hours?.length === weekDates.length
            ? row.hours
            : Array(weekDates.length).fill("");
        row.notes =
          row.notes?.length === weekDates.length
            ? row.notes
            : Array(weekDates.length).fill("");
        row.showNotes =
          row.showNotes?.length === weekDates.length
            ? row.showNotes
            : Array(weekDates.length).fill(false);
      });

      setRows(groupedRows);
      recalculateTotalHours(groupedRows);
    } catch (error) {
      console.error("Error fetching timesheet data saved ts", error);
    }
  };

  // to get timesheet entries
  const getTimeSheetEntries = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/getTimesheetEntries?timesheetId=${timeSheetId}&companyId=${companyId}`
      );
      const result = await data.json();
      const timesheetData = result.data;
      console.log("gettimehseet", timesheetData);
      if (!timesheetData || timesheetData.length === 0) return;

      const weekDates = [
        ...new Set(
          timesheetData.map(
            (item) => new Date(item.ENTRY_DATE).toISOString().split("T")[0]
          )
        ),
      ];
      // console.log("weekDates",weekDates);
      const momentdays = weekDates.map((date) => moment(date).format("ddd,ll"));
      setMoment(momentdays);
      setWeeks(weekDates);

      const groupedRows = [];
      const groupMap = {};

      timesheetData.forEach((entry) => {
        const key = `${entry.PROJECT_TYPE}__${entry.BILLABLE_TYPE}`;
        if (!groupMap[key]) {
          groupMap[key] = {
            projectType: entry.PROJECT_TYPE || "",
            billable: entry.BILLABLE_TYPE || "",
            hours: Array(weekDates.length).fill(""),
            notes: Array(weekDates.length).fill(""),
            showNotes: Array(weekDates.length).fill(false),
          };
        }
        // console.log("groupmap",groupMap);
        // console.log("groupedRows",groupedRows);

        const dateStr = new Date(entry.ENTRY_DATE).toISOString().split("T")[0];
        const dayIndex = weekDates.indexOf(dateStr);
        if (dayIndex !== -1) {
          groupMap[key].hours[dayIndex] =
            entry.DAILY_HOURS != null ? entry.DAILY_HOURS.toString() : "";
          groupMap[key].notes[dayIndex] = entry.TASK || "";
        }
      });

      for (let key in groupMap) {
        groupedRows.push(groupMap[key]);
      }

      groupedRows.forEach((row) => {
        row.hours =
          row.hours?.length === weekDates.length
            ? row.hours
            : Array(weekDates.length).fill("");
        row.notes =
          row.notes?.length === weekDates.length
            ? row.notes
            : Array(weekDates.length).fill("");
        row.showNotes =
          row.showNotes?.length === weekDates.length
            ? row.showNotes
            : Array(weekDates.length).fill(false);
      });

      setRows(groupedRows);
      recalculateTotalHours(groupedRows);
    } catch (error) {
      console.error("Error fetching timesheet data", error);
    }
  };

  console.log("rows", rows);

  useEffect(() => {
    if (weeks.length > 0 && !isNaN(Date.parse(weeks[0]))) {
      const startDateObj = new Date(weeks[0]);
      const yyyy = startDateObj.getFullYear();
      const mm = String(startDateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(startDateObj.getDate()).padStart(2, "0");
      setStartDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [weeks]);

  const today = moment();
  const futureDate = moment(weeks[4]);

  // true if futureDate is after today
  const isFutureDate = futureDate.isAfter(today);

  // const isFutureDate = false;
  //
  // console.log("Disable Submit?sss", isFutureDate);

  const parseTimeInput = (value) => {
    if (!value) return 0;
    const str = value.toString();
    const hoursMatch = str.match(/(\d+)\s*h/i);
    const minutesMatch = str.match(/(\d+)\s*m/i);
    const decimalMatch = parseFloat(str);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    if (!isNaN(decimalMatch) && !str.includes("h") && !str.includes("m"))
      return decimalMatch;
    return hours + minutes / 60;
  };

  const recalculateTotalHours = (updatedRows) => {
    let total = 0;
    updatedRows.forEach((row) => {
      row.hours?.forEach((hourStr) => {
        total += parseTimeInput(hourStr);
      });
    });
    setTotalHours(total.toFixed(2));
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleHourChange = (rowIdx, dayIdx, value) => {
    const updated = [...rows];
    if (!updated[rowIdx].hours)
      updated[rowIdx].hours = Array(weeks.length).fill("");
    updated[rowIdx].hours[dayIdx] = value;
    setRows(updated);
    recalculateTotalHours(updated);
  };

  const toggleNote = (rowIdx, dayIdx) => {
    const updated = [...rows];
    if (!updated[rowIdx].showNotes)
      updated[rowIdx].showNotes = Array(weeks.length).fill(false);
    updated[rowIdx].showNotes[dayIdx] = !updated[rowIdx].showNotes[dayIdx];
    setRows(updated);
  };

  // console.log("holidays",holidays);

  const handleNoteChange = (rowIdx, dayIdx, value) => {
    const updated = [...rows];
    if (!updated[rowIdx].notes)
      updated[rowIdx].notes = Array(weeks.length).fill("");
    updated[rowIdx].notes[dayIdx] = value;
    setRows(updated);
  };

  const addNewRow = () => {
    const newRow = {
      projectType: "",
      billable: "",
      hours: weeks.map(() => ""),
      notes: weeks.map(() => ""),
      showNotes: weeks.map(() => false),
    };
    setRows([...rows, newRow]);
    recalculateTotalHours([...rows, newRow]);
  };

  const handleSubmit = async () => {
    // console.log("clicked");

    if (!startDate) {
      alert("Please select start date.");
      return;
    }

    //   console.log("holidays",holidays);

    // console.log("rows",rows);

    const isInvalid = rows.some(
      (row) =>
        row.hours.some((h, idx) => {
          const date = weeks[idx];
          // console.log("date hours",date);

          const isBlocked = isDateBlocked(date);
          return !isBlocked && (!h || h === "");
        }) ||
        row.notes.some((n, idx) => {
          const date = weeks[idx];
          // console.log("date notes",date);

          const isBlocked = isDateBlocked(date);
          return !isBlocked && (!n || n === "");
        }) ||
        !row.projectType ||
        !row.billable
    );
    // console.log("isInvalid",isInvalid);

    if (isInvalid) {
      alert("Please fill all required fields for non-leave days.");
      return;
    }
    if (leaveApprovalStatus === "Pending") {
      alert("Your leave is not approved still");
      return;
    }

    const entries = rows.map((row) => ({
      hours: row.hours.map((h) => h?.toString() || ""),
      notes: row.notes.map((n) => n || ""),
      billable: row.billable,
      projectType: row.projectType,
      dates: weeks,
      companyId,
      empId,
      timesheetCode,
    }));
    // console.log("entries",entries);

    const response = await fetch("http://localhost:3001/api/postTimesheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        totalHours,
        entries,
        status: "Submitted",
        companyId,
        empId,
        timesheetCode,
        projectId,
      }),
    });

    const res = await response.json();
    console.log("RES", res);

    if (res.response === 2 || res.response === 1) {
      alert("Timesheet submitted successfully.");
      setTimeout(() => {
        navi("/TimeSheetsInfo");
      }, 500);
    }
  };

  const handleSave = async () => {
    // console.log("handleSave clikcje")
    const entries = rows.map((row) => ({
      hours: row.hours.map((h) => h?.toString() || ""),
      notes: row.notes.map((n) => n || ""),
      billable: row.billable,
      projectType: row.projectType,
      dates: weeks,
      companyId,
      empId,
      timesheetCode,
    }));
    // console.log("entries",entries);

    try {
      const res = await fetch("http://localhost:3001/api/saveTimeSheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          startDate,
          totalHours,
          entries,
          status: "Saved",
          companyId,
          timesheetCode,
          projectId,
        }),
      });
      // console.log("res",res);

      const result = await res.json();
      // console.log("result",result);
      if (result.response === 1) {
        alert("Timesheet is saved successfully");
        // console.log ("Timesheet is saved successfully");

        // console.log("timesheetId", result);
      }
    } catch (error) {
      console.error("error occured", error);
    }
  };

  const handleNav = () => navi("/TimeSheetsInfo");

  const getProjects = async (dates) => {
    console.log("getProjects triggered");

    // console.log("days", dates);

    const startDate = dates[0];
    const lastDate = dates[4];

    try {
      const data = await fetch(
        `http://localhost:3001/api/getProjects?empId=${empId}&companyId=${companyId}&startDate=${startDate}&lastDate=${lastDate}`
      );

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await data.json();
      console.log("res for get projects", res.data);

      if (res.data.length === 0) {
        setProjects([{ projectName: "Internal Project" }]);
        const projectNo = 0;
        setProjectId(projectNo);
      } else {
        setProjects(res.data);
        const projectId = res.data[0].projectNo;
        setProjectId(projectId);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div id="mainWrapper">
      <div className="timesheet-container">
        <div className="header">
          <div className="logos">
            <img
              src={gstsLogo}
              alt="GSTS"
              style={{ width: 200, height: "auto" }}
            />
          </div>
          empid:{empId}
          <div className="profileimage">
            {profile ? (
              <img src={profile} alt="Profile" className="profilepic" />
            ) : (
              <span className="letterAvatar">
                {firstLetter}
                {lastLetter}
              </span>
            )}
          </div>
        </div>
        <h2 className="title">Weekly Timesheet</h2>
        <p>projectId:{projectId}</p>
        {status === "REJECTED" && <p>Reason for rejected :{remarks}</p>}

        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Billable</th>
              {moments.map((date, idx) => {
                const formattedDate = date.format
                  ? date.format("YYYY-MM-DD")
                  : date;
                // console.log("isDateBlokced",isDateBlocked);

                const isBlocked = isDateBlocked(formattedDate);
                // console.log("isBlocked",isBlocked);

                return (
                  <th
                    key={idx}
                    style={{
                      cursor: isBlocked ? "not-allowed" : "default",
                    }}
                  >
                    {date.format ? date.format("ddd, ll") : date}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td>
                  <select
                    value={row.projectType || "wert"}
                    disabled={apiCalled}
                    onChange={(e) =>
                      handleChange(rowIdx, "projectType", e.target.value)
                    }
                  >
                    <option value="">-- Select Project --</option>

                    {projects.map((item) => (
                      <option>{item.projectName}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row.billable || ""}
                    disabled={apiCalled}
                    onChange={(e) =>
                      handleChange(rowIdx, "billable", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      -- Billable --
                    </option>
                    <option value="billable">Billable</option>
                    <option value="non-billable">Non-Billable</option>
                  </select>
                </td>
                {weeks.map((date, dayIdx) => {
                  const isBlocked = isDateBlocked(date);

                  return (
                    <td key={dayIdx}>
                      <div className="hour-note-wrapper">
                        {isBlocked ? (
                          <input
                            type="text"
                            defaultValue={0}
                            className="hours-input"
                            disabled
                            style={{
                              cursor: isBlocked ? "not-allowed" : "default",
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder="-- hh -- mm --"
                            value={row.hours?.[dayIdx] || ""}
                            onChange={(e) =>
                              handleHourChange(rowIdx, dayIdx, e.target.value)
                            }
                            className="hours-input"
                            disabled={apiCalled}
                          />
                        )}
                        {!isBlocked && (
                          <button
                            className="note-button"
                            onClick={() => toggleNote(rowIdx, dayIdx)}
                            type="button"
                            title="Add Note"
                          >
                            +
                          </button>
                        )}
                      </div>
                      {row.showNotes?.[dayIdx] && !isBlocked && (
                        <textarea
                          value={row.notes?.[dayIdx] || ""}
                          onChange={(e) =>
                            handleNoteChange(rowIdx, dayIdx, e.target.value)
                          }
                          placeholder="Enter task..."
                          className="note-textarea"
                          rows={2}
                          //NEED TO ADD LIMIT CHARACTERES
                          disabled={apiCalled}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="buttons">
          {!apiCalled ? (
            <>
              <button onClick={addNewRow} className="button add">
                <IoAddCircleOutline /> Add Row
              </button>

              <button onClick={handleSave} className="button add">
                <IoMdSave />
                Save
              </button>

              <button
                onClick={handleSubmit}
                className="button submit"
                disabled={isFutureDate}
                style={{
                  backgroundColor: isFutureDate ? "#ccc" : "#2ecc71",
                  cursor: isFutureDate ? "not-allowed" : "pointer",
                }}
              >
                Submit
              </button>
            </>
          ) : status === "REJECTED" ? (
            <>
              <button>Submit</button>
            </>
          ) : (
            <>
              <button className="button submit" onClick={handleNav}>
                Back
              </button>
            </>
          )}
        </div>

        <p className="totalHours">Total Hours: {totalHours}</p>
      </div>

      <style>{`
         #mainWrapper{
          width: 100vw;
    height: 100vh;
    // border: 1px dotted red;
    overflow-x: hidden;
    // background-color: pink;
         
         }
        .timesheet-container {
          font-family: Arial, sans-serif;
          max-width: 100%;
          // margin: 2rem auto;
          // padding: 1.5rem;
          background-color: #fdfdfd;
          border-radius: 8px;
          // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }
        .header
        {
        background-color:#1c3681;
        display:flex;
        justify-center:center;
    align-items:center;
        }
         .logos{
        // border:4px solid blue;
        flex:1
        }
        .profile{
         flex:1;
        display:flex;
        justify-content:flex-end;
        align-items:center;
        padding:10px;

        }

        .title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .table {
          width: 97%;
          margin:auto;
          border-collapse: collapse;
          // min-width: 900px;
         border: 0.5px solid #fafafa;
        }

        .table th {
         border: 1px solid #ddd;
    text-align: center;
    padding: 1rem;
        background-color:#1c3681;
    color:#fff
        }
     .table td {
         border-bottom: 1px solid #ddd;
    text-align: center;
    padding: 1rem;
    background-color:#fafafa;
        }
    

        select, .note-textarea {
          width: 100%;
          font-size: 0.9rem;
          border: 1px solid #ccc;
          border-radius: 4px;
            //  background-color:#ededed;
        }

        .hours-input {
        width: 100%;
          font-size: 0.9rem;
          border: 1px solid #ccc;
          border-radius: 4px;
            //  background-color:#ededed;
        }
        .hour-note-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          // background-color:green;
          // width:100px;
        }

        .note-button {
          margin-left: 0.4rem;
          padding: 0.25rem 0.5rem;
          // background-color: #eee;
          border: 1px solid #ccc;
          border-radius: 3px;
          cursor: pointer;
          font-weight: bold;
        }

        .note-button:hover {
          background-color: #ddd;
        }

        .note-textarea {
          margin-top: 0.5rem;
          resize: vertical;
        }

        .buttons {
          margin: 1rem 1rem 0 0 ;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          // border:2px solid red;
        }

        .button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .button.add {
          background-color: #3498db;
          color: white;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:3px;
        }

        .button.submit {
          background-color: #2ecc71;
          color: white;
        }

        .button:hover {
          opacity: 0.9;
        }
        .totalHours
        {
        font-weight:bold;
        text-align:right;
        margin:10px 30px;
        }

        @media (max-width: 768px) {
          .table th, .table td {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PendingTimeSheets;

