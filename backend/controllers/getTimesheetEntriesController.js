
const db = require('../config/db');

// this api is used for getting individual timesheet entries based on the timesheetId
const getTimesheetEntries =(req, res) => {
  const { timesheetId,companyId } = req.query;
  console.log("timesheetid getTimesheetentries",timesheetId);
  console.log("companyId getTimesheetentries",companyId);


  if (!timesheetId) {
    console.log("timesheet is not there")
    return res.status(400).json({ error: "Missing timesheetId in query parameters" });
  }

  const sql = `
    SELECT TE.BILLABLE_TYPE, TE.PROJECT_TYPE, TE.ENTRY_DATE, TE.TASK, TE.DAILY_HOURS,T.TOTAL_HOURS
    FROM TIMESHEETS T
    INNER JOIN TIMESHEET_ENTRIES TE ON T.TIMESHEET_ID = TE.TIMESHEET_ID
    WHERE T.TIMESHEET_ID = ? AND T.COMPANY_ID = ?
  `;

  db.query(sql, [timesheetId,companyId], (err, result) => {
    if (err) {
      console.log("DB Error in getTimesheetentries:", err);
      // return res.status(500).json({ error: "Database error" });
    }
    

    if (!result || result.length === 0) {
      console.log("reult ",result);
      
      return res.status(404).json({ message: "No entries found for this timesheetId" });
    }

    console.log("Result in getTimesheetentries:", result);
    return res.status(200).json({ data: result, message: "Data fetched successfully" });
  });
};

module.exports = {getTimesheetEntries};
