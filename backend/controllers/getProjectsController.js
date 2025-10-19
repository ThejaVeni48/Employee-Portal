const db = require('../config/db');

const getProjects = (req,res)=>{


    const {empId,companyId,startDate,lastDate} = req.query;


    const sql = `
SELECT P.PROJECT_NAME, P.PROJECT_NO,
    PE.EMP_ID
    FROM PROJECTS P
    JOIN PROJECTS_EMPLOYEE PE
    ON P.PROJECT_NO = PE.PROJECT_NO
    AND P.COMPANY_ID = PE.COMPANY_ID
    WHERE PE.EMP_ID = ?
    AND PE.COMPANY_ID = ?
   AND (
    P.START_DATE <= ?  
    AND P.END_DATE >= ? 
  )`;

    db.query(sql,[empId,companyId,startDate,lastDate],(error,result)=>{
        if(error)
        {
            console.log("error for timesheet", error);
            return res.status(500).json({data:error})
            
        }
        console.log("result for timesheet project",result);
        return res.status(200).json({data:result})
        
    })



}



module.exports = {getProjects}