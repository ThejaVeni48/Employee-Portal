const db = require('../config/db');

const getTasks = (req, res) => {
  const { companyId, projectId, empId, role } = req.query;

  if (!companyId || !projectId || !role) {
    return res.status(400).json({
      success: false,
      message: "companyId, projectId, and role are required",
    });
  }

  // Base query
  let sql = `
    SELECT 
      T.TASK_ID,
      T.TASK_NAME,
      T.START_DATE AS TASK_START_DATE,
      T.END_DATE AS TASK_END_DATE,
      T.STATUS AS TASK_STATUS,
      T.ASSIGNED_TO,
      P.PROJECT_NO,
      P.PROJECT_NAME,
      PE.EMP_ID,
      PE.DEPARTMENT,
      P.PROJECT_LEAD
    FROM TASKS T
    INNER JOIN PROJECTS P
      ON T.PROJECT_NO = P.PROJECT_NO
      AND T.COMPANY_ID = P.COMPANY_ID
    INNER JOIN PROJECTS_EMPLOYEE PE
      ON P.PROJECT_NO = PE.PROJECT_NO
      AND P.COMPANY_ID = PE.COMPANY_ID
    WHERE P.COMPANY_ID = ?
      AND P.PROJECT_NO = ?
  `;

  const params = [companyId, projectId];

  // If role is Employee, filter tasks for that employee only
  if (role === "Employee") {
    sql += " AND PE.EMP_ID = ?";
    params.push(empId);
  }

  sql += " ORDER BY T.START_DATE;";

  db.query(sql, params, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching tasks",
        error: error.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for the given criteria",
        data: [],
      });
    }

    const mappedResults = results.map((task) => ({
      TASK_ID: task.TASK_ID,
      TASK_NAME: task.TASK_NAME,
      TASK_START_DATE: task.TASK_START_DATE,
      TASK_END_DATE: task.TASK_END_DATE,
      TASK_STATUS: task.TASK_STATUS,
      ASSIGNED_TO: task.ASSIGNED_TO,
      PROJECT_NO: task.PROJECT_NO,
      PROJECT_NAME: task.PROJECT_NAME,
      DEPT: task.DEPARTMENT,
      PROJECT_LEAD: task.PROJECT_LEAD,
    }));

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: mappedResults,
    });
  });
};

module.exports = { getTasks };
