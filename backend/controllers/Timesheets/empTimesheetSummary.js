// this api is used for showing the individuals timesheet summary


const db  = require('../../config/db');


const empTimesheetSummary = (req,res)=>{


     const {orgId,empId} = req.query;

   //   console.log("orgId",orgId);
   //   console.log("empId",empId);
     


     const sql = 
     `SELECT 
     M.WEEK_START,
    TS.TC_MASTER_ID AS WEEK_ID,
    CONCAT (M.WEEK_START, '-' , M.WEEK_END) AS WEEK,
    COALESCE(TS.STATUS, 'P') AS STATUS,
    COALESCE(TS.TOTAL_HOURS, 0) AS TOTAL_HOURS,
    COALESCE(TS.APPROVER_ID, '-') AS APPROVER_ID,
    COALESCE(TS.REMARKS, '-') AS REMARKS,
    COALESCE(TS.PROJ_ID, '-') AS PROJ_ID
FROM TC_MASTER M
LEFT JOIN TC_TIMESHEET TS
    ON M.TC_MASTER_ID = TS.TC_MASTER_ID
    AND M.ORG_ID = TS.ORG_ID
    AND TS.EMP_ID = ?
WHERE M.ORG_ID = ?
ORDER BY M.WEEK_START DESC`;

   db.query(sql,[empId,orgId],(error,result)=>{
     if(error)
     {
        console.log("Error occured",error);
        return res.status(500).json({data:error})
        
     }
      //  console.log("result occured FOR EMPTIMESHEET ",result);
        return res.status(200).json({data:result})
   })






}

module.exports = {empTimesheetSummary}