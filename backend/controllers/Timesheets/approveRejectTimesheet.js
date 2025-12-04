const db = require('../../config/db');

const acceptTimesheet = (req, res) => {
  const { weekId, approverId, empId, remarks, orgId, action, projId } = req.body;



  console.log("WEEKSID",weekId);
  console.log("approverId",approverId);
  console.log("empId",empId);
  console.log("remarks",remarks);
  console.log("orgId",orgId);
  console.log("action",action);
  console.log("projId",projId);
  

  const status = action === "R" ? "R" : "A";

  // GET TC_ID first
  const getIdSql = `
    SELECT TC_ID 
    FROM TC_TIMESHEET
    WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ?
  `;

  db.query(getIdSql, [weekId, empId, orgId], (getErr, getRes) => {
    if (getErr) return res.status(500).json({ error: getErr });

    const tcId = getRes[0]?.TC_ID;

    //  Check if the project has hierarchy
    const checkSql = `SELECT COUNT(*) AS CNT 
FROM TC_PROJ_HIER_LIST 
WHERE EMP_ID = ? AND PROJ_ID = ?`;

    db.query(checkSql, [empId,projId], (err, out) => {
      if (err) return res.status(500).json({ error: err });

      const hierarchyExists = out[0].CNT > 0;

      // CASE 1: HIERARCHY EXISTS
    
      if (hierarchyExists) {

        const getSql = `
          SELECT CURRENT_APPROVER 
          FROM TC_TIMESHEET
          WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ? AND PROJ_ID = ?
        `;

        db.query(getSql, [weekId, empId, orgId,projId], (err2, result) => {
          if (err2) return res.status(500).json({ error: err2 });

          const currentApprover = result[0]?.CURRENT_APPROVER;

          if (currentApprover !== approverId) {
            return res.status(403).json({
              status: 0,
              message: "You are not the assigned approver."
            });
          }

          // REJECTION CASE
          if (action === "R") {
            const rejectSql = `
              UPDATE TC_TIMESHEET
              SET STATUS=?, APPROVER_ID = ?, REMARKS = ?
              WHERE TC_ID = ?
            `;

            return db.query(
              rejectSql,
              [status,approverId, remarks, tcId],
              () => res.json({ status: 1, message: "Timesheet rejected." })
            );
          }

          // IF ACCEPTED GOES TO NEXT APPROVER
          const nextSql = `
            SELECT APPROVER_ID
            FROM TC_PROJ_HIER_LIST
            WHERE PROJ_ID = ?
              AND LINE_NO > (
                SELECT LINE_NO FROM TC_PROJ_HIER_LIST
                WHERE PROJ_ID = ? AND APPROVER_ID = ? AND EMP_ID = ?
              )
            ORDER BY LINE_NO
            LIMIT 1
          `;

          db.query(nextSql, [projId, projId, approverId,empId], (err3, next) => {
            if (err3) return res.status(500).json({ error: err3 });

            const finalSql = `
              SELECT APPROVER_ID
              FROM TC_PROJ_HIER_LIST
              WHERE PROJ_ID = ? AND
              EMP_ID = ?
              ORDER BY LINE_NO DESC
              LIMIT 1
            `;

            db.query(finalSql, [projId,empId], (err4, finalOut) => {
              if (err4) return res.status(500).json({ error: err4 });

              const finalApprover = finalOut[0].APPROVER_ID;

              // Move to next approver
              if (next.length > 0) {
                const nextApprover = next[0].APPROVER_ID;

                const updateSql = `
                  UPDATE TC_TIMESHEET

                  SET CURRENT_APPROVER = ?, STATUS='P',
                  REMARKS = ?
                  WHERE TC_ID = ?
                `;

                return db.query(
                  updateSql,
                  [nextApprover,remarks, tcId],
                  () => res.json({ status: 1, message: "Moved to next approver." })
                );
              }

              // Final approval
              if (approverId === finalApprover) {
                const finalUpdateSql = `
                  UPDATE TC_TIMESHEET
                  SET STATUS=?, APPROVER_ID = ?, REMARKS= ? 
                  WHERE TC_ID = ?
                `;

                return db.query(
                  finalUpdateSql,
                  [status,finalApprover,remarks, tcId],
                  () => res.json({ status: 1, message: "Final approval done." })
                );
              }
            });
          });
        });

      }

      // CASE 2: NO HIERARCHY
      else {

        const finalSql = `
          UPDATE TC_TIMESHEET
          SET STATUS=?, APPROVER_ID = ?, REMARKS = ?
          WHERE TC_ID = ?
        `;

        return db.query(
          finalSql,
          [status,approverId, remarks, tcId],
          () => res.json({ status: 1, message: "Approved (No hierarchy)." })
        );
      }
    });
  });
};

module.exports = { acceptTimesheet };
