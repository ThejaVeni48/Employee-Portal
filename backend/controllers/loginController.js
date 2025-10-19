
const db = require('../config/db');

const loginApi= (req, res) => {
  const { email, password } = req.body;

  console.log("eail",email);
  console.log("password",password);
  



  // Check Admin login
  const adminSql = "SELECT * FROM COMPANIES_REGISTRATIONS WHERE EMAIL = ? AND PASSWORD = ?";
  db.query(adminSql, [email, password], (err, adminResult) => {
    if (err) 
      
      
      {
        console.log("error occured",err);
        
        return res.status(500).json({ error: err.message });
      }

    if (adminResult.length > 0) {
      const admin = adminResult[0];
      return res.status(200).json({
        success: true,
        role: 'Admin',
        firstName: admin.FIRST_NAME || '',
        lastName: admin.LAST_NAME || '',
        companyId: admin.COMPANY_ID,
        companyName: admin.COMPANY_NAME,
        result:1
      });
    }

    // If not admin, check Employee login
    const empSql = 
    `SELECT e.*, c.TIMESHEET_CODE
FROM EMPLOYEES_LOGINS e
JOIN COMPANIES_REGISTRATIONS c
  ON e.COMPANY_ID = c.COMPANY_ID
WHERE e.EMAIL = ? AND e.PASSWORD = ?
`;
    db.query(empSql, [email, password], (err, empResult) => {
      if (err) 
        
        
        {
          console.log("emplyee login error",err);
          
          return res.status(500).json({ error: err.message });
        }

      console.log("LOGIN RESULT",empResult);
      
      if (empResult.length > 0) {
        const emp = empResult[0];
        return res.status(200).json({
          success: true,
          role: emp.ROLE,
          empId: emp.EMP_ID,
          empName: emp.EMPNAME,
          companyId: emp.COMPANY_ID,
          timesheetCode:emp.TIMESHEET_CODE
        
        });
      }

      // console.log("result",result);
      
      //  If neither found, invalid credentials
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    });
  });
};

module.exports = {loginApi};
