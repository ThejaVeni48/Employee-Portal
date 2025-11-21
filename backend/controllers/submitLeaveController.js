
const db = require('../config/db');

// API for submitting leaves
const submitLeave = (req, res) => {
  const { empId, companyId, selectedLeaveType, startDate, endDate, daysLeave, reason,pStatus } = req.body;

  console.log("Leave Request:", req.body);

  // Check overlapping leaves
  const leaveRecord = `
    SELECT * FROM LEAVES_REQUESTS 
    WHERE EMP_ID = ? 
    AND COMPANY_ID = ? 
    AND (
      (START_DATE <= ? AND END_DATE >= ?) OR
      (START_DATE <= ? AND END_DATE >= ?)
    )`;

  db.query(leaveRecord, [empId, companyId, startDate, startDate, endDate, endDate], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("DB Error:", checkErr);
      return res.status(500).json({ error: "Database error", details: checkErr });
    }

    if (checkResult.length > 0) {
      console.log("Leave already exists for these days");
      return res.status(409).json({ message: "Leave already applied for this date range" });
    }

    const insertSql = `
      INSERT INTO LEAVES_REQUESTS
      (EMP_ID, COMPANY_ID, LEAVE_ID, START_DATE, END_DATE, DAYS, REASON, STATUS,PROJECT_CONTEXT)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?);`;

    db.query(insertSql, [empId, companyId, selectedLeaveType, startDate, endDate, daysLeave, reason, 'Pending',pStatus], (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ error: "Failed to submit leave", details: err });
      }

      console.log("Leave submitted:", result);
      return res.status(200).json({ message: 'Leave submitted successfully' });
    });
  });
};

module.exports = {submitLeave};
