import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ViewTimesheet.css";
import { useSelector } from "react-redux";
import moment from "moment";

const ViewTimesheets = () => {
  const location = useLocation();
  const [remarks, setRemarks] = useState("");
  const [entries, setEntries] = useState([]);
  // const profile = useSelector((state) => state.profileImage);
  // const userId = useSelector((state) => state.userId);
  const firstName = location.state?.firstName;
  const lastName = location.state?.lastName;
  const employeeEmpId = location.state?.EmpId;
  const empId = useSelector((state) => state.empId);
  const companyId = useSelector((state) => state.companyId);
  console.log("companyId", companyId);
  const [image] = useState(null);

  const firstLetter = firstName ? firstName[0] : "";
  const lastLetter = lastName ? lastName[0] : "";
  console.log("firstname", firstName);
  // console.log("empId",EmpId);

  const timesheetId = location.state?.timesheetId || "";

  console.log("timesheetid", timesheetId);
  console.log("firstName", firstName);
  //  console.log("lastName",lastName);

  useEffect(() => {
    getTimesheet();
  }, []);

  const getTimesheet = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/getTimesheetEntries?timesheetId=${timesheetId}&companyId=${companyId}`
      );
      if (!data.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await data.json();
      console.log("RES", res);

      const xy = res.data[0].START_DATE;
      const xyy = res.data[4].START_DATE;
      console.log("xy", xy);
      console.log("xyy", xyy);
      setEntries(res.data);

      console.log("res", res);
    } catch (error) {
      console.error("error occured", error);
    }
  };

  const handleAcceptTimesheet = async () => {
    console.log("timesheetId", timesheetId);
    try {
      const data = await fetch("http://localhost:3001/api/acceptTimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timesheetId,
          employeeEmpId,
          action: "Approved",
          companyId,
          empId,
        }),
      });

      if (!data.ok) throw new Error("Network response was not ok");

      const result = await data.json();
      console.log("result", result);
      if (result.status === 1) {
        alert("Timesheet is approved");
      }
    } catch (error) {
      console.error("error occured", error);
    }
  };
  const handleRejectTimesheet = async () => {
    console.log("timesheetId", timesheetId);
    try {
      const data = await fetch("http://localhost:3001/api/acceptTimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timesheetId,
          remarks,
          employeeEmpId,
          action: "Rejected",
          companyId,
          empId,
        }),
      });

      if (!data.ok) throw new Error("Network response was not ok");

      const result = await data.json();
      console.log("result", result);
      if (result.status === 1) {
        alert("Rejected the timesheet");
      }
    } catch (error) {
      console.error("error occured", error);
    }
  };

  return (
    <>
      <div className="header">
        <div className="logos">
          <img
            alt="GSTS"
            style={{ width: 200, height: "auto" }}
          />
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
      <div className="userDetails">
        <p>
          EmployeeName:{firstName} {lastName}
        </p>
        <p>EmployeeId:{employeeEmpId}</p>

        <p>
          Timesheet for the Week :{" "}
          {entries[0]?.ENTRY_DATE
            ? moment(entries[0].ENTRY_DATE).format("DD-MMM-YYYY")
            : ""}
          {"  -  "}
          {entries[4]?.ENTRY_DATE
            ? moment(entries[4].ENTRY_DATE).format("DD-MMM-YYYY")
            : ""}
        </p>
      </div>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Project Type</th>
              <th>Billable Type</th>

              <th>Task</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item, index) => (
              <tr key={index}>
                <td>{item.ENTRY_DATE}</td>
                <td>{item.PROJECT_TYPE}</td>
                <td>{item.BILLABLE_TYPE}</td>

                <td>{item.TASK}</td>
                <td>{item.DAILY_HOURS}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="remarksContainer">
          <label>Remarks:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          >
            Enter Remarks
          </textarea>
        </div>
        <div className="btnContainer">
          <button onClick={handleAcceptTimesheet}>Approve</button>
          <button onClick={handleRejectTimesheet}>Reject</button>
        </div>
      </div>
    </>
  );
};

export default ViewTimesheets;
