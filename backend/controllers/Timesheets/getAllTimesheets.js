// this api used by viewing the timesheet by the particlaur approvals irrespective of projects

const db = require("../../config/db");

const getAllEmpTimesheets = (req, res) => {
  const { orgId, weekId, empId } = req.query;

  const sql = `SELECT U.DISPLAY_NAME, T.* FROM 
TC_TIMESHEET T
JOIN TC_USERS U
ON U.EMP_ID = T.EMP_ID
AND U.ORG_ID = T.ORG_ID
WHERE T.CURRENT_APPROVER = ?
AND T.ORG_ID = ?
AND T.TC_MASTER_ID =? `;

  db.query(sql, [empId, orgId, weekId], (error, result) => {
    if (error) {
      console.log("Error occured", error);
      return res.status(500).json({ data: error });
    }

    console.log("Result", result);
    return res.status(200).json({ data: result });
  });
};

module.exports = { getAllEmpTimesheets };
