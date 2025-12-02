const db = require("../../config/db");

const getSavedTimeSheetEntries = (req, res) => {
  const { empId, companyId, weekId } = req.query;

  const submittedSQL = `
    SELECT *
    FROM TC_TIMESHEET
    WHERE EMP_ID = ?
      AND ORG_ID = ?
      AND TC_MASTER_ID = ?
      AND STATUS = 'SU'
  `;

  const savedSQL = `
    SELECT *
    FROM TC_TIMESHEET
    WHERE EMP_ID = ?
      AND ORG_ID = ?
      AND TC_MASTER_ID = ?
      AND STATUS = 'S'
  `;

  db.query(submittedSQL, [empId, companyId, weekId], (err, submittedRows) => {
    if (err) return res.status(500).json({ error: err });

    if (submittedRows.length > 0) {
      return res.json({ status: "SU", data: submittedRows });
    }

    db.query(savedSQL, [empId, companyId, weekId], (err, savedRows) => {
      if (err) return res.status(500).json({ error: err });

      if (savedRows.length > 0) {
        return res.json({ status: "S", data: savedRows });
      }

      return res.json({ status: "NONE", data: [] });
    });
  });
};


module.exports = { getSavedTimeSheetEntries };
