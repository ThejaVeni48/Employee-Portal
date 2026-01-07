const db = require("../../config/db");

const TimesheetCustomization = (req, res) => {
  const { orgId, selectedDay, email } = req.body;

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  /* -------------------------------
     STEP 1: Generate week days (names)
  -------------------------------- */
  const generatedDays = [];
  for (let i = 0; i < 7; i++) {
    generatedDays.push(weekDays[(selectedDay + i) % 7]);
  }

  const startDay = generatedDays[0];
  const endDay = generatedDays[6];
  const duration = 7;
  const status = "A";

  /* -------------------------------
     STEP 2: Check org settings
  -------------------------------- */
  const checkOrgSql = `
    SELECT 1 FROM TC_ORG_SETTINGS WHERE ORG_ID = ?
  `;

  db.query(checkOrgSql, [orgId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Settings already exist" });
    }

    /* -------------------------------
       STEP 3: Insert org settings
    -------------------------------- */
    const insertOrgSql = `
      INSERT INTO TC_ORG_SETTINGS
      (ORG_ID, START_DAY, END_DAY, STATUS, DURATION, CREATED_BY)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertOrgSql,
      [orgId, startDay, endDay, status, duration, email],
      (orgErr) => {
        if (orgErr) {
          console.error(orgErr);
          return res.status(500).json({ message: "Insert failed" });
        }

        /* -------------------------------
           STEP 4: Calculate week start DATE
        -------------------------------- */
        const today = new Date();
        const todayDay = today.getDay(); // 0–6
        const diff = selectedDay - todayDay;
        const weekStartDate = new Date(today);
        weekStartDate.setDate(today.getDate() + diff);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStartDate);
          d.setDate(weekStartDate.getDate() + i);
          weekDates.push(d.toISOString().split("T")[0]);
        }

        const weekStart = weekDates[0];
        const weekEnd = weekDates[6];

        /* -------------------------------
           STEP 5: Insert TC_MASTER
        -------------------------------- */
        const insertMasterSql = `
          INSERT INTO TC_MASTER (ORG_ID, WEEK_START, WEEK_END, CREATED_BY)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          insertMasterSql,
          [orgId, weekStart, weekEnd, email],
          (masterErr, masterRes) => {
            if (masterErr) {
              console.error(masterErr);
              return res.status(500).json({ message: "Master insert failed" });
            }

            const masterId = masterRes.insertId;

            /* -------------------------------
               STEP 6: Fetch active employees
            -------------------------------- */
            const empSql = `
              SELECT EMP_ID FROM TC_USERS
              WHERE ORG_ID = ? AND STATUS = 'A'
            `;

            db.query(empSql, [orgId], (empErr, empRes) => {
              if (empErr) {
                console.error(empErr);
                return res.status(500).json({ message: "Employee fetch failed" });
              }

              if (!empRes.length) {
                return res.status(200).json({ message: "No active employees" });
              }

              const timesheetData = empRes.map(emp => [
                masterId,
                orgId,
                emp.EMP_ID,
                "D",
                "system"
              ]);

              /* -------------------------------
                 STEP 7: Insert TC_TIMESHEET
              -------------------------------- */
              const insertTimesheetSql = `
                INSERT INTO TC_TIMESHEET
                (TC_MASTER_ID, ORG_ID, EMP_ID, STATUS, CREATED_BY)
                VALUES ?
              `;

              db.query(
                insertTimesheetSql,
                [timesheetData],
                (tsErr) => {
                  if (tsErr) {
                    console.error(tsErr);
                    return res.status(500).json({ message: "Timesheet insert failed" });
                  }

                  return res.status(200).json({
                    message: "Timesheet customization completed successfully",
                    startDay,
                    endDay,
                    weekStart,
                    weekEnd
                  });
                }
              );
            });
          }
        );
      }
    );
  });
};

module.exports = { TimesheetCustomization };
