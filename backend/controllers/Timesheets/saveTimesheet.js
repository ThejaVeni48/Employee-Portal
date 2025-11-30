const db = require('../../config/db');


const saveTimesheet = (req, res) => {
  const { empId, orgId, weekId, totalHours, status, entries,currentApprover,finalApprover } = req.body;



  console.log("empid",empId);
  console.log("orgId",orgId);
  console.log("weekId",weekId);
  console.log("totalHours",totalHours);
  console.log("status",status);
  console.log("entries",entries);
  console.log("currentApprover",currentApprover);
  console.log("finalApprover",finalApprover);
  

  if (!empId || !orgId || !weekId) {
    return res.status(400).json({ error: "empId, orgId, weekId required" });
  }

  const checkSql = `
      SELECT COUNT(*) AS count
      FROM TC_TIMESHEET
      WHERE EMP_ID=? AND TC_MASTER_ID=?`;

  db.query(checkSql, [empId, weekId], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result[0].count > 0) {
      return res.status(409).json({
        response: 0,
        message: "Timesheet for this week already exists",
      });
    }

    const insertSql = `
      INSERT INTO TC_TIMESHEET 
      (TC_MASTER_ID, ORG_ID, EMP_ID, PROJ_ID, TASK_ID,
       DAY1, DAY2, DAY3, DAY4, DAY5, DAY6, DAY7,
       TOTAL_HOURS, STATUS,CURRENT_APPROVER,FINAL_APPROVER, CREATED_BY, CREATION_DATE)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`;

    let completed = 0;
    let hasError = false;

    entries.forEach((entry) => {
      const hours = entry.hoursByDate.map((h) => h.hours);

      const values = [
        weekId,
        orgId,
        empId,
        entry.projectId,
        entry.taskId,
        hours[0] || 0,
        hours[1] || 0,
        hours[2] || 0,
        hours[3] || 0,
        hours[4] || 0,
        hours[5] || 0,
        hours[6] || 0,
        totalHours,
        status,
        currentApprover,
        finalApprover,
        empId,
      ];

      db.query(insertSql, values, (error) => {
        if (error && !hasError) {
          hasError = true;
          console.log("ERROR FOR SAVING TIMESHEET",error);
          
          return res.status(500).json({ error });
        }

        completed++;
        if (completed === entries.length && !hasError) {
          return res.status(201).json({
            response: 1,
            message: "Timesheet saved successfully",
          });
        }
      });
    });
  });
};

module.exports = { saveTimesheet };

