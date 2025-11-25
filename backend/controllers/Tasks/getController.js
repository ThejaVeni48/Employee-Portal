
// this api is used to get all tasks to show to the teamlead (which are created by him)

// not use in api

const db = require('../../config/db');

const getTasks = (req, res) => {
  const { companyId, empId } = req.query;

  if (!companyId) {
    return res.status(400).json({ success: false, message: "companyId is required" });
  }

  let sql = `
    SELECT 
      T.TASK_ID,
      T.TASK_NAME,
      T.STATUS,
      DATE_FORMAT(T.CREATION_DATE, '%Y-%m-%d') AS CREATED_DATE,
      P.PROJECT_NAME,
      CONCAT(E.FIRST_NAME, ' ', E.LAST_NAME) AS ASSIGNEE
    FROM TASKS T
    JOIN PROJECTS P ON T.PROJECT_ID = P.PROJECT_ID
    JOIN EMPLOYEES_DETAILS E ON T.ASSIGNED_TO = E.EMP_ID
    WHERE T.COMPANY_ID = ?
  `;

  const params = [companyId];

  if (empId) {
    sql += ` AND (T.CREATED_BY = ? OR T.ASSIGNED_TO = ?)`;
    params.push(empId, empId);
  }

  sql += ` ORDER BY T.CREATION_DATE DESC`;

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  });
};

module.exports = { getTasks };
