const db = require('../config/db');

const getPMProjects = (req, res) => {
  const { empId, companyId } = req.query;

  if (!empId || !companyId) {
    return res.status(400).json({ error: "pmId and companyId are required" });
  }

  const sql = `
    SELECT 
      P.PROJECT_ID,
      P.PROJECT_NAME,
      P.START_DATE,
      P.END_DATE,
      P.STATUS
    FROM PROJECTS P
    WHERE P.EMPLOYEE_ID = ?
      AND P.COMPANY_ID = ?
      AND P.START_DATE <= CURDATE()     -- project has started
      AND P.END_DATE >= CURDATE()       -- project has not ended
    ORDER BY P.START_DATE ASC;
  `;

  db.query(sql, [empId, companyId], (error, result) => {
    if (error) {
      console.error("Error fetching PM current projects:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data: result });
  });
};

module.exports = { getPMProjects };
