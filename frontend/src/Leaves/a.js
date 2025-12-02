import React, { useEffect, useState } from "react";
import "./Leavesdashboard.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import gstsLogo from "../Assests/GSTS.png";
import DatePicker from "react-datepicker";
import moment from "moment";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Calendar } from 'primereact/calendar';


const LeavesDashboard = () => {
  const firstName = useSelector((state) => state.firstName);
  const lastName = useSelector((state) => state.lastName);
  const empId = useSelector((state) => state.empId);
  const companyId = useSelector((state) => state.companyId);
  const firstLetter = firstName ? firstName[0] : "";
  const lastLetter = lastName ? lastName[0] : "";
  const [profile, setProfile] = useState(null);
  const [daysLeave, setDaysLeave] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalLeaves, setTotalLeaves] = useState("");
  const [leaves, setLeaves] = useState({});
  const [leavesHistory, setLeavesHistory] = useState([]);
  const [usedLeaves, setUsedLeaves] = useState("");
  const [availableLeaves, setavailableLeaves] = useState("");
  const location = useLocation();
  const startDateR = location.state?.startDate;
  const endDateR = location.state?.endDate;
  const reasonR = location.state?.reason;
  const triggeredButton = location.state?.triggered;
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
     const createdBy = location.state?.createdBy || '';
     console.log("crwate",createdBy);
       const pStatus = useSelector((state) => state.pStatus);
         const [holidays,setHolidays] = useState([]);
         

        const [date, setDate] = useState(null);
     
  useEffect(() => {
    if (startDateR) setStartDate(new Date(startDateR));
    if (endDateR) setEndDate(new Date(endDateR));
    if (reasonR) setReason(reasonR);
  }, [startDateR, endDateR, reasonR]);

  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 0;

    const arr = [];
    let current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        arr.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return arr.length;
  };

  useEffect(() => {
    if (startDate && endDate) {
      setDaysLeave(calculateWorkingDays(startDate, endDate));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    getLeaves();
    showAllLeaves();
     getHolidays();
  }, []);

  const getLeaves = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getLeaves?empId=${empId}&companyId=${companyId}`
      );

      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();
      console.log("response for getleaves", response);
      setTotalLeaves(response.data[0].TOTAL_LEAVES);
      setUsedLeaves(response.data[0].USED_LEAVES);
      setavailableLeaves(response.data[0].AVAILABLE_LEAVES);
      setLeaveTypes(response.data);

      // const totalLeaves = response.data.reduce(
      //   (acc, item) => acc + item.REMAINING_DAYS,
      //   0
      // );
      // setTotalLeaves(totalLeaves);

      // const leaveMap = {};
      // response.data.forEach((item) => {
      //   leaveMap[item.LEAVE_TYPE] = item.REMAINING_DAYS;
      // });
      // setLeaves(leaveMap);
    } catch (error) {
      console.error("error occured getLeaves", error);
    }
  };
  useEffect(() => {
    getLeavesTypes();
  }, []);

  const getLeavesTypes = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getLeaveTypes?companyId=${companyId}`
      );

      // console.log("res", res);

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      setLeaveTypes(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("error occured", error);
    }
  };

  const showAllLeaves = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/showAllLeaves?empId=${empId}&companyId=${companyId}`
      );

      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();
      console.log("response",response);
      
      setLeavesHistory(response.data);
    } catch (error) {
      console.error("error occured", error);
    }
  };

  const handleSubmitLeave = async () => {
    console.log("empId", empId);
    console.log("companyId", companyId);
    console.log("selectLeave", selectedLeaveType);
    console.log("daysLeave", daysLeave);
    console.log("reason", reason);
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    if (!startDate || !endDate || !selectedLeaveType || !reason) {
      alert("Please fill all fields before submitting");
      return;
    }
    if(daysLeave > availableLeaves)
    {
      alert("You are exceeding your leaves limit");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/submitLeave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          companyId,
          selectedLeaveType,
          startDate: moment(startDate).format("YYYY-MM-DD"),
          endDate: moment(endDate).format("YYYY-MM-DD"),
          daysLeave,
          reason,
          createdBy,
          pStatus
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Leave submitted successfully");
        showAllLeaves();
        getLeaves();
      } else if (res.status === 409) {
        alert("You already submitted leave for this date range");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Network/Server error:", error);
      alert("Network error. Please try again later.");
    }
  };

 useEffect(()=>{
     
    },[])


  const getHolidays = async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/getHolidays?companyId=${companyId}`);
    if (!res.ok) throw new Error("Network response was not ok");

    const response = await res.json();

    const formattedHolidays = response.data.map((h) => ({
      date: new Date(h.START_DATE),
      name: h.NAME, // make sure your API returns a "name" field for each holiday
    }));

    setHolidays(formattedHolidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
  }
};




  return (
    <div id="leavesWrapper">
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

      <div className="leavesHeader">
        <div className="profileContainer1 secondSection">
          <p>Total Leaves</p>
          <p>{totalLeaves}/24</p>
        </div>
        <div className="profileContainer1 thirdSection">
          <p>Used Leaves</p>
          <p>{usedLeaves}/24</p>
        </div>
        <div className="profileContainer1 fourthSection">
          <p>Available Leaves</p>
          <p>{availableLeaves}/24</p>
        </div>
      </div>

      <div className="lowerSection">
        <div className="applyLeavesSection">
          <p>Apply Leave</p>

          <div className="form-group">
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Choose Start Date"
              className="custom-date-picker"
              calendarClassName="custom-calendar"
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Choose End Date"
              className="custom-date-picker"
              calendarClassName="custom-calendar"
            />
          </div>

          <div className="form-group">
            <label>No. of Days</label>
            <input
              type="text"
              value={daysLeave}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Select Leave</label>
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
            >
              <option value="" disabled>
                Choose Employee
              </option>
              {leaveTypes.map((item) => (
                <option key={item.LEAVE_ID} value={item.LEAVE_ID}>
                  {item.LEAVE_NAME}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave"
              rows="4"
              className="custom-textarea"
            ></textarea>
          </div>

          <button className="apply-btn" onClick={handleSubmitLeave}>
            Submit Leave
          </button>
        </div>

        <div className="leavesHistorySection">
          <p>Leaves History</p>
          <table>
            <thead>
              <tr>
                <th>START_DATE</th>
                <th>END_DATE</th>
                <th>DAYS</th>
                <th>LEAVE_TYPE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {leavesHistory.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.START_DATE}</td>
                  <td>{item.END_DATE}</td>
                  <td>{item.DAYS}</td>
                  <td>{item.LEAVE_TYPE}</td>
                  <td>
                    {item.STATUS}
                    <IoIosInformationCircleOutline title={item.COMMENTS} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </div>
    <div className="card flex justify-content-center align-items-center">
 <Calendar
  inline
  dateTemplate={(cell) => {
    const cellDate = new Date(cell.year, cell.month, cell.day);

    const holiday = holidays.find(
      (h) =>
        h.date.getFullYear() === cellDate.getFullYear() &&
        h.date.getMonth() === cellDate.getMonth() &&
        h.date.getDate() === cellDate.getDate()
    );

    return (
      <div style={{ textAlign: "center", cursor: "pointer" }}>
        {holiday ? (
          <>
            <span
              style={{
                backgroundColor: "gold",
                // color: "white",
                borderRadius: "50%",
                display: "inline-block",
                width: "2rem",
                height: "2rem",
                textAlign:'center',
                lineHeight: "2rem",
                // textAlign: "center",
                // marginBottom: "2px",
              }}
              title={holiday.name} 
            >
              {cell.day}
            </span>
            {/* <div
              style={{
                fontSize: "0.6rem",
                color: "red",
                marginTop: "2px",
              }}
            >
              {holiday.name} 
            </div> */}
          </>
        ) : (
           <div style={{border:'3px solid pink',width:'3rem'}}>
          <span>{cell.day}</span>
          </div>
        )}
      </div>
    );
  }}
/>


</div>

    </div>

  );
};

export default LeavesDashboard;




