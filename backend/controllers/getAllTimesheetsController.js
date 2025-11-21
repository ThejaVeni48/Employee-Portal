// this api is used for getting the all timesheets  for the admin





const db= require('../config/db');

const getAllTimesheets = (req,res)=>{


const {companyId} = req.query;


const sql = `SELECT  
    E.EMP_ID,
    E.DISPLAY_NAME,
    E.DEPT_ID,
    T.TIMESHEET_ID,
    T.WEEK_START,
    T.TOTAL_HOURS,
    T.STATUS,
    D.DEPT_NAME,
    T.APPROVED_REJECTED_BY
FROM EMPLOYEES_DETAILS E
JOIN TIMESHEETS T 
    ON E.EMP_ID = T.EMP_ID 
    AND E.COMPANY_ID = T.COMPANY_ID
JOIN DEPARTMENTS D 
    ON D.DEPT_ID = E.DEPT_ID
    AND D.COMPANY_ID = E.COMPANY_ID
WHERE 
    T.COMPANY_ID = ?;
`;

db.query(sql,[companyId],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }
    console.log("result for all timesheets",result);
    return res.status(200).json({data:result})
    
})


}


module.exports = {getAllTimesheets}