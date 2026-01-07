const db = require('../../config/db');

const saveTimesheet = (req, res) => {
  const { empId, orgId, weekId, totalHours, status, entries, currentApprover, finalApprover,scheduledHours,variance } = req.body;

  if (!empId || !orgId || !weekId || !entries || !Array.isArray(entries)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  // Step 1: Check if timesheet already exists for the week and employee id
  const checkSql = `
    SELECT STATUS, TC_ID 
    FROM TC_TIMESHEET 
    WHERE EMP_ID = ? AND TC_MASTER_ID = ? `;

  db.query(checkSql, [empId, weekId], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const existing = results[0];

    // Case 1: if timesheet is submitted 
    if (existing &&( existing.STATUS === 'SU' || existing.STATUS === 'A') ) {
      return res.status(409).json({
        response: 0,
        message: "Timesheet already submitted. Cannot modify a submitted timesheet."
      });
    }

    // Case 2: f timesheet is saved or pending
    if (existing && (existing.STATUS === 'S' || existing.STATUS === 'P' || existing.STATUS === 'R' || existing.STATUS === 'D')) {
      return updateTimesheet(req, res, weekId, empId, orgId, totalHours, status, entries, currentApprover, finalApprover,scheduledHours,variance);
    }

    // Case 3: if no, insert new timesheet
    return insertTimesheet(req, res, weekId, empId, orgId, totalHours, status, entries, currentApprover, finalApprover,scheduledHours,variance);
  });
};

//  Insert new timesheet entries
const insertTimesheet = (req, res, weekId, empId, orgId, totalHours, status, entries, currentApprover, finalApprover,scheduledHours,variance) => {
  const insertSql = `
    INSERT INTO TC_TIMESHEET 
    (TC_MASTER_ID, ORG_ID, EMP_ID, PROJ_ID, TASK_ID,
     DAY1, DAY2, DAY3, DAY4, DAY5, DAY6, DAY7,
     TOTAL_HOURS, STATUS, CURRENT_APPROVER, FINAL_APPROVER,scheduled,reported, CREATED_BY, CREATION_DATE)
    VALUES ?`;

  const values = entries.map(entry => {
    const hours = entry.hoursByDate.map(h => h.hours || 0);
    return [
      weekId,
      orgId,
      empId,
      entry.projectId,
      entry.taskId || null,
      ...hours,
      totalHours,
      status,
      currentApprover || null,
      finalApprover || null,
      scheduledHours || null,
      variance || null,
      empId,
      new Date()
    ];
  });

  db.query(insertSql, [values], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ error: "Failed to save timesheet" });
    }

    res.status(201).json({
      response: 1,
      message: status === 'SU' ? "Timesheet submitted successfully" : "Timesheet saved successfully"
    });
  });
};

//  Updating existing timesheet (status is s means)
const updateTimesheet = (req, res, weekId, empId, orgId, totalHours, status, entries, currentApprover, finalApprover,scheduledHours,variance) => {


  const deleteSql = `DELETE FROM TC_TIMESHEET WHERE EMP_ID = ? AND TC_MASTER_ID = ?`;

  db.query(deleteSql, [empId, weekId], (err) => {
    if (err) {
      console.error("Delete Error:", err);
      return res.status(500).json({ error: "Failed to update timesheet" });
    }

    insertTimesheet(req, res, weekId, empId, orgId, totalHours, status, entries, currentApprover, finalApprover,scheduledHours,variance);
  });
};

module.exports = { saveTimesheet };