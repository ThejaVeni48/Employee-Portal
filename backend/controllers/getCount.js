const db = require('../config/db');

const getCount = (req, res) => {
  const { companyId } = req.query;

  const getEmpCount = `SELECT COUNT(EMP_ID) AS empCount FROM EMPLOYEES_DETAILS WHERE COMPANY_ID = ?`;
  const getDeptCount = `SELECT COUNT(DEPT_ID) AS deptCount FROM DEPARTMENTS WHERE COMPANY_ID = ?`;
  const getProjectCount = `SELECT COUNT(PROJECT_ID) AS projectCount FROM PROJECTS WHERE COMPANY_ID = ?`;
  const getProjectEmp =`SELECT COUNT(E.EMP_ID) AS projectEmp
FROM EMPLOYEES_DETAILS E
JOIN PROJECTS_ASSIGNMENTS PA
ON E.EMP_ID = PA.EMP_ID
AND E.COMPANY_ID = PA.COMPANY_ID
WHERE E.COMPANY_ID  = ?`;

  db.query(getEmpCount, [companyId], (empCountError, empCountResult) => {
    if (empCountError) {
      console.log("empCountError", empCountError);
      return res.status(500).json({ error: empCountError });
    }

    db.query(getDeptCount, [companyId], (deptCountError, deptCountResult) => {
      if (deptCountError) {
        console.log("deptCountError", deptCountError);
        return res.status(500).json({ error: deptCountError });
      }

      db.query(getProjectCount,[companyId],(pErrorCount,pResultCount)=>{
        if(pErrorCount)
        {
             console.log("pErrorCount", pErrorCount);
        return res.status(500).json({ error: pErrorCount });
      }
         db.query(getProjectEmp,[companyId],(pEmpErrorCount,pEmpResultCount)=>{
        if(pEmpErrorCount)
        {
             console.log("pEmpErrorCount", pEmpErrorCount);
        return res.status(500).json({ error: pEmpErrorCount });
      }
        
      
     

      return res.status(200).json({
        employeeCount: empCountResult[0].empCount,
        departmentCount: deptCountResult[0].deptCount,
        projectCount: pResultCount[0].projectCount,
        projectEmpCount: pEmpResultCount[0].projectEmp,
      });
      });

    });
     })
  });
};

module.exports = { getCount };
