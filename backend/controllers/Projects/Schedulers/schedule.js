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

  if (!hours || hours.length > 31) {
    return res.status(400).json({
      message: "Schedule must be saved month-wise (max 31 days)"
    });
  }

 /* ---------- PREPARE DAY DATA ---------- */
const daysData = {};
for (let i = 0; i < hours.length; i++) {
  daysData[`day${i + 1}`] = parseInt(hours[i]) || 0;
}


  /* ---------- GET ASSIGN ID ---------- */
  const getAssignIdQuery = `
    SELECT TC_PROJ_ASSIGN_ID, CONTRACT_STARTDATE, CONTRACT_ENDDATE
    FROM TC_PROJECTS_ASSIGNEES
    WHERE EMP_ID = ? AND ORG_ID = ?
  `;

  db.query(getAssignIdQuery, [emp_id, org_id], (err, result) => {
    if (err) return res.status(500).json({ message: err.sqlMessage });
    if (!result.length)
      return res.status(400).json({ message: "Assign ID not found" });

    const assignId = result[0].TC_PROJ_ASSIGN_ID;
    const contractStart = new Date(result[0].CONTRACT_STARTDATE);
    const contractEnd = new Date(result[0].CONTRACT_ENDDATE);

    /* ---------- CONTRACT VALIDATION ---------- */
    if (
      new Date(endDate) < contractStart ||
      new Date(startDate) > contractEnd
    ) {
      return res.status(400).json({
        message: "Schedule outside contract period"
      });
    }

    /* ---------- CHECK EXISTING MONTH ---------- */
    const checkExistsQuery = `
      SELECT schedule_id
      FROM proj_schedule
      WHERE assign_id = ? AND month_year = ?
    `;

    db.query(checkExistsQuery, [assignId, month_year], (err2, exists) => {
      if (err2) return res.status(500).json({ message: err2.sqlMessage });

      /* ===================================================== UPDATE EXISTING SCHEDULEE ===================================================== */
      if (exists.length > 0) {
        const updateSql = `
          UPDATE proj_schedule
          SET
            proj_id = ?,
            org_id = ?,
            start_date = ?,
            end_date = ?,
            ${Object.keys(daysData).map(d => `${d} = ?`).join(", ")},
            total_hours = ?,
            last_updated_by = ?,
            last_update_date = CURDATE()
          WHERE assign_id = ? AND month_year = ?
        `;

        const updateValues = [
          proj_id,
          org_id,
          startDate,
          endDate,
          ...Object.values(daysData),
          total_hours,
          email,
          assignId,
          month_year
        ];

        return db.query(updateSql, updateValues, (uErr) => {
          if (uErr)
            return res.status(500).json({ message: uErr.sqlMessage });

          return res.json({
            message: `Schedule updated for ${month_year}`,
            mode: "UPDATE"
          });
        });
      }

      /* =====================================================INSERT NEW SCHEDULE ===================================================== */
      const insertSql = `
        INSERT INTO proj_schedule (
          proj_id,
          assign_id,
          org_id,
          month_year,
          start_date,
          end_date,
          ${Object.keys(daysData).join(", ")},
          total_hours,
          created_by
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ${Object.keys(daysData).map(() => "?").join(", ")},
          ?, ?
        )
      `;

      const insertValues = [
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

      db.query(insertSql, insertValues, (iErr) => {
        if (iErr)
          return res.status(500).json({ message: iErr.sqlMessage });

        return res.json({
          message: `Schedule saved for ${month_year}`,
          mode: "INSERT"
        });
      });
    });
  });
};

module.exports = { saveSchedule };
