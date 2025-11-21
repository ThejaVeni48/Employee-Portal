const db = require('../../config/db.js');

const getSubmittedTimesheets = (req, res) => {
  const { companyId, projectId, startDate, endDate, status, role } = req.query;

  if (!companyId) {
    return res.status(400).json({ error: "companyId is required" });
  }

  let sql = "";
  let params = [];

  if (role === "Manager" || role === "Project Manager") {
    sql = `
      SELECT
        E.DISPLAY_NAME,
        E.EMP_ID,
        TE.PROJECT_ID,
        T.WEEK_START,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Monday' THEN TE.DAILY_HOURS ELSE 0 END) AS Monday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Tuesday' THEN TE.DAILY_HOURS ELSE 0 END) AS Tuesday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Wednesday' THEN TE.DAILY_HOURS ELSE 0 END) AS Wednesday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Thursday' THEN TE.DAILY_HOURS ELSE 0 END) AS Thursday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Friday' THEN TE.DAILY_HOURS ELSE 0 END) AS Friday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Saturday' THEN TE.DAILY_HOURS ELSE 0 END) AS Saturday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Sunday' THEN TE.DAILY_HOURS ELSE 0 END) AS Sunday,
        SUM(TE.DAILY_HOURS) AS TOTAL_HOURS,
        T.STATUS,
        T.REMARKS,
        T.TIMESHEET_ID
      FROM TIMESHEETS T
      JOIN TIMESHEET_ENTRIES TE ON T.TIMESHEET_ID = TE.TIMESHEET_ID
      JOIN EMPLOYEES_DETAILS E ON T.EMP_ID = E.EMP_ID
      JOIN DEPARTMENTS D ON D.DEPT_ID = E.DEPT_ID
      WHERE T.COMPANY_ID = ?
        AND TE.PROJECT_ID = ?
    `;
    params = [companyId, projectId];
  } 
  else if (role === "CTO") {
    sql = `
      SELECT 
        E.DISPLAY_NAME,
        E.EMP_ID,
        TE.PROJECT_ID,
        T.WEEK_START,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Monday' THEN TE.DAILY_HOURS ELSE 0 END) AS Monday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Tuesday' THEN TE.DAILY_HOURS ELSE 0 END) AS Tuesday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Wednesday' THEN TE.DAILY_HOURS ELSE 0 END) AS Wednesday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Thursday' THEN TE.DAILY_HOURS ELSE 0 END) AS Thursday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Friday' THEN TE.DAILY_HOURS ELSE 0 END) AS Friday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Saturday' THEN TE.DAILY_HOURS ELSE 0 END) AS Saturday,
        SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Sunday' THEN TE.DAILY_HOURS ELSE 0 END) AS Sunday,
        SUM(TE.DAILY_HOURS) AS TOTAL_HOURS,
        T.STATUS,
        T.REMARKS,
        T.TIMESHEET_ID
      FROM TIMESHEETS T
      JOIN TIMESHEET_ENTRIES TE ON T.TIMESHEET_ID = TE.TIMESHEET_ID
      JOIN EMPLOYEES_DETAILS E ON T.EMP_ID = E.EMP_ID
      JOIN ROLES R ON R.ROLE_ID = E.ROLE_ID
      WHERE T.COMPANY_ID = ?
        AND (R.ROLE_NAME = 'Manager' OR R.ROLE_NAME = 'Project Manager')
    `;
    params = [companyId];
  } 
  else {
    return res.json([]);
  }

  // ✅ Add filters BEFORE GROUP BY
  if (startDate && endDate) {
    sql += ` AND TE.ENTRY_DATE BETWEEN ? AND ? `;
    params.push(startDate, endDate);
  }

  if (status && status !== "All") {
    sql += ` AND T.STATUS = ? `;
    params.push(status);
  }

  // ✅ Now safely close with GROUP BY + ORDER BY
  sql += `
    GROUP BY E.DISPLAY_NAME, TE.PROJECT_ID, T.WEEK_START, T.REMARKS, T.TIMESHEET_ID, E.EMP_ID
    ORDER BY E.DISPLAY_NAME;
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching timesheets:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
};

module.exports = { getSubmittedTimesheets };
