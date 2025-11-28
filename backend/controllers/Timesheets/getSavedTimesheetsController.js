const db = require("../../config/db");

const getSavedTimeSheetEntries = (req, res) => {
  const { empId, companyId, weekId } = req.query;

  const sql = `
    SELECT 
      TT.PROJ_ID,
      TT.TASK_ID,
      TT.DAY1,
      TT.DAY2,
      TT.DAY3,
      TT.DAY4,
      TT.DAY5,
      TT.DAY6,
      TT.DAY7
    FROM TC_TIMESHEET TT
    WHERE TT.EMP_ID = ? 
      AND TT.ORG_ID = ? 
      AND TT.TC_MASTER_ID = ?;
  `;

  db.query(sql, [empId, companyId, weekId], (err, results) => {
    if (err) {
      console.log("Error fetching saved timesheet:", err);
      return res.status(500).json({ error: "Database error" });
    }

    console.log("Saved Timesheet:", results);

    // Just return raw DB results
    return res.json({ data: results });
  });
};

module.exports = { getSavedTimeSheetEntries };
