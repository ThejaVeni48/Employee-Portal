const db = require('../config/db');

// API: Get submitted timesheets for manager/project manager
const getSubmittedTimesheets = (req, res) => {
  const { date, companyId, deptId, empId, role } = req.query;


  console.log("companyId",companyId);
  console.log("deptId",deptId);
  console.log("empId",empId);
  console.log("role",role);
  

  if (!companyId || !empId || !role) {
    return res.status(400).json({ error: "companyId, empId, and role are required" });
  }

  let sql = "";
  let params = [companyId];

  // CASE 1: Bench Manager — only employees not in any project
  if (role === "Manager") {
    sql = `
      SELECT 
        E.EMP_ID,
        E.FIRST_NAME,
        E.LAST_NAME,
        E.DEPT_ID,
        T.TIMESHEET_ID,
        T.WEEK_START,
        T.TOTAL_HOURS,
        T.STATUS
      FROM EMPLOYEES_DETAILS E
      JOIN TIMESHEETS T
        ON E.EMP_ID = T.EMP_ID
        AND E.COMPANY_ID = T.COMPANY_ID
      WHERE 
        T.COMPANY_ID = ? 
        AND T.STATUS = 'Submitted'
        AND E.STATUS = 'Bench'
        AND E.EMP_ID NOT IN (
          SELECT EMPLOYEE_ID FROM PROJECTS WHERE COMPANY_ID = ?
        )
    `;
    params.push(companyId);
  }

  //CASE 2: Project Manager — only employees under their project(s)
  else if (role === "Project Manager") {

    console.log("esle if block");
    
   sql = `
 SELECT 
    E.EMP_ID,
    E.FIRST_NAME,
    E.LAST_NAME,
    E.DEPT_ID,
    P.PROJECT_NAME,
    T.TIMESHEET_ID,
    T.WEEK_START,
    T.TOTAL_HOURS,
    T.STATUS AS timesheetStatus
FROM EMPLOYEES_DETAILS E
JOIN PROJECTS_EMPLOYEE PE
    ON E.EMP_ID = PE.EMP_ID
    AND E.COMPANY_ID = PE.COMPANY_ID
JOIN PROJECTS P
    ON P.PROJECT_NO = PE.PROJECT_NO
    AND P.COMPANY_ID = PE.COMPANY_ID
JOIN TIMESHEETS T
    ON T.EMP_ID = E.EMP_ID
    AND T.COMPANY_ID = E.COMPANY_ID
WHERE 
    E.STATUS = 'Project'                  -- employee currently in a project
    AND T.STATUS = 'Submitted'
    AND T.WEEK_START BETWEEN P.START_DATE AND P.END_DATE
    AND PE.COMPANY_ID = 'DEE-7BEBB1'
ORDER BY E.EMP_ID, T.WEEK_START;


`;

    params.push(empId);
  } 
  
  else {
    return res.status(400).json({ error: "Invalid role. Must be 'Bench Manager' or 'Project Manager'." });
  }

  // Optional filters
  if (deptId) {
    sql += " AND E.DEPT_ID = ?";
    params.push(deptId);
  }

  if (date) {
    sql += " AND T.WEEK_START = ?";
    params.push(date);
  }

  // Execute query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error fetching submitted timesheets:", err);
      return res.status(500).json({ error: err });
    }

    console.log(`Submitted timesheets for ${role}:`, result);
    return res.status(200).json({ data: result });
  });
};

module.exports = { getSubmittedTimesheets };
