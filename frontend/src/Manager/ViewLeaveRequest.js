import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ViewLeaveRequest.css";

const ViewLeaveTimeSheet = () => {
  const location = useLocation();
  const data = location.state?.item || {};
  const [comments, setComments] = useState("");
  const nav = useNavigate();

  const handleApproveLeave = async () => {
    console.log("approved");

    console.log("requestId", data.REQUEST_ID);
    try {
      const datas = await fetch("http://localhost:3001/api/acceptRejectLeave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: data.REQUEST_ID,
          action: "Approved",
          comments,
        }),
      });

      const result = await datas.json();
      console.log("result", result);
      if (result.status === 200) {
        alert("You approved the leave ");
        setTimeout(() => {
          nav("/managerdashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("error occured");
    }
  };

  const handleRejectLeave = async () => {
    console.log("requestId", data.REQUEST_ID);
    try {
      const datas = await fetch("http://localhost:3001/api/acceptRejectLeave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: data.REQUEST_ID,
          action: "Rejected",
          comments,
        }),
      });

      const result = await datas.json();
      console.log("result", result);
      if (result.status === 201) {
        alert("You rejected  the leave ");
        setTimeout(() => {
          nav("/admindashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("error occured");
    }
  };
  return (
    <div className="view-container">
      <h2 className="view-title">View Leave</h2>

      <div className="view-card">
        <div className="view-row">
          <span className="label">Employee ID:</span>
          <span className="value">{data.EMP_ID}</span>
        </div>

        <div className="view-row">
          <span className="label">Employee Name:</span>
          <span className="value">
            {data.FIRST_NAME} {data.LAST_NAME}
          </span>
        </div>

        <div className="view-row">
          <span className="label">Start Date:</span>
          <span className="value">{data.START_DATE}</span>
        </div>

        <div className="view-row">
          <span className="label">End Date:</span>
          <span className="value">{data.END_DATE}</span>
        </div>

        <div className="view-row row1">
          <p className="label">Reason:</p>
          <input className="reason-box" value={data.REASON} disabled />
        </div>
      </div>
      <div>
        <label>Comments</label>
        <input
          type="text"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button onClick={handleApproveLeave} className="approve">
          Approve
        </button>
        <button onClick={handleRejectLeave} className="reject">
          Reject
        </button>
      </div>
    </div>
  );
};

export default ViewLeaveTimeSheet;
