const db = require('../../config/db');

const getSavedTimeSheetEntries = (req, res) => {
  const { timeSheetId, companyId, startDate, endDate } = req.query;

  console.log("startDate for saved timesheet:", startDate);
  console.log("endDate for saved timesheet:", endDate);

  if (!companyId) {
    return res.status(400).json({ data: 'companyId is required' });
  }

  // ✅ Build dynamic query
  let sql = `
    SELECT 
      TEMP.ENTRY_DATE, 
      TEMP.DAILY_HOURS, 
      TEMP.PROJECT_ID, 
      TEMP.BILLABLE_TYPE, 
      TEMP.TASK,
      TEMP.EMP_ID,
      T.TIMESHEET_ID,
      T.STATUS,
      T.WEEK_START
    FROM TEMP_TIMESHEET_ENTRIES TEMP
    JOIN TIMESHEETS T
      ON TEMP.TIMESHEET_ID = T.TIMESHEET_ID
    WHERE TEMP.COMPANY_ID = ?
      AND TEMP.ENTRY_DATE BETWEEN ? AND ?
  `;

  const params = [companyId, startDate, endDate];

  // ✅ Optional filter by timeSheetId (only if provided)
  if (timeSheetId) {
    sql += ` AND TEMP.TIMESHEET_ID = ?`;
    params.push(timeSheetId);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error occurred while fetching saved timesheets:", err);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    if (!result || result.length === 0) {
      return res.status(200).json({ data: [], message: "No saved timesheets found for the given range" });
    }

    return res.status(200).json({ data: result, message: "Saved timesheets fetched successfully" });
  });
};

module.exports = { getSavedTimeSheetEntries };
