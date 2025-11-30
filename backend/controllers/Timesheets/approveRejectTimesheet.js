const db = require('../../config/db');

// ACCEPT / REJECT TIMESHEET
const acceptTimesheet = (req, res) => {
  const { weekId, approverId, empId, remarks, orgId, action, projId } = req.body;




  const status = action === "R" ? "R" : "A"; // R = Reject, A = Approve

  // STEP 1 — Check if hierarchy exists for this project
  const checkSql = `SELECT COUNT(*) AS COUNT FROM TC_PROJ_HIER_LIST WHERE PROJ_ID = ?`;

  db.query(checkSql, [projId], (checkError, checkResult) => {
    if (checkError) {
      return res.status(500).json({ error: checkError });
    }

    const hierarchyExists = checkResult[0].COUNT > 0;

    // ----------------------------------------
    // CASE 1 — HIERARCHY EXISTS
    // ----------------------------------------
    if (hierarchyExists) {
      const getCurrentSql = `
        SELECT CURRENT_APPROVER 
        FROM TC_TIMESHEET 
        WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ?
      `;

      db.query(getCurrentSql, [weekId, empId, orgId], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        const currentApprover = result[0]?.CURRENT_APPROVER;

        // Validation → Only assigned approver can approve
        if (currentApprover !== approverId) {
          return res.status(403).json({
            status: 0,
            message: "You are not the current approver.",
          });
        }

        // --------------------- ACCEPT ---------------------
        if (action === "A") {
          const nextApproverSql = `
            SELECT APPROVER_ID
            FROM TC_PROJ_HIER_LIST
            WHERE PROJ_ID = ?
              AND LINE_NO > (
                SELECT LINE_NO 
                FROM TC_PROJ_HIER_LIST 
                WHERE PROJ_ID = ? AND APPROVER_ID = ?
              )
            ORDER BY LINE_NO ASC
            LIMIT 1
          `;

          db.query(nextApproverSql, [projId, projId, approverId], (err2, nextResult) => {
            if (err2) return res.status(500).json({ error: err2 });

            // Case A → Next approver exists
            if (nextResult.length > 0) {
              const nextApprover = nextResult[0].APPROVER_ID;

              const updateSql = `
                UPDATE TC_TIMESHEET
                SET CURRENT_APPROVER = ?, STATUS = 'P'
                WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ?
              `;

              db.query(updateSql, [nextApprover, weekId, empId, orgId], (err3) => {
                if (err3) return res.status(500).json({ error: err3 });

                return res.json({
                  status: 1,
                  message: "Timesheet moved to next approver.",
                });
              });
            }
            // Case B → No next approver → Final Approval
            else {
              const updateSql = `
                UPDATE TC_TIMESHEET
                SET STATUS = 'A', CURRENT_APPROVER = NULL
                WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ?
              `;

              db.query(updateSql, [weekId, empId, orgId], (err3) => {
                if (err3) return res.status(500).json({ error: err3 });

                return res.json({
                  status: 1,
                  message: "Timesheet approved successfully (Final Approver).",
                });
              });
            }
          });
        }

        // --------------------- REJECT ---------------------
        else if (action === "R") {
          const rejectSql = `
            UPDATE TC_TIMESHEET
            SET STATUS = 'R', CURRENT_APPROVER = NULL
            WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ?
          `;

          db.query(rejectSql, [weekId, empId, orgId], (err4) => {
            if (err4) return res.status(500).json({ error: err4 });

            return res.json({
              status: 1,
              message: "Timesheet rejected.",
            });
          });
        }
      });
    }

    // ----------------------------------------
    // CASE 2 — NO HIERARCHY (SIMPLE PROJECT)
    // ----------------------------------------
    else {
      // Accept without hierarchy
      if (action === "A") {
        const updateSql = `
          UPDATE TC_TIMESHEET
          SET STATUS = 'A', CURRENT_APPROVER = NULL
          WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ?
        `;

        db.query(updateSql, [weekId, empId, orgId], (err2) => {
          if (err2) return res.status(500).json({ error: err2 });

          return res.json({
            status: 1,
            message: "Timesheet approved (No hierarchy).",
          });
        });
      }

      // Reject without hierarchy
      else if (action === "R") {
        const rejectSql = `
          UPDATE TC_TIMESHEET
          SET STATUS = 'R', CURRENT_APPROVER = NULL
          WHERE TC_MASTER_ID = ? AND EMP_ID = ? AND ORG_ID = ?
        `;

        db.query(rejectSql, [weekId, empId, orgId], (err3) => {
          if (err3) return res.status(500).json({ error: err3 });

          return res.json({
            status: 1,
            message: "Timesheet rejected (No hierarchy).",
          });
        });
      }
    }
  });
};

module.exports = { acceptTimesheet };
