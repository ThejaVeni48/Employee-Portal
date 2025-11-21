const db = require('../config/db');

// API: Get pending leaves for employees for a manager
const getPendingLeaves = (req, res) => {
  const { companyId, deptId, projectContext } = req.query;

  if (!companyId) {
    return res.status(400).json({ error: "companyId is required" });
  }

  // Bench employees
  if (projectContext === 'Bench') {
    const sqlBench = `
      SELECT 
        E.FIRST_NAME,
        E.LAST_NAME,
        LR.REQUEST_ID,
        LR.EMP_ID,
        LR.DAYS,
        LR.START_DATE,
        LR.END_DATE,
        LR.REASON
      FROM EMPLOYEES_DETAILS E
      JOIN LEAVES_REQUESTS LR
        ON LR.EMP_ID = E.EMP_ID 
        AND LR.COMPANY_ID = E.COMPANY_ID
      WHERE LR.STATUS = 'Pending'
        AND E.COMPANY_ID = ?
        AND E.DEPT_ID = ?      -- keep dept filter for bench
        AND LR.PROJECT_CONTEXT = 'Bench'
      ORDER BY LR.REQUEST_ID DESC
    `;

    db.query(sqlBench, [companyId, deptId], (err, result) => {
      if (err) {
        console.log("Error fetching bench leaves:", err);
        return res.status(500).json({ error: err });
      }
      return res.status(200).json({ data: result });
    });
  }

  // Project employees
  else if (projectContext === 'Project') {
    const sqlProject = `
      SELECT 
        E.FIRST_NAME,
        E.LAST_NAME,
        LR.REQUEST_ID,
        LR.EMP_ID,
        LR.DAYS,
        LR.START_DATE,
        LR.END_DATE,
        LR.REASON
      FROM EMPLOYEES_DETAILS E
      JOIN LEAVES_REQUESTS LR
        ON LR.EMP_ID = E.EMP_ID 
        AND LR.COMPANY_ID = E.COMPANY_ID
      WHERE LR.STATUS = 'Pending'
        AND E.COMPANY_ID = ?     -- no dept filter
        AND LR.PROJECT_CONTEXT = 'Project'
      ORDER BY LR.REQUEST_ID DESC
    `;

    db.query(sqlProject, [companyId], (err, result) => {
      if (err) {
        console.log("Error fetching project leaves:", err);
        return res.status(500).json({ error: err });
      }
      return res.status(200).json({ data: result });
    });
  } 
  else {
    return res.status(400).json({ error: "Invalid projectContext" });
  }
};

module.exports = { getPendingLeaves };
