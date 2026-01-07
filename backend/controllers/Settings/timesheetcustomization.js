const db = require("../../config/db");

const TimesheetCustomization = (req, res) => {
  const { orgId, selectedDay, email } = req.body;

  // console.log("orgId", orgId);
  // console.log("selectedDay", selectedDay);
  // console.log("email", email);
  const empTimesheet = [];

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const generatedDays = [];

  for (let i = 0; i < 7; i++) {
    generatedDays.push(weekDays[(selectedDay + i) % 7]);
  }

  // console.log("generatedDays", generatedDays);

  const endDay = generatedDays[6];

  const startDay = generatedDays[0];

  const duration = generatedDays.length;

  const status = "A";

  const checkOrg = `SELECT * FROM TC_ORG_SETTINGS
  WHERE ORG_ID = ? `;

  db.query(checkOrg, [orgId], (checkError, checkResult) => {
    if (checkError) {
      console.log("CheckError", checkError);
      return res.status(500).json({ data: checkError });
    }
    if (checkResult.length > 0) {
      return res.status(400).json({ data: "Organization already existed" });
    }
    if (checkResult.length === 0) {
      const insertSql = `
        INSERT INTO TC_ORG_SETTINGS
        (ORG_ID, START_DAY, END_DAY,STATUS,DURATION,CREATED_BY)
        VALUES (?, ?, ?, ?, ?,?)
      `;

      db.query(
        insertSql,
        [orgId, startDay, endDay, status, duration, email],
        (insErr, insRes) => {
          if (insErr) {
            console.log("error occured", insErr);
            return res
              .status(500)
              .json({ message: "Insert failed", error: insErr });
          }

          // console.log("result", insRes);

          if (insRes.affectedRows > 0) {
            const currentDay = new Date();
            // console.log("currentDay", currentDay);

            // need to get curret monday from current day
           function getCurrentWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? -6 : 1 - day; // adjust to Monday
  d.setDate(d.getDate() + diff);
  return d;
}


           const today = new Date();
const currentMonday = getCurrentWeekMonday(today);

console.log("Current week Monday:", currentMonday.toDateString());

const weeks = [];

for (let i = 0; i < 7; i++) {
  const tempDate = new Date(currentMonday);
  tempDate.setDate(currentMonday.getDate() + i);
  weeks.push(tempDate.toISOString().split("T")[0]);
}

console.log("Generated week dates:", weeks);

const weekStart = weeks[0]; // Monday
const weekEnd = weeks[6];   // Sunday

console.log("weekStart:", weekStart);
console.log("weekEnd:", weekEnd);

            

            const sql = `INSERT INTO TC_MASTER (ORG_ID,WEEK_START,WEEK_END,CREATED_BY)
VALUES(?,?,?,?)`;

            db.query(
              sql,
              [orgId, weekStart, weekEnd, email],
              ( weeksError,insertWeek) => {
                if (weeksError) {
                  console.log("Error coccured", weeksError);
                  return res.status(500).json({ data: weeksError });
                }
                // console.log("insertWeek",insertWeek);


                const masterId = insertWeek.insertId;

                console.log("masterId",masterId);
                
                

                if (insertWeek.affectedRows > 0)
                   {

                    const activeEmp = `SELECT * FROM TC_USERS WHERE ORG_ID =  ? AND STATUS = 'A'`;

                    db.query(activeEmp,[orgId],(fetchEmpError,fetchEmpResult)=>{
                      if(fetchEmpError)
                      {
                        console.log("fetchEmpError",fetchEmpError);
                        return res.status(500).json()
                        
                      }

if (fetchEmpResult.length > 0)                       {


  const status = 'D'

                      
                     fetchEmpResult.forEach(emp => {
                       empTimesheet.push([
                         masterId,
                         orgId,
                         emp.EMP_ID,
                         status,
                        'system'
                       ])
                     });



                    //  console.log("empTimesheet",empTimesheet);


                     const insertSql  = `INSERT INTO TC_TIMESHEET (TC_MASTER_ID,ORG_ID,EMP_ID,STATUS,CREATED_BY)
                     VALUES ?`;

                     db.query(insertSql,[empTimesheet],(insertError,insertResult)=>{
                      if(insertError)
                      {
                        console.log("insertError",insertError);
                        return res.status(500).json({data:insertError})
                        
                      }
                      console.log("insertResult",insertResult);

                      // generateFutureWeeks(weekEnd)


                      
                      
                     })
                      }

                     
                     
         



                      
                      
                    })
                   }
            
              }
            );
          } else {
            console.log("false");
          }
        }
      );
    }
  });
};

module.exports = { TimesheetCustomization };
