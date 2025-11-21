
const db = require('../../config/db');


const getTimesheetId =(req, res) => {
  const { start_date,companyId,empId} = req.body;


  

//  console.log("startDate ",start_date);
//  console.log("compnayId",companyId);
//  console.log("empId",empId);
 
  if (!start_date  || !empId) {

    return res.status(400).json({ error: "Missing or invalid data" });
     
  }

  const sql = `SELECT * FROM TIMESHEETS WHERE WEEK_START = ? AND COMPANY_ID = ? AND EMP_ID=?`;

   db.query(sql,[start_date,companyId,empId],(error,result)=>{
    if(error)
    {
        // console.log("error occured",error);
        

    }
    // console.log("result for timesheetId",result);
    // return res.status(200).json({data:result})
    
     if (result.length > 0) {
      // console.log("result for status",result);
      
      const existing = result.map(row => { 
  return {
    date: row.WEEK_START,
    timesheetId: row.TIMESHEET_ID,
    totalHours: row.TOTAL_HOURS,
    status:row.STATUS,
    remarks:row.REMARKS,  
    companyId:row.COMPANY_ID,
   empId:row.EMP_ID,
    TimesheetCode:row.TIMESHEET_CODE,

  };
});

      return res.status(200).json({
        response: 3,
        message: 'some records found',
        data: existing,
      });
    } 
    else {
      // console.log("not present");
      
      return res.status(200).json({
        response: 0,
        message: 'no records found',
      });
    }
   })
};


module.exports = {getTimesheetId};
