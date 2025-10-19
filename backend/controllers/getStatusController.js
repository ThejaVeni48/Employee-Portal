
const db = require('../config/db');


const getStatus =(req, res) => {
  const { start_date,companyId,empId} = req.body;

 console.log("startDate",start_date);
 console.log("compnayId",companyId);
 console.log("empId",empId);
 
  if (!start_date || !Array.isArray(start_date) || start_date.length === 0 || !empId) {
         console.log("error occured");

    return res.status(400).json({ error: "Missing or invalid data" });
     
  }

  const placeholders = start_date.map(() => '?').join(',');

  const sql = `SELECT * FROM TIMESHEETS WHERE WEEK_START IN (${placeholders})  AND COMPANY_ID = ? AND EMP_ID=?`;

  const params = [...start_date,companyId,empId];

  

  db.query(sql, params, (err, result) => {
    if (err) 
      {
        console.log("error1",err);
        return res.status(500).json({ error: err });
        
      }

// console.log("get statsus",result);
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
    } else {
      return res.status(200).json({
        response: 0,
        message: 'no records found',
      });
    }
  });
};


module.exports = {getStatus};
