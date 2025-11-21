
const db = require("../../config/db"); // your MySQL config
const { Parser } = require("json2csv");
const moment = require("moment");

const weeklyTimesheetCSV =(req, res) => {
  const { companyId, projectId, status, date } = req.query;

  if (!companyId || !projectId || !date) {
    return res.status(400).json({ error: "companyId, projectId, and date are required" });
  }

  // Calculate week start (Monday) and week end (Sunday)
  const selectedDate = moment(date, "YYYY-MM-DD");
  const weekStart = selectedDate.clone().startOf("isoWeek").format("YYYY-MM-DD"); // Monday
  const weekEnd = selectedDate.clone().endOf("isoWeek").format("YYYY-MM-DD"); // Sunday

  // Build SQL query
  let sqlQuery = `
    SELECT 
      E.DISPLAY_NAME,
      E.EMP_ID,
      TE.PROJECT_ID,
      T.WEEK_START,
      SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Monday' THEN TE.DAILY_HOURS ELSE 0 END) AS Monday,
      SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Tuesday' THEN TE.DAILY_HOURS ELSE 0 END) AS Tuesday,
      SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Wednesday' THEN TE.DAILY_HOURS ELSE 0 END) AS Wednesday,
      SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Thursday' THEN TE.DAILY_HOURS ELSE 0 END) AS Thursday,
      SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Friday' THEN TE.DAILY_HOURS ELSE 0 END) AS Friday,
      SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Saturday' THEN TE.DAILY_HOURS ELSE 0 END) AS Saturday,
      SUM(CASE WHEN DAYNAME(TE.ENTRY_DATE) = 'Sunday' THEN TE.DAILY_HOURS ELSE 0 END) AS Sunday,
      SUM(TE.DAILY_HOURS) AS TOTAL_HOURS,
      T.STATUS,
      T.REMARKS
    FROM TIMESHEETS T
    JOIN TIMESHEET_ENTRIES TE ON T.TIMESHEET_ID = TE.TIMESHEET_ID
    JOIN EMPLOYEES_DETAILS E ON T.EMP_ID = E.EMP_ID
    WHERE 
      T.COMPANY_ID = ? 
      AND TE.PROJECT_ID = ?
      AND TE.ENTRY_DATE BETWEEN ? AND ?
  `;

  const params = [companyId, projectId, weekStart, weekEnd];

  // Filter by status if provided
  if (status && status !== "All") {
    sqlQuery += " AND T.STATUS = ? ";
    params.push(status);
  }

  sqlQuery += `
    GROUP BY E.DISPLAY_NAME, TE.PROJECT_ID, T.WEEK_START, T.REMARKS, E.EMP_ID
    ORDER BY E.DISPLAY_NAME
  `;

  db.query(sqlQuery, params, (err, results) => {
    if (err) {
      console.error("Error fetching timesheets:", err);
      return res.status(500).json({ error: err });
    }

    if (!results.length) {
      return res.status(404).json({ error: "No timesheets found for this week" });
    }

    try {
      // Convert JSON to CSV
      const fields = [
        "DISPLAY_NAME",
        "EMP_ID",
        "PROJECT_ID",
        "WEEK_START",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "TOTAL_HOURS",
        "STATUS",
        "REMARKS",
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(results);

      // Set headers for download
      res.header("Content-Type", "text/csv");
      res.attachment(`Timesheet_${weekStart}_to_${weekEnd}.csv`);
      return res.send(csv);
    } catch (err) {
      console.error("Error generating CSV:", err);
      return res.status(500).json({ error: "Error generating CSV" });
    }
  });
};

module.exports = {weeklyTimesheetCSV};
