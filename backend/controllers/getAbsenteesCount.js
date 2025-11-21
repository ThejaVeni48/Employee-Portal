// this api is used for getting the count of employees on leave




const db = require('../config/db');


const getAbsenteesCount = (req, res) => {
  const { companyId, deptId, projectContext } = req.query;

  if (!companyId || !deptId || !projectContext) {
    return res.status(400).json({ error: "Missing required query params" });
  }

  const sql = `
    SELECT COUNT(E.EMP_ID) AS todays_leaves
    FROM LEAVES_REQUESTS L
    JOIN EMPLOYEES_DETAILS E ON E.EMP_ID = L.EMP_ID
    JOIN DEPARTMENTS D ON D.DEPT_ID = E.DEPT_ID
    WHERE L.STATUS = 'Approved'
      AND L.COMPANY_ID = ?
      AND L.PROJECT_CONTEXT = ?
      AND D.DEPT_ID = ?
      AND L.START_DATE = CURDATE();
  `;

  db.query(sql, [companyId, projectContext, deptId], (err, result) => {
    if (err) {
      console.error("Error occurred", err);
      return res.status(500).json({ data: err });
    }
    console.log("retutn absenntes count",result);
    
    return res.status(200).json({ data: result });
    
  });
};




module.exports = {getAbsenteesCount}