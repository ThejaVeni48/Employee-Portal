
const db = require('../config/db');

//THIS API FOR MANAGER

// THIS API IS USED FOR GETTING THE OVERALL APPROVED TIMESHEETS  
const getApprovedTimesheet = (req, res) => {
    const {date} = req.query;
  console.log("date",date);
    if(!date)
    {

    


  const sql = `
    SELECT 
      R.FIRSTNAME,
      R.LASTNAME,
      T.EMP_ID,
      T.WEEK_START,
      T.TOTAL_HOURS,
       T.TIMESHEET_ID
    FROM REGISTRATIONS R
    INNER JOIN TIMESHEETS T
      ON T.EMP_ID = R.EMP_ID
          INNER JOIN COMPANIES C
      ON R.COMPANY_ID = C.COMPANY_ID
      where STATUS = 'ACCEPTED';
    
  `;

  db.query(sql, [], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ error: "eror occured" });
    }
console.log("result for approved1",result);
    return res.json(result);
  });
}

else{
   const sql = `
    SELECT 
      R.FIRSTNAME,
      R.LASTNAME,
      T.EMP_ID,
      T.WEEK_START,
      T.TOTAL_HOURS,
       T.TIMESHEET_ID
    FROM REGISTRATIONS R
    INNER JOIN TIMESHEETS T
      ON T.EMP_ID = R.EMP_ID
          INNER JOIN COMPANIES C
      ON R.COMPANY_ID = C.COMPANY_ID
      where T.WEEK_START = ?;
    
  `;

  db.query(sql, [date], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ error: "eror occured" });
    }
console.log("result",result);
    return res.json(result);
  });
}
};

module.exports = {getApprovedTimesheet};
