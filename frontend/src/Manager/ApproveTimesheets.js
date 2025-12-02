import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gstsLogo from "../Assests/GSTS.png";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { SlCalender } from "react-icons/sl";
import moment from "moment";
import "./ApproveTimesheet.css";

const ApproveTimesheets = () => {
  const nav = useNavigate();
  const [image] = useState(null);
  const deptId = useSelector((state) => state.deptId);
  //
  console.log("deptId", deptId);

  const location = useLocation();

  const role = location.state?.role || "";
  const [selectedDate, setSelectedDate] = useState(null);
  const [entries, setEntries] = useState([]);
  const [setDate] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [approvedWeeks, setApprovedWeeks] = useState([]);
  const [approved, setApproved] = useState([]);
  const [approvedDate, setApprovedDate] = useState(null);
  const empId = useSelector((state) => state.empId);
  const firstName = useSelector((state) => state.firstName);
  const lastName = useSelector((state) => state.lastName);
  const companyId = useSelector((state) => state.companyId);
  const firstLetter = firstName ? firstName[0] : "";
  const lastLetter = lastName ? lastName[0] : "";

  useEffect(() => {
    if (!role) {
      console.warn("Role not defined. Cannot fetch timesheets.");
      return;
    }
    getAllTimesheets();
    getApprovedTimesheets();
    setWeeks(calculateWeek(new Date()));
    setApprovedWeeks(calculateApprovedWeek(new Date()));
  }, [role]);
  // --------------------- Fetch Pending Timesheets ---------------------
  const getAllTimesheets = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/getSubmittedTimesheets?companyId=${companyId}&empId=${empId}&role=${role}`
      );
      console.log("companyId", companyId);
      console.log("emId", empId);

      const res = await data.json();
      console.log("Entries (Submitted Timesheets):", res);

      if (Array.isArray(res)) {
        setEntries(res);
      } else if (res && Array.isArray(res.data)) {
        setEntries(res.data);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setEntries([]);
    }
  };

  // --------------------- Fetch Approved Timesheets ---------------------
  const getApprovedTimesheets = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/approvedTimeSheet?deptId=${deptId}`
      );
      const res = await data.json();
      console.log("Approved timesheets:", res);

      if (Array.isArray(res)) {
        setApproved(res);
      } else if (res && Array.isArray(res.data)) {
        setApproved(res.data);
      } else {
        setApproved([]);
      }
    } catch (error) {
      console.error("Error fetching approved timesheets:", error);
      setApproved([]);
    }
  };

  const handleApproveTimesheets = (item) => {
    nav("/ViewTimesheets", {
      state: {
        timesheetId: item.TIMESHEET_ID,
        firstName: item.FIRST_NAME,
        lastName: item.LAST_NAME,
        EmpId: item.EMP_ID,
      },
    });
  };

  const handleDateChange = (date) => setSelectedDate(date);
  const handleApprovedDateChange = (date) => setApprovedDate(date);

  const calculateWeek = (baseDate) => {
    const weekArray = [];
    const todayCopy = new Date(baseDate);
    for (let i = 1; i < 6; i++) {
      let day = todayCopy.getDate() - todayCopy.getDay() + i;
      let formatted = moment(todayCopy.setDate(day)).format("MMM Do YY");
      weekArray.push(formatted);
    }
    return weekArray;
  };

  const calculateApprovedWeek = (baseDate) => {
    const weekArray1 = [];
    const todayCopy = new Date(baseDate);
    for (let i = 1; i < 6; i++) {
      let day = todayCopy.getDate() - todayCopy.getDay() + i;
      let formatted = moment(todayCopy.setDate(day)).format("MMM Do YY");
      weekArray1.push(formatted);
    }
    return weekArray1;
  };

  const handleFilterDates = async () => {
    if (!selectedDate) return alert("Please choose a date");

    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setDate(formattedDate);

    try {
      const data = await fetch(
        `http://localhost:3001/api/getSubmittedTimesheets?date=${formattedDate}&companyId=${companyId}&deptId=${deptId}`
      );
      const res = await data.json();
      console.log("Filtered (Pending):", res);

      if (Array.isArray(res)) {
        setEntries(res);
      } else if (res && Array.isArray(res.data)) {
        setEntries(res.data);
      } else {
        setEntries([]);
      }

      if (res.length > 0) {
        const newDate = new Date(res[0].WEEK_START);
        setWeeks(calculateWeek(newDate));
      } else {
        setWeeks(calculateWeek(selectedDate));
      }

      setTimeout(() => getAllTimesheets(), 1000);
    } catch (error) {
      console.error("Error filtering dates:", error);
    }
  };

  const handleFilterApprovedDates = async () => {
    if (!approvedDate) return alert("Please choose a date");

    const formattedDate = moment(approvedDate).format("YYYY-MM-DD");
    setDate(formattedDate);

    try {
      const data = await fetch(
        `http://localhost:3001/api/approvedTimeSheet?date=${formattedDate}&deptId=${deptId}`
      );
      const res = await data.json();
      console.log("Filtered (Approved):", res);

      if (Array.isArray(res)) {
        setApproved(res);
      } else if (res && Array.isArray(res.data)) {
        setApproved(res.data);
      } else {
        setApproved([]);
      }

      if (res.length > 0) {
        const newDate = new Date(res[0].WEEK_START);
        setApprovedWeeks(calculateApprovedWeek(newDate));
      } else {
        setApprovedWeeks(calculateApprovedWeek(approvedDate));
      }

      setTimeout(() => getApprovedTimesheets(), 1000);
    } catch (error) {
      console.error("Error filtering approved:", error);
    }
  };

  useEffect(() => {
    getAllTimesheets();
    getApprovedTimesheets();
    setWeeks(calculateWeek(new Date()));
    setApprovedWeeks(calculateApprovedWeek(new Date()));
  }, []);

  // --------------------- JSX ---------------------
  return (
    <>
      <div className="header">
        <div className="logos">
          <img src={gstsLogo} alt="GSTS" />
        </div>
        <div className="profileimage">
          {image ? (
            <img src={image} alt="Profile" className="profilepic" />
          ) : (
            <span className="letterAvatar">
              {firstLetter}
              {lastLetter}
            </span>
          )}
        </div>
      </div>

      <div id="approveWrapper">
        <Tabs className="maintabsContainer">
          <TabList className="innerTabContainer">
            <Tab className="eachTab pending">Pending Timesheets</Tab>
            <Tab className="eachTab approved">Approved Timesheets</Tab>
          </TabList>

          {/* ----------- Pending Timesheets ----------- */}
          <TabPanel>
            <div className="date-picker-container">
              <p>
                {weeks[0]} - {weeks[4]}
              </p>
              <div className="rightDatePickerContainer">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="custom-date-picker"
                  calendarClassName="custom-calendar"
                  customInput={<SlCalender />}
                />
                <button onClick={handleFilterDates} className="applyBtn">
                  Apply
                </button>
              </div>
            </div>

            <table className="userstable">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(entries) && entries.length > 0 ? (
                  entries.map((item) => (
                    <tr key={item.TIMESHEET_ID}>
                      <td>{item.EMP_ID}</td>
                      <td>
                        {item.FIRST_NAME} {item.LAST_NAME}
                      </td>
                      <td>{item.WEEK_START}</td>
                      <td>{item.TOTAL_HOURS}</td>
                      <td>
                        <button onClick={() => handleApproveTimesheets(item)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No pending timesheets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TabPanel>

          {/* ----------- Approved Timesheets ----------- */}
          <TabPanel>
            <div className="date-picker-container">
              <p>
                {approvedWeeks[0]} - {approvedWeeks[4]}
              </p>
              <div className="rightDatePickerContainer">
                <DatePicker
                  selected={approvedDate}
                  onChange={handleApprovedDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="custom-date-picker"
                  calendarClassName="custom-calendar"
                  customInput={<SlCalender />}
                />
                <button
                  onClick={handleFilterApprovedDates}
                  className="applyBtn"
                >
                  Apply
                </button>
              </div>
            </div>

            <table className="userstable">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(approved) && approved.length > 0 ? (
                  approved.map((item) => (
                    <tr key={item.TIMESHEET_ID}>
                      <td>{item.EMP_ID}</td>
                      <td>
                        {item.FIRST_NAME} {item.LAST_NAME}
                      </td>
                      <td>{item.WEEK_START}</td>
                      <td>{item.TOTAL_HOURS}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No approved timesheets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default ApproveTimesheets;
