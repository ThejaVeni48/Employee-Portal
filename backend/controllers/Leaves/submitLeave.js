const db = require('../../config/db');

// API for submitting leaves
const submitLeave = (req, res) => {
  const { empId, companyId, selectedLeaveType, fromDate, toDate, daysLeave, reason, projectId } = req.body;

  console.log("fromDate", fromDate);
  console.log("fromDate type", typeof (fromDate));

  // Step 1: Check available leaves before proceeding
  const leaveBalanceSql = `
    SELECT AVAILABLE_LEAVES 
    FROM EMPLOYEE_ALLOCATION 
    WHERE EMP_ID = ? AND COMPANY_ID = ? AND LEAVE_ID = ?;
  `;

  db.query(leaveBalanceSql, [empId, companyId, selectedLeaveType], (balanceErr, balanceResult) => {
    if (balanceErr) {
      console.error("Leave balance fetch error:", balanceErr);
      return res.status(500).json({ error: "Failed to fetch leave balance", details: balanceErr });
    }

    // If no record found, block submission
    if (balanceResult.length === 0) {
      return res.status(400).json({ message: "Leave balance record not found for this employee or leave type." });
    }

    const availableLeaves = balanceResult[0].AVAILABLE_LEAVES || 0;

    // Step 2: Check if requested exceeds available
    if (parseFloat(daysLeave) > parseFloat(availableLeaves)) {
      return res.status(400).json({ message: `You only have ${availableLeaves} leave(s) available. Please adjust your request.` });
    }

    // Step 3: Proceed to check overlapping leaves
    const leaveRecord = `
      SELECT * FROM LEAVES_REQUESTS 
      WHERE EMP_ID = ? 
      AND COMPANY_ID = ? 
      AND (
        (START_DATE <= ? AND END_DATE >= ?) OR
        (START_DATE <= ? AND END_DATE >= ?)
      )`;

    db.query(leaveRecord, [empId, companyId, fromDate, fromDate, toDate, toDate], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("DB Error:", checkErr);
        return res.status(500).json({ error: "Database error", details: checkErr });
      }

      if (checkResult.length > 0) {
        console.log("Leave already exists for these days");
        return res.status(409).json({ message: "Leave already applied for this date range", result: 5 });
      }

      // Step 4: Insert leave request
      const insertSql = `
        INSERT INTO LEAVES_REQUESTS
        (EMP_ID, COMPANY_ID, LEAVE_ID, START_DATE, END_DATE, DAYS, REASON, STATUS, PROJECT_ID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

      db.query(insertSql, [empId, companyId, selectedLeaveType, fromDate, toDate, daysLeave, reason, 'Pending', projectId], (err, result) => {
        if (err) {
          console.error("Insert Error:", err);
          return res.status(500).json({ error: "Failed to submit leave", details: err });
        }

        console.log("Leave submitted:", result);
        return res.status(200).json({ message: 'Leave submitted successfully' });
      });
    });
  });
};

module.exports = { submitLeave };
