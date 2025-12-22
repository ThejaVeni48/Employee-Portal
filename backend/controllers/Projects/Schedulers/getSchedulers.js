const db = require("../../../config/db");



const getSchedulers = async (req, res) => {
  const { projId, orgId, empId, month } = req.query;

  console.log("projId:", projId);
  console.log("orgId:", orgId);
  console.log("empId:", empId);
  console.log("month:", month);

  if (!projId || !orgId || !empId || !month) {
    return res.status(400).json({
      message: "Missing required parameters",
    });
  }

  try {

    const assignSql = `
      SELECT TC_PROJ_ASSIGN_ID
      FROM TC_PROJECTS_ASSIGNEES
      WHERE EMP_ID = ?
        AND ORG_ID = ?
        AND PROJ_ID = ?
      LIMIT 1
    `;

    const assignRows = await new Promise((resolve, reject) => {
      db.query(assignSql, [empId, orgId, projId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (!assignRows || assignRows.length === 0) {
      return res.json({
        data: {
          month_year: month,
          schedule: [],
        },
      });
    }

    const assignId = assignRows[0].TC_PROJ_ASSIGN_ID;

    const schedSql = `
      SELECT *
      FROM PROJ_SCHEDULE
      WHERE proj_id = ?
        AND org_id = ?
        AND assign_id = ?
        AND month_year = ?
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    const schedRows = await new Promise((resolve, reject) => {
      db.query(
        schedSql,
        [projId, orgId, assignId, month],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });

    if (!schedRows || schedRows.length === 0) {
      return res.json({
        data: {
          month_year: month,
          schedule: [],
        },
      });
    }

    const row = schedRows[0];

  
    const startDate = new Date(row.start_date);
    const year = startDate.getFullYear();
    const monthIndex = startDate.getMonth(); 

    const schedule = [];

    for (let day = 1; day <= 31; day++) {
      const hours = row[`day${day}`];

      if (hours !== null && hours !== undefined) {
        const date = new Date(year, monthIndex, day);

        if (date.getMonth() === monthIndex) {
          schedule.push({
            date: date.toISOString().split("T")[0], 
            hours: hours,
          });
        }
      }
    }

    return res.json({
      data: {
        schedule_id: row.schedule_id,
        month_year: row.month_year,
        total_hours: row.total_hours,
        status: row.status,
        schedule,
      },
    });
  } catch (err) {
    console.error("Get scheduler failed:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { getSchedulers };
