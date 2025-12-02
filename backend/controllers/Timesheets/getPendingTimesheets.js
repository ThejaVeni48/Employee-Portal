// this api is used for the timesheet approval based on the projects

const db = require('../../config/db');




const getPendingTimesheets = (req,res)=>{



 const {orgId,empId} = req.query;



 const sql = ` SELECT 
    M.WEEK_START,
    CONCAT(M.WEEK_START, ' - ', M.WEEK_END) AS WEEK,
    COUNT(TC_ID) AS SUBMITTED_COUNT,
    M.TC_MASTER_ID
FROM TC_MASTER M
LEFT JOIN TC_TIMESHEET T
    ON M.TC_MASTER_ID = T.TC_MASTER_ID
    AND M.ORG_ID = T.ORG_ID
    AND T.CURRENT_APPROVER = ?
WHERE M.ORG_ID = ?
AND SYSDATE() >= M.WEEK_START
GROUP BY M.WEEK_START, M.WEEK_END, M.TC_MASTER_ID
ORDER BY M.WEEK_START DESC`;

  db.query(sql,[empId,orgId],(error,result)=>{
    if(error)
    {
      console.log("Error occured",error);
      return res.status(500).json({data:error})
      
    }

    // console.log("Result for weeks",result);
   return res.status(200).json({data:result})    
  })



}


module.exports = {getPendingTimesheets}