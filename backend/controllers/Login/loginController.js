

// not in use

const db = require('../../config/db');

const loginApi = (req, res) => {
  const { email, password } = req.body;
  console.log("email:", email);
  console.log("password:", password);

  // Step 1: Check Admin login
  const adminSql = `
    SELECT * 
    FROM COMPANIES_REGISTRATIONS 
    WHERE EMAIL = ? AND PASSWORD = ?
  `;
  
  db.query(adminSql, [email, password], (err, adminResult) => {
    if (err) {
      console.log("Admin login error:", err);
      return res.status(500).json({ error: err.message });
    }

    // Admin login
    if (adminResult.length > 0) {
      const admin = adminResult[0];
      return res.status(200).json({
        success: true,
        role: "Admin",
        firstName: admin.FIRST_NAME || "",
        lastName: admin.LAST_NAME || "",
        orgId: admin.ORG_ID,
        companyName: admin.COMPANY_NAME,
        createdBy: admin.CREATED_BY,
        domain:admin.DOMAIN_NAME,
        result: 1,
      });
    }

    // Step 2: If not admin, check Employee login
    const empSql = `
SELECT 
    e.*,
    R.ROLE_NAME, 
    c.TIMESHEET_CODE,
    ed.DEPT_ID,
    ed.STATUS,
    ed.FIRST_NAME,
    ed.LAST_NAME,
    IFNULL(
        COALESCE(P.PROJECT_ID, PA.PROJECT_ID),
        0
    ) AS PROJECT_ID
FROM EMPLOYEES_LOGINS e
JOIN ROLES R
    ON e.ROLE_ID = R.ROLE_ID
LEFT JOIN PROJECTS_ASSIGNMENTS PA
    ON PA.EMP_ID = e.EMP_ID
    AND PA.COMPANY_ID = e.COMPANY_ID
LEFT JOIN PROJECTS P
    ON P.PROJECT_MANAGER = e.EMP_ID
    AND P.COMPANY_ID = e.COMPANY_ID
JOIN COMPANIES_REGISTRATIONS c 
    ON e.COMPANY_ID = c.COMPANY_ID
JOIN EMPLOYEES_DETAILS ed 
    ON e.EMP_ID = ed.EMP_ID
WHERE e.EMAIL = ?
  AND e.PASSWORD = ?
    `;

    db.query(empSql, [email, password], (empErr, empResult) => {
      if (empErr) {
        console.log("Employee login error:", empErr);
        return res.status(500).json({ error: empErr.message });
      }

      if (empResult.length === 0) {
        return res.status(404).json({ success: false, message: "Invalid email or password" });
      }

      const emp = empResult[0];

      // Step 3: Check employee status
      if (emp.STATUS !== "Active") {
        return res.status(403).json({
          success: false,
          message: `Access denied. Employee is currently ${emp.STATUS}.`,
        });
      }

      // Employee found and active
      return res.status(200).json({
        success: true,
        role: emp.ROLE_NAME,
        empId: emp.EMP_ID,
        empName: emp.EMPNAME,
        companyId: emp.COMPANY_ID,
        timesheetCode: emp.TIMESHEET_CODE,
        deptId: emp.DEPT_ID,
        firstName: emp.FIRST_NAME,
        lastName: emp.LAST_NAME,
        createdBy: emp.EMP_ID,
        projectId:emp.PROJECT_ID
      });
    });
  });
};

module.exports = { loginApi };
