
const db = require('../config/db');

//this api is not in use // need to check whether in use or not
const getSavedTimeSheetEntries= (req,res)=>{
    const {timeSheetId,companyId} = req.query;
    

    if(!timeSheetId)
    {
        return res.status(400).json({data:'No timesheetid found'})
    }

    const sql = 
    ` SELECT TEMP.ENTRY_DATE, TEMP.DAILY_HOURS, TEMP.PROJECT_TYPE, TEMP.BILLABLE_TYPE,TEMP.TASK
FROM TEMP_TIMESHEET_ENTRIES TEMP
JOIN
TIMESHEETS T
ON  
TEMP.TIMESHEET_ID = T.TIMESHEET_ID
WHERE TEMP.TIMESHEET_ID = ? AND TEMP.COMPANY_ID =? ;`

db.query(sql,[timeSheetId,companyId],(err,result)=>{
    if(err)
    {
        console.log("error occured",err);
        return res.status(500).json({error:'Error occured'})
    }
    if(result.length === 0 || !result )
    {
        
        return res.status(400).json({error:"Timesheetid error"})
    }
    // console.log("result for saved timesgeets",result);
    return res.status(200).json({data:result,message:"Data fetched successfully"})
})


}


module.exports = {getSavedTimeSheetEntries};