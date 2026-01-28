
// api for getting scheduled hours

const db = require("../../../config/db");

const getScheduleHours = (req, res) => {
  const { projId, orgId } = req.query;

  console.log("PROJID IN GETSCHEDULEDHOURS", projId);
  console.log("ORGID IN GETSCHEDULEDHOURS", orgId);

  // Validation (safe, non-breaking)
  if (!projId || !orgId) {
    return res.status(400).json({
      message: "projId and orgId are required",
    });
  }

  const sql = `
    SELECT 
      U.DISPLAY_NAME,
      U.EMP_ID,
      PS.month_year,
      PS.start_date,
      PS.end_date,
      PS.total_hours
    FROM TC_USERS U
    JOIN TC_PROJECTS_ASSIGNEES PA
      ON U.EMP_ID = PA.EMP_ID
      AND U.ORG_ID = PA.ORG_ID
    JOIN PROJ_SCHEDULE PS
      ON PA.TC_PROJ_ASSIGN_ID = PS.ASSIGN_ID
      AND PA.ORG_ID = PS.ORG_ID
    WHERE PA.PROJ_ID = ?
      AND PA.ORG_ID = ?
    ORDER BY PS.month_year DESC
  `;

  db.query(sql, [projId, orgId], (error, result) => {
    if (error) {
      console.error("Error occurred in getScheduleHours", error);
      return res.status(500).json({
        message: "Internal server error",
        data: error,
      });
    }

    console.log("Result for getScheduledHours", result);

    return res.status(200).json({
      data: result || [],
    });
  });
};

module.exports = { getScheduleHours };
