const db = require("../../config/db");

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const getScheduledHours = (req, res) => {
  const { weekStart, weekEnd, orgId, empId, projId } = req.query;

  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);

  const month1 = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const month2 = (endDate.getMonth() + 1).toString().padStart(2, "0");

  const year1 = startDate.getFullYear();
  const year2 = endDate.getFullYear();

    const monthYear1 = `${year1}-${month1}`;

    const monthYear2 = `${year2}-${month2}`;


  // STEP 1: Fetch assign_id
  const getAssignIdSql = `
    SELECT TC_PROJ_ASSIGN_ID 
    FROM TC_PROJECTS_ASSIGNEES 
    WHERE EMP_ID = ? AND ORG_ID = ?
  `;

  db.query(getAssignIdSql, [empId, orgId], (err, assignRes) => {
    if (err) {
      return res.status(500).json({ error: "AssignId fetch failed" });
    }

    if (!assignRes.length) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const assign_id = assignRes[0].TC_PROJ_ASSIGN_ID;

    // ---------------- CASE 1:SAME MONTH CASE ----------------
    if (month1 === month2 && year1 === year2) {
  

      const scheduleSql = `
        SELECT * 
        FROM PROJ_SCHEDULE 
        WHERE month_year = ?
          AND proj_id = ?
          AND assign_id = ?
          AND org_id = ?
      `;

      db.query(
        scheduleSql,
        [monthYear1, projId, assign_id, orgId],
        (err2, scheduleRes) => {
          if (err2) {
            return res.status(500).json({ error: "Schedule fetch failed" });
          }

          console.log("scheduleRes",scheduleRes);
          

          let totalScheduledHours = 0;
          let dailyBreakup = [];

          let currentDate = new Date(weekStart);

          while (currentDate <= endDate) {
            const dayNumber = currentDate.getDate();
            const columnName = `day${dayNumber}`;

            let hours = 0;
            if (scheduleRes.length) {
              hours = scheduleRes[0][columnName] || 0;
            }

            totalScheduledHours += hours;

            dailyBreakup.push({
              date: currentDate.toISOString().split("T")[0],
              hours
            });

            currentDate = addDays(currentDate, 1);
          }

          return res.json({
            weekStart,
            weekEnd,
            totalScheduledHours,
            dailyBreakup
          });
        }
      );
    } 
    // ----------------CASE 2: DIFFERENT MONTH CASE -----------------------------------
    else {
     console.log("different month case");
 const scheduleSql = `
        SELECT * 
        FROM PROJ_SCHEDULE 
        WHERE  proj_id = ?
          AND assign_id = ?
          AND org_id = ?
          AND
          month_year IN (?,?)
      `;


      db.query(
        scheduleSql,
        [ projId, assign_id, orgId,monthYear1,monthYear2],
        (err2, scheduleRes) => {
          if (err2) {
            return res.status(500).json({ error: "Schedule fetch failed" });
          }

          console.log("scheduleRes",scheduleRes);
          
 let totalScheduledHours = 0;
let dailyBreakup = [];

let currentDate = new Date(weekStart);

while (currentDate <= endDate) {
  const dayNumber = currentDate.getDate(); // 1–31

  const currentMonthYear = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  // Find correct row
  const scheduleRow = scheduleRes.find(
    row => row.month_year === currentMonthYear
  );

  let hours = 0;
  if (scheduleRow) {
    const columnName = `day${dayNumber}`;
    hours = scheduleRow[columnName] || 0;
  }

  totalScheduledHours += hours;

  dailyBreakup.push({
    date: currentDate.toISOString().split("T")[0],
    hours
  });

  currentDate = addDays(currentDate, 1);
}
return res.json({
  weekStart,
  weekEnd,
  totalScheduledHours,
  dailyBreakup
});

        
        }
      );

     
    }
  });
};

module.exports = { getScheduledHours };


