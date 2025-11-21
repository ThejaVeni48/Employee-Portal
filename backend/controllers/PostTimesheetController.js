
const db = require("../config/db");

const postTimeSheet =(req, res) => {
  const {
    empId,
    startDate,
    totalHours,
    entries,
    status,
    companyId,
    timesheetCode,
    projectId
  } = req.body;
  console.log("entries",entries);
  

  console.log("companyid post timesheet", companyId);
  console.log("empId post timesheet", empId);

  if (!entries || !entries.length) {
    return res.status(400).json({ error: "No timesheet entries provided." });
  }

  // Check if timesheet already exists for the user and date
  const checkTimesheetSql =
    "SELECT * FROM TIMESHEETS WHERE EMP_ID = ? AND WEEK_START = ? AND COMPANY_ID = ?";
  db.query(checkTimesheetSql, [empId, startDate, companyId], (err, result) => {
    if (err) {
      console.log("error occured2", err);
      return res.status(500).json({ error: err });
    }

    //------------------ CASE 1: TIMESHEET EXISTS ------------------
    if (result.length > 0) {
      const timeSheetId = result[0].TIMESHEET_ID;

      // Update total hours and status
      const updateTimeSheet = `
        UPDATE TIMESHEETS 
        SET TOTAL_HOURS = ?, STATUS = ?,
        REMARKS = ''
        WHERE TIMESHEET_ID = ? AND COMPANY_ID = ? AND EMP_ID = ? AND TIMESHEET_CODE = ?
      `;
      db.query(
        updateTimeSheet,
        [totalHours, status, timeSheetId, companyId, empId, timesheetCode],
        (err) => {
          if (err) {
            console.log("error occured3", err);
            return res.status(500).json({ error: err });
          }

          // Loop through all entries
          entries.forEach((entry) => {
            const { notes, hours, projectType, billable, dates } = entry;

            if (
              Array.isArray(notes) &&
              Array.isArray(hours) &&
              notes.length === hours.length
            ) {
              for (let i = 0; i < notes.length; i++) {
                const safeHours =
                  hours[i] === "" ? null : parseInt(hours[i], 10);

                const checkTempSql = `
                  SELECT * FROM TIMESHEET_ENTRIES 
                  WHERE TIMESHEET_ID = ? AND ENTRY_DATE = ? AND PROJECT_TYPE = ? AND COMPANY_ID = ? AND EMP_ID = ?
                `;

                db.query(
                  checkTempSql,
                  [timeSheetId, dates[i], projectType, companyId, empId],
                  (err, tempResult) => {
                    if (err) {
                      console.log("error occured4", err);
                      return console.error(err);
                    }

                    if (tempResult.length > 0) {
                    
                    // Update existing entry  (used for resubmitting during rejected)
                      const updateSql = `
                        UPDATE TIMESHEET_ENTRIES
                        SET DAILY_HOURS = ?, BILLABLE_TYPE = ?, TASK = ?
                        WHERE TIMESHEET_ID = ? AND ENTRY_DATE = ? AND PROJECT_TYPE = ? AND COMPANY_ID = ? AND EMP_ID = ?
                      `;
                      db.query(
                        updateSql,
                        [
                          safeHours,
                          billable,
                          notes[i],
                          timeSheetId,
                          dates[i],
                          projectType,
                          companyId,
                          empId,
                        ],
                        (err) => {
                          if (err) console.error("Error updating entry:", err);
                        }
                      );
                    } else {
                      // Insert new entry
                      // scenarioi : first saved and then submitting the timesheet
                      const insertTempSql = `
                        INSERT INTO TIMESHEET_ENTRIES 
                        (ENTRY_DATE, DAILY_HOURS, PROJECT_TYPE, BILLABLE_TYPE, TIMESHEET_ID, TASK, COMPANY_ID, EMP_ID, TIMESHEET_CODE,PROJECT_NO)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
                      `;
                      db.query(
                        insertTempSql,
                        [
                          dates[i],
                          safeHours,
                          projectType,
                          billable,
                          timeSheetId,
                          notes[i],
                          companyId,
                          empId,
                          timesheetCode,
                          projectId
                        ],
                        (err) => {
                          if (err) console.error("Error inserting entry:", err);
                        }
                      );
                    }
                  }
                );
              }
            }
          });

          return res.json({
            message: "Timesheet and entries updated successfully",
            timeSheetId,
            response: 1,
          });
        }
      );
    }

    //------------------ CASE 2: NEW TIMESHEET ------------------

    // directly submitting the timesheet without saving
    else {


    

      const insertTimesheetSql = `
        INSERT INTO TIMESHEETS 
        (WEEK_START, TOTAL_HOURS, STATUS, COMPANY_ID, EMP_ID, TIMESHEET_CODE) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertTimesheetSql,
        [startDate, totalHours, status, companyId, empId, timesheetCode],
        (err, result) => {
          if (err) {
            console.log("error occured5", err);
            return res.status(500).json({ error: err });
          }

          const timeSheetId = result.insertId;
          const entryData = [];

          console.log("entries", entries);

          entries.forEach((entry) => {
            const { notes, hours, projectType, billable, dates } = entry;
            if (
              Array.isArray(notes) &&
              Array.isArray(hours) &&
              notes.length === hours.length
            ) {
              for (let i = 0; i < notes.length; i++) {
                const safeHours =
                  hours[i] === "" ? null : parseInt(hours[i], 10);
                entryData.push([
                  dates[i],
                  safeHours,
                  projectType,
                  billable,
                  timeSheetId,
                  notes[i],
                  companyId,
                  empId,
                  timesheetCode,
                  projectId
                ]);
              }
            }
          });

          console.log("ENTRYdTAA", entryData);

          if (entryData.length === 0) {
            return res
              .status(400)
              .json({ error: "No valid timesheet entries provided." });
          }

          const insertTempSql = `
            INSERT INTO TIMESHEET_ENTRIES 
            (ENTRY_DATE, DAILY_HOURS, PROJECT_TYPE, BILLABLE_TYPE, TIMESHEET_ID, TASK, COMPANY_ID, EMP_ID, TIMESHEET_CODE,PROJECT_NO) 
            VALUES ?
          `;
          db.query(insertTempSql, [entryData], (err) => {
            if (err) {
              console.log("error occured76", err);
              return res.status(500).json({ error: err });
            }
            return res.json({
              message: "Timesheet and entries created successfully",
              timeSheetId,
              response: 2,
            });
          });

          // delete temp table (need to check once)
          const deletesql = `
            DELETE FROM TEMP_TIMESHEET_ENTRIES WHERE TIMESHEET_ID = ?
          `;
          db.query(deletesql, [timeSheetId], (deleteError, deleteResult) => {
            if (deleteError) {
              console.log("error occured deleting temp entries", deleteError);
            } else {
              console.log("Temp entries deleted:", deleteResult);
            }
          });
        }
      );
    }
  });
};

module.exports = {postTimeSheet};
