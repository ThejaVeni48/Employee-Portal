// NOT IN USE

const db = require('../config/db');

const getProjects = (req, res) => {
  const { empId, companyId, startDate, lastDate } = req.query;

  if (!empId || !companyId) {
    return res.status(400).json({ error: "empId and companyId are required" });
  }

  if (startDate && lastDate) {
    const sql = `
      SELECT
          P.PROJECT_ID AS projectNo,
          P.PROJECT_NAME AS projectName,
          P.START_DATE AS projectStart,
          P.END_DATE AS projectEnd,
          P.STATUS AS projectStatus,
          P.PROJECT_LEAD AS projectLead,
          
          PE.PE AS peId,
          PE.EMP_ID AS empId,
          PE.ASSIGNED_DATE AS assignedDate,
          
          T.task_id AS taskId,
          T.task_name AS taskName,
          T.assigned_to AS taskAssignedTo,
          T.status AS taskStatus,
          T.START_DATE AS taskStart,
          T.END_DATE AS taskEnd
      FROM PROJECTS P
      INNER JOIN PROJECTS_EMPLOYEE PE
          ON P.PROJECT_ID = PE.PROJECT_ID
          AND P.COMPANY_ID = PE.COMPANY_ID
      LEFT JOIN TASKS T
          ON T.PROJECT_ID = P.PROJECT_ID
          AND T.COMPANY_ID = P.COMPANY_ID
          AND (T.START_DATE <= ? AND T.END_DATE >= ?)
      WHERE 
          PE.EMP_ID = ?
          AND PE.COMPANY_ID = ?
          AND (
              (P.START_DATE <= ? AND P.END_DATE >= ?)
              OR (P.START_DATE IS NULL OR P.END_DATE IS NULL)
          )
      ORDER BY P.PROJECT_ID, T.START_DATE
    `;

    const params = [
      lastDate, startDate, 
      empId, companyId,
      lastDate, startDate  
    ];

    db.query(sql, params, (error, result) => {
      if (error) {
        console.log("error for timesheet", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("Projects fetched:", result.length);
      return res.status(200).json({ data: result });
    });

  } else {
    // fallback: return all projects without date filtering
    const sql = `
      SELECT P.*, PE.*, T.TASKS
      FROM PROJECTS P
      INNER JOIN PROJECTS_EMPLOYEE PE 
          ON P.PROJECT_ID = PE.PROJECT_ID
          AND P.COMPANY_ID = PE.COMPANY_ID
      LEFT JOIN (
          SELECT PROJECT_ID, COMPANY_ID, GROUP_CONCAT(TASK_NAME SEPARATOR ', ') AS TASKS
          FROM TASKS
          GROUP BY PROJECT_ID, COMPANY_ID
      ) T ON T.PROJECT_ID = P.PROJECT_ID 
          AND T.COMPANY_ID = P.COMPANY_ID
      WHERE PE.EMP_ID = ?
        AND PE.COMPANY_ID = ?;
    `;

    db.query(sql, [empId, companyId], (error, result) => {
      if (error) {
        console.log("error for timesheet", error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ data: result });
    });
  }
};

module.exports = { getProjects };
