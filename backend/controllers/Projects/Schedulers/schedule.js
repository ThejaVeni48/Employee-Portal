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

  console.log("hours",hours);
  console.log("startDate",startDate);
  console.log("endDate",endDate);
  console.log("hours length",hours.length);
  
  if (!hours || hours.length > 31) {
    return res.status(400).json({
      message: "Schedule must be saved month-wise (max 31 days)"
    });
  }

  const daysData = {};
  for (let i = 0; i < hours.length; i++) {
    daysData[`day${i + 1}`] = hours[i] || 0;
  }

  /* ---------------- STEP 1 :GET ASSIGN ID AND CONTRACT DATE ---------------- */
  const getAssignIdQuery = `
    SELECT TC_PROJ_ASSIGN_ID, CONTRACT_STARTDATE, CONTRACT_ENDDATE
    FROM TC_PROJECTS_ASSIGNEES
    WHERE EMP_ID = ? AND ORG_ID = ?
  `;

  db.query(getAssignIdQuery, [emp_id, org_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!result.length) return res.status(400).json({ message: "Assign ID not found" });

    const assignId = result[0].TC_PROJ_ASSIGN_ID;
    const contractStart = new Date(result[0].CONTRACT_STARTDATE);
    const contractEnd = new Date(result[0].CONTRACT_ENDDATE);

    /* ---------------- STEP 2: CONTRACT VALIDATION ---------------- */
if (new Date(endDate) < new Date(contractStart) || new Date(startDate) > new Date(contractEnd)) {
      console.log("startDate",new Date(startDate));
      console.log("contractStart",new Date(contractStart));
      console.log("endDate",new Date(endDate));
      console.log("contractEnd",new Date(contractEnd));
      
      return res.status(400).json({ message: "Schedule outside contract period" });
    }

    /* ---------------- STEP 3:  DUPLICATE CHECK ---------------- */
    const checkExistsQuery = `
      SELECT schedule_id FROM proj_schedule
      WHERE assign_id = ? AND month_year = ?
    `;
    db.query(checkExistsQuery, [assignId, month_year], (existsErr, existsResult) => {
      if (existsErr) return res.status(500).json({ message: "Database error" });
      if (existsResult.length)
        return res.status(409).json({ message: "Schedule already exists for this month" });

      /* ----------------STEP 4: INSERT ---------------- */
      const sql = `
        INSERT INTO proj_schedule (
          proj_id, assign_id, org_id, month_year, start_date, end_date,
          ${Object.keys(daysData).join(", ")}, total_hours, created_by
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ${Object.keys(daysData).map(() => "?").join(", ")}, ?, ?
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

      db.query(sql, values, (insertErr) => {
        if (insertErr) return res.status(500).json({ message: "Error saving schedule" });
        res.json({ message: `Schedule saved for ${month_year}` });
      });
    });
  });
};

module.exports = { saveSchedule };
