// This API is used for showing the employees of a particular department

const db = require("../config/db");

const showDeptEmp = (req, res) => {
  const {  companyId, roles,empId } = req.query;

  console.log("companyId",companyId);
  console.log("roles",roles);
  console.log("empId",empId);
  
  

  if ( !companyId) 
    {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  if (roles === "Admin")
     {
      console.log("if block");
      
    const role = "Employee";
    const status = "Bench";

    const sql = `
     SELECT * 
      FROM EMPLOYEES_DETAILS 
      WHERE  COMPANY_ID = ?
        AND ROLE = ?
        AND STATUS = ?;
    `;

    db.query(sql, [ companyId, role, status], (error, result) => {
      if (error) {
        console.error("Error fetching department employees (Admin):", error);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Result (Admin - same dept employees):", result);
      return res.status(200).json({ data: result });
    });
  } else {
          console.log("else block");

    const sql = `
    SELECT D.DEPT_NAME, ED.DISPLAY_NAME,ED.EMP_ID
FROM EMPLOYEES_DETAILS ED
JOIN DEPARTMENTS D
ON ED.COMPANY_ID = D.COMPANY_ID
AND ED.DEPT_ID = D.DEPT_ID
WHERE 
     ED.COMPANY_ID = ?
       AND ED.ROLE = 'EMPLOYEE'
        AND ED.STATUS = 'BENCH';
    `;

    db.query(sql, [companyId], (error, result) => {
      if (error) {
        console.error("Error fetching department employees:", error);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Result (Non-admin - dept employees):", result);
      return res.status(200).json({ data: result });
    });
  }
};

module.exports = { showDeptEmp };
