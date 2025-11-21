const db = require("../../config/db");

const submitTimeSheet = (req, res) => {
  const {
    empId,
    startDate,
    totalHours,
    entries,
    status,
    companyId,
    timesheetCode,
  } = req.body;

  console.log("empId:", empId);
  console.log("companyId:", companyId);
  console.log("timesheetCode:", timesheetCode);
  console.log("entries:", entries);

  if (!entries || !entries.length) {
    return res.status(400).json({ error: "No timesheet entries provided." });
  }

  const checkTimesheetSql =
    "SELECT * FROM TIMESHEETS WHERE EMP_ID = ? AND WEEK_START = ? AND COMPANY_ID = ?";
  db.query(checkTimesheetSql, [empId, startDate, companyId], (err, result) => {
    if (err) {
      console.error("Error checking timesheet:", err);
      return res.status(500).json({ error: err });
    }

    // ------------------ CASE 1: TIMESHEET EXISTS ------------------
    if (result.length > 0) {
      const timeSheetId = result[0].TIMESHEET_ID;
      const updateSql =
        "UPDATE TIMESHEETS SET TOTAL_HOURS = ?, STATUS = ? WHERE TIMESHEET_ID = ? AND COMPANY_ID = ? AND EMP_ID = ?";

      db.query(
        updateSql,
        [JSON.stringify(totalHours), status, timeSheetId, companyId, empId],
        (err) => {
          if (err) {
            console.error("Error updating TIMESHEETS:", err);
            return res.status(500).json({ error: err });
          }

          // Loop through all entries and insert/update in TIMESHEET_ENTRIES
          entries.forEach((entry) => {
            const { projectId, hoursByDate, totalHours } = entry;

            hoursByDate.forEach(({ date, hours }) => {
              const checkEntrySql = `
              SELECT * FROM TIMESHEET_ENTRIES
              WHERE TIMESHEET_ID = ? AND ENTRY_DATE = ? AND  PROJECT_ID= ? AND COMPANY_ID = ?
            `;
              db.query(
                checkEntrySql,
                [timeSheetId, date, projectId, companyId],
                (err, existing) => {
                  if (err) return console.error("Error checking entry:", err);

                  if (existing.length > 0) {
                    // Update existing entry
                    const updateEntrySql = `
                  UPDATE TIMESHEET_ENTRIES
                  SET DAILY_HOURS = ?
                  WHERE TIMESHEET_ID = ? AND ENTRY_DATE = ? AND PROJECT_ID = ? AND COMPANY_ID = ?
                `;
                    db.query(
                      updateEntrySql,
                      [hours, timeSheetId, date, projectId, companyId],
                      (err) => {
                        if (err) console.error("Error updating entry:", err);
                      }
                    );
                  } else {
                    // Insert new entry
                    const insertEntrySql = `
                  INSERT INTO TIMESHEET_ENTRIES 
                  (EMP_ID, ENTRY_DATE, DAILY_HOURS, TIMESHEET_ID, COMPANY_ID, PROJECT_ID)
                  VALUES (?, ?, ?, ?, ?, ?)
                `;
                    db.query(
                      insertEntrySql,
                      [empId, date, hours, timeSheetId, companyId, projectId],
                      (err) => {
                        if (err) console.error("Error inserting entry:", err);
                      }
                    );
                  }
                }
              );
            });
          });

          return res.json({
            message: "Timesheet updated successfully",
            timeSheetId,
            response: 1,
          });
        }
      );
    }

    // ------------------ CASE 2: NEW TIMESHEET ------------------
    else {
      const insertTimesheetSql = `
        INSERT INTO TIMESHEETS (EMP_ID, WEEK_START, TOTAL_HOURS, STATUS, COMPANY_ID, TIMESHEET_CODE)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertTimesheetSql,
        [
          empId,
          startDate,
          JSON.stringify(totalHours),
          status,
          companyId,
          timesheetCode,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting TIMESHEETS:", err);
            return res.status(500).json({ error: err });
          }

          const timeSheetId = result.insertId;
          const entryData = [];

          entries.forEach((entry) => {
            const { projectId, hoursByDate } = entry;
            hoursByDate.forEach(({ date, hours }) => {
              entryData.push([
                empId,
                date,
                hours,
                timeSheetId,
                companyId,
                timesheetCode,
                projectId,
              ]);
            });
          });

          if (entryData.length === 0) {
            return res
              .status(400)
              .json({ error: "No valid timesheet entries provided." });
          }

          const insertEntriesSql = `
            INSERT INTO TIMESHEET_ENTRIES
            (EMP_ID, ENTRY_DATE, DAILY_HOURS, TIMESHEET_ID, COMPANY_ID, TIMESHEET_CODE, PROJECT_ID)
            VALUES ?
          `;

          db.query(insertEntriesSql, [entryData], (err) => {
            if (err) {
              console.error("Error inserting TIMESHEET_ENTRIES:", err);
              return res.status(500).json({ error: err });
            }

            return res.json({
              message: "Timesheet created successfully",
              timeSheetId,
              response: 2,
            });
          });
        }
      );
    }
  });
};

module.exports = { submitTimeSheet };
