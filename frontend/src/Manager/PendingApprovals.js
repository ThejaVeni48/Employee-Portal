import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import "./PendingApprovals.css";

const PendingApprovals = () => {
  const nav = useNavigate();
  // const profile = useSelector((state) => state.profileImage);
  const location = useLocation();
  const pendingApprovals = location.state?.totalPendingApprovalsList || [];

  console.log("pendingApprovals", pendingApprovals);

  const handleNav = (item) => {
    console.log("item", item);
    nav("/viewLeaveTimeSheet", {
      state: { item },
    });
  };

  return (
    <div className="approvals-container">
      <h4 className="heading">Manage Leaves</h4>

      <table className="approvals-table">
        <thead>
          <tr>
            <th>Request Id</th>
            <th>EmpId</th>
            <th>EmpName</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingApprovals.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                No pending approvals
              </td>
            </tr>
          ) : (
            pendingApprovals.map((item, index) => (
              <tr key={index}>
                <td>{item.REQUEST_ID}</td>
                <td>{item.EMP_ID}</td>
                <td>{item.FIRST_NAME + item.LAST_NAME}</td>
                <td>{item.DAYS}</td>
                <td>{item.REASON}</td>
                <td>
                  <span
                    className={`status ${
                      item.STATUS === "Approved"
                        ? "approved"
                        : item.STATUS === "Rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {item.STATUS}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => handleNav(item)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingApprovals;
