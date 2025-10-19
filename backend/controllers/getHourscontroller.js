
const db = require('../config/db');


const getHours =(req,res)=>{
    const {startDay,EmpId} = req.query;

     console.log("startDay",startDay);
     console.log("EmpId",EmpId);
     

    const sql =`
     SELECT TIMESHEET_ID FROM TIMESHEETS WHERE EMP_ID =? AND WEEK_START=?
    `;

    db.query(sql,[EmpId,startDay],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }
        if(result.length ===0)
        {
            return res.status(200).json({data:result})
        }
        else{
            
            const getRecords = `
            SELECT T.TOTAL_HOURS,TE.DAILY_HOURS
            FROM TIMESHEETS T
            JOIN TEMP_TIMESHEET_ENTRIES TE
            ON T.TIMESHEET_ID = TE.TIMESHEET_ID
            WHERE T.EMP_ID = ? AND T.WEEK_START = ?
            `
            db.query(getRecords,[EmpId,startDay],(err1,recordResult)=>{
                if(err1)
                {
                    console.log("error1 occured",err1);
                    return res.status(500).json({data:err1})
                    
                }
                // console.log("record,result",recordResult);
                return res.status(200).json({data:recordResult})
            })
            
        }
    })
}



module.exports = {getHours};