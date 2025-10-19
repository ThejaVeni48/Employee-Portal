
const db = require('../config/db');

// THIS API FOR MANAGER

// THIS API IS USED FOR GETTING THE OVERALL SUBMITTED TIMESHEETS  

const getSubmittedTimesheets =  (req, res) => {
    const {date,companyId} = req.query;
    // console.log("date getsubmiteed",date);
    console.log("companyId getsubmiteed",companyId);
    
    if(!date)
    {

    


//   const sql = `
//     SELECT 
//       R.FIRSTNAME,
//       R.LASTNAME,
//       T.EMP_ID,
//       T.WEEK_START,
//       T.TOTAL_HOURS,
//        T.TIMESHEET_ID
//     FROM REGISTRATIONS R
//     INNER JOIN TIMESHEETS T
//       ON T.EMP_ID = R.EMP_ID
//           INNER JOIN COMPANIES C
//       ON R.COMPANY_ID = C.COMPANY_ID
//       where STATUS = 'submitted' AND R.COMPANY_ID =(
// SELECT COMPANY_ID FROM 
// REGISTRATIONS WHERE EMP_ID = ?);

const sql =`SELECT E.FIRST_NAME,E.LAST_NAME, T.WEEK_START,T.TOTAL_HOURS,E.EMP_ID,T.TIMESHEET_ID
 FROM EMPLOYEES_DETAILS E
 JOIN TIMESHEETS T
 ON E.EMP_ID = T.EMP_ID
 AND E.COMPANY_ID = T.COMPANY_ID
 WHERE T.COMPANY_ID =? AND STATUS = 'Submitted'` ;

  db.query(sql, [companyId], (err, result) => {
    if (err) {
      console.error("Error occurred1:", err);
      return res.status(500).json({ error: "eror occured" });
    }
console.log("result for submitted timesheet without date",result);
    return res.json(result);
  });
}

else{
    const sql = `
     SELECT E.FIRST_NAME,E.LAST_NAME, T.WEEK_START,T.TOTAL_HOURS,E.EMP_ID,T.TIMESHEET_ID
 FROM EMPLOYEES_DETAILS E
 JOIN TIMESHEETS T
 ON E.EMP_ID = T.EMP_ID
 AND E.COMPANY_ID = T.COMPANY_ID
 WHERE T.COMPANY_ID = ? AND  WEEK_START = ? AND STATUS = 'Submitted'`;
//     SELECT 
//       R.FIRSTNAME,
//       R.LASTNAME,
//       T.EMP_ID,
//       T.WEEK_START,
//       T.TOTAL_HOURS,
//        T.TIMESHEET_ID
//     FROM REGISTRATIONS R
//     INNER JOIN TIMESHEETS T
//       ON T.EMP_ID = R.EMP_ID
//           INNER JOIN COMPANIES C
//       ON R.COMPANY_ID = C.COMPANY_ID
//       where T.WEEK_START = ? AND R.COMPANY_ID =(
// SELECT COMPANY_ID FROM 
// REGISTRATIONS WHERE EMP_ID = ?)
    
  

  db.query(sql, [companyId,date], (err, result) => {
    if (err) {
      console.error("Error occurred2:", err);
      return res.status(500).json({ error: "eror occured" });
    }
console.log("result for getSubmitted timesheets date",result);
    return res.json(result);
  });
}
};

module.exports = {getSubmittedTimesheets};
