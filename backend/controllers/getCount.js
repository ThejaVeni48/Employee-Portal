const db = require('../config/db');

const getCount = (req, res) => {
  const { orgId } = req.query;

  const getEmpCount = `SELECT COUNT(EMP_ID) AS empCount FROM TC_USERS WHERE ORG_ID = ?`;
 
  // const getProjectCount = `SELECT COUNT(PROJECT_ID) AS projectCount FROM PROJECTS WHERE COMPANY_ID = ?`;


  db.query(getEmpCount, [orgId], (empCountError, empCountResult) => {
    if (empCountError) {
      console.log("empCountError", empCountError);
      return res.status(500).json({ error: empCountError });
    }

   

      // db.query(getProjectCount,[companyId],(pErrorCount,pResultCount)=>{
      //   if(pErrorCount)
      //   {
      //        console.log("pErrorCount", pErrorCount);
      //   return res.status(500).json({ error: pErrorCount });
      // }
        
        
      
     

      return res.status(200).json({
        employeeCount: empCountResult[0].empCount,
        // projectCount: pResultCount[0].projectCount,
      });
      // });

    
  });
};

module.exports = { getCount };
