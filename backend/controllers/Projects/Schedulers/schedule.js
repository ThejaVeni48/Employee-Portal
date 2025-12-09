const db = require('../../../config/db');

const saveSchedule = (req, res) => {
  const {
    proj_id,
    emp_id,
    org_id,
    month_year,
    hours,
    total_hours,
    startDate,
    endDate,
    email
  } = req.body;

  if (!hours || hours.length !== 31) {
    return res.status(400).json({ message: "Hours array must have 31 values" });
  }

  const daysData = {};
  for (let i = 0; i < 31; i++) {
    daysData[`day${i + 1}`] = hours[i] || 0;
  }

  const getAssignIdQuery = `
    SELECT TC_PROJ_ASSIGN_ID 
    FROM TC_PROJECTS_ASSIGNEES
    WHERE EMP_ID = ? AND ORG_ID = ?
  `;

  db.query(getAssignIdQuery, [emp_id, org_id], (error, result) => {
    if (error) {
      console.log("Assign id error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Assign ID not found" });
    }

    const assignId = result[0].TC_PROJ_ASSIGN_ID;

    // Check if schedule exists
    const checkExistsQuery = `
      SELECT schedule_id 
      FROM proj_schedule
      WHERE assign_id = ? AND month_year = ?
    `;

    db.query(checkExistsQuery, [assignId, month_year], (existsErr, existsResult) => {
      if (existsErr) {
        console.error("Check schedule error:", existsErr);
        return res.status(500).json({ message: "Database error" });
      }

      if (existsResult.length > 0) {
        return res.status(409).json({
          message: "Schedule already exists for this employee and month",
        });
      }

      // INSERT query
      const sql = `
        INSERT INTO proj_schedule (
          proj_id, assign_id, org_id, month_year, start_date, end_date,
          ${Object.keys(daysData).join(", ")},
          total_hours, created_by
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ${Object.keys(daysData).map(() => "?").join(", ")},
          ?, ?
        )
      `;

      const values = [
        proj_id,
        assignId,
        org_id,
        month_year,
        startDate,
        endDate,
        ...Object.values(daysData),
        total_hours,
        email
      ];

      db.query(sql, values, (err, saveResult) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ message: "Error saving schedule" });
        }

        res.json({ message: "Schedule saved successfully", result: saveResult });
      });
    });
  });
};

module.exports = { saveSchedule };
