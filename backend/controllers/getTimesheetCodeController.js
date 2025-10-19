
const db = require('../config/db');


// this api is used for getting the timesheetcode


const getTimeSheetCode =(req,res)=>{
    const {companyId,empId} = req.query;

    console.log("companyid",companyId);
    console.log("empId",empId);
    


    const sql =
    `SELECT C.TIMESHEET_CODE
     FROM COMPANIES C
     JOIN REGISTRATIONS R
     ON C.COMPANY_ID = R.COMPANY_ID
     WHERE R.EMP_ID = ? AND R.COMPANY_ID = ?
    
    `;
    db.query(sql,[empId,companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured for getting timesheetCode",error);
            // return res.status(500).json({data:error})
        }
        console.log("result for getting timesheetCode",result);
        return res.status(200).json({data:result})
    })

}



module.exports = {getTimeSheetCode};