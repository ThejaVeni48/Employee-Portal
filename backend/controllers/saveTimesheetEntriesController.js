
const db = require("../config/db");

const saveTimeSheets = (req, res) => {
  const { empId, startDate, totalHours, entries, status,companyId,timesheetCode,projectId } = req.body;
  console.log("company id",companyId);
  console.log("empId",empId);
  console.log("timesheetCode",timesheetCode);

  if (!entries || !entries.length) {
    console.log("errro");
    
    return res.status(400).json({ error: "No timesheet entries provided." });
  }

  // Check if timesheet already exists for the user and date
  const checkTimesheetSql = "SELECT * FROM TIMESHEETS WHERE EMP_ID = ? AND WEEK_START = ? AND COMPANY_ID =? ";
  console.log("checkTimesheetSql",checkTimesheetSql);
  
  db.query(checkTimesheetSql, [empId, startDate,companyId], (err, result) => {
    if (err) 
    {
      console.log("ERROR OCCURED",err);
      return res.status(500).json({ error: err });

    }

    //------------------ TIMESHEET EXISTS ------------------
    if (result.length > 0) {
      const timeSheetId = result[0].TIMESHEET_ID;


      // Update total hours and status
      const updateTimeSheet = "UPDATE TIMESHEETS SET TOTAL_HOURS = ?, STATUS = ? WHERE TIMESHEET_ID = ? AND COMPANY_ID =?   AND EMP_ID = ?";
      db.query(updateTimeSheet, [totalHours, status, timeSheetId,companyId,empId], (err) => {
        if (err) 
        {
          console.log("error for saved ",err);
 return res.status(500).json({ error: err });
        }
          
         
        // Loop through all entries
        entries.forEach((entry) => {
          const { notes, hours, projectType, billable, dates } = entry;

          if (Array.isArray(notes) && Array.isArray(hours) && notes.length === hours.length) {
            for (let i = 0; i < notes.length; i++) {
              const safeHours = hours[i] === "" ? null : parseInt(hours[i], 10);

              const checkTempSql = `
                SELECT * FROM TEMP_TIMESHEET_ENTRIES 
                WHERE TIMESHEET_ID = ? AND ENTRY_DATE = ? AND PROJECT_TYPE = ? AND COMPANY_ID = ? 
              `;

              db.query(checkTempSql, [timeSheetId, dates[i], projectType,companyId], (err, tempResult) => {
                if (err)
                  
                  {
                    console.log("error for saved1 ",err);
  return console.error(err);

                  }
                // NEED TO CHECK FROM HEER
                if (tempResult.length > 0) {
                  // Update existing entry
                  const updateSql = `
                    UPDATE TEMP_TIMESHEET_ENTRIES
                    SET DAILY_HOURS = ?, BILLABLE_TYPE = ?, TASK = ?
                    WHERE TIMESHEET_ID = ? AND ENTRY_DATE = ? AND PROJECT_TYPE = ? AND COMPANY_ID = ?
                  `;
                  db.query(
                    updateSql,
                    [safeHours, billable, notes[i], timeSheetId, dates[i], projectType,companyId],
                    (err) => { if (err) console.error("Error updating entry:", err); }
                  );
                }
                
                else {
                  // Insert new entry
                  const insertTempSql = `
                    INSERT INTO TEMP_TIMESHEET_ENTRIES 
                    (EMP_ID,ENTRY_DATE, DAILY_HOURS, PROJECT_TYPE, BILLABLE_TYPE, TIMESHEET_ID, TASK,COMPANY_ID,PROJECT_NO)
                    VALUES (?,?, ?, ?, ?, ?, ?,?,?)
                  `;
                  db.query(
                    insertTempSql,
                    [empId,dates[i], safeHours, projectType, billable, timeSheetId, notes[i],companyId,projectId],
                    (err) => { if (err) console.error("Error inserting entry:", err); }
                  );
                }
              });
            }
          }
        });

                // console.log("response",tempResult)
        return res.json({ message: "Timesheet and entries updated successfully", timeSheetId, response: 1 });
      });
    }

    //------------------case2: NEW TIMESHEET ------------------
    else {
      console.log("ELSE BLOCK",companyId);
      const insertTimesheetSql = "INSERT INTO TIMESHEETS (EMP_ID, WEEK_START, TOTAL_HOURS, STATUS,COMPANY_ID,TIMESHEET_CODE,PROJECT_NO) VALUES (?, ?, ?, ?,?,?,?)";
     console.log("insertTimesheetSql",insertTimesheetSql);
     
      db.query(insertTimesheetSql, [empId, startDate, totalHours, status,companyId,timesheetCode,projectId], (err, result) => {
        if (err)

          {
            console.log("error for saved3 ",err);
          return res.status(500).json({ error: err });
          }
          console.log("RESULT ",result);
          
        const timeSheetId = result.insertId;
        const entryData = [];

        entries.forEach((entry) => {
          const { notes, hours, projectType, billable, dates } = entry;
          if (Array.isArray(notes) && Array.isArray(hours) && notes.length === hours.length) {
            for (let i = 0; i < notes.length; i++) {
              const safeHours = hours[i] === "" ? null : parseInt(hours[i], 10);
              entryData.push([empId,dates[i], safeHours, projectType, billable, timeSheetId, notes[i],companyId,timesheetCode,projectId]);
            }
          }
        });

        console.log("entrydata",entryData);
        
        if (entryData.length === 0) return res.status(400).json({ error: "No valid timesheet entries provided." });

        const insertTempSql = `
          INSERT INTO TEMP_TIMESHEET_ENTRIES 
          (EMP_ID,ENTRY_DATE,DAILY_HOURS, PROJECT_TYPE, BILLABLE_TYPE, TIMESHEET_ID, TASK,COMPANY_ID,TIMESHEET_CODE,PROJECT_NO) 
          VALUES ?
        `;
        db.query(insertTempSql, [entryData], (err) => {
          if (err)
           
           { console.log("error for saved4 ",err);
             return res.status(500).json({ error: err });
}

console.log("result",result)
return res.json({ message: "Timesheet and entries created successfully", timeSheetId, response: 2 });
                

        });
      });
    }
  });
};

module.exports = {saveTimeSheets};
