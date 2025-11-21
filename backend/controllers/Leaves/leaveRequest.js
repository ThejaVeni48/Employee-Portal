const db = require("../../config/db");

const getPendingLeaves = (req, res) => {
  const { companyId, empId, role, deptId } = req.query;

  if (!companyId || !role) {
    return res.status(400).json({ error: "companyId and role are required" });
  }

  let sqlQuery = "";
  let params = [companyId, deptId];

  if (role === "Manager") {
    // Manager sees all pending leaves
    sqlQuery = `
      SELECT 
          E.FIRST_NAME,
          E.LAST_NAME,
          LR.REQUEST_ID,
          LR.EMP_ID,
          LR.DAYS,
          LR.START_DATE,
          LR.END_DATE,
          LR.REASON,
          LR.STATUS
        FROM EMPLOYEES_DETAILS E
        JOIN LEAVES_REQUESTS LR
          ON LR.EMP_ID = E.EMP_ID 
          AND LR.COMPANY_ID = E.COMPANY_ID
        WHERE LR.STATUS = 'Pending'
          AND E.COMPANY_ID = ?
          AND E.DEPT_ID = ?
        ORDER BY LR.REQUEST_ID DESC;
    `;
  } else {
    // Employees cannot see others' leaves
    return res
      .status(403)
      .json({ error: "Only Manager can view pending leaves" });
  }

  db.query(sqlQuery, params, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.status(200).json({ data: result });
  });
};
module.exports = { getPendingLeaves };
