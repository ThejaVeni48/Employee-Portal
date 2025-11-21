
const db = require('../config/db');

//THIS API FOR MANAGER

// THIS API IS USED FOR GETTING THE OVERALL APPROVED TIMESHEETS  
const getApprovedTimesheet = (req, res) => {
    const {date,deptId} = req.query;
  console.log("date",date);
    if(!date)
    {

    


  const sql = `
    SELECT 
     E.FIRST_NAME,E.LAST_NAME,
      T.EMP_ID,
      T.WEEK_START,
      T.TOTAL_HOURS,
       T.TIMESHEET_ID
    FROM EMPLOYEES_DETAILS E
    INNER JOIN TIMESHEETS T
      ON T.EMP_ID = E.EMP_ID
      AND T.COMPANY_ID = E.COMPANY_ID
      where T.STATUS = 'Approved'
       AND E.DEPT_ID = ?;
    
  `;
  db.query(sql, [deptId], (err, result) => {
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
  E.FIRST_NAME,
  E.LAST_NAME,
  T.EMP_ID,
  T.WEEK_START,
  T.TOTAL_HOURS,
  T.TIMESHEET_ID
FROM EMPLOYEES_DETAILS E
INNER JOIN TIMESHEETS T
  ON T.EMP_ID = E.EMP_ID
  AND T.COMPANY_ID = E.COMPANY_ID
WHERE 
  T.STATUS = 'Approved'
  AND T.WEEK_START = ?
  AND E.DEPARTMENT = ?;

    
  `;

  db.query(sql, [date,deptId], (err, result) => {
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
