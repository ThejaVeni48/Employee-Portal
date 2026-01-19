const db = require('../../config/db');
const moment = require('moment');

const allocateRM = (req, res) => {
  const { empId, managerId, orgId, reason, email } = req.body;

  console.log("empId",empId);
  console.log("managerId",managerId);
  console.log("orgId",orgId);
  console.log("email",email);
  

  if (!orgId || !empId || !managerId) {
    return res.status(400).json({
      success: false,
      message: "ORG_ID, EMP_ID and MANAGER_ID are required"
    });
  }

  const today = moment().format('YYYY-MM-DD');
  const ACTIVE = "A";
  const INACTIVE = "I";
  // const REL_TYPE = "REPORTING_MANAGER";

  db.beginTransaction((txErr) => {
    if (txErr) {
      return res.status(500).json({
        success: false,
        message: "Transaction start failed"
      });
    }

    // STEP 1: Deactivate old RM (if exists)
    const deactivateSql = `
      UPDATE TC_EMPLOYEE_MANAGER_MAP
      SET STATUS = ?, END_DATE = ?, LAST_UPDATED_BY = ?
      WHERE ORG_ID = ?
        AND EMP_ID = ?
        AND STATUS = ?
    `;

    db.query(
      deactivateSql,
      [INACTIVE, today, email, orgId, empId, ACTIVE],
      (deactErr) => {
        if (deactErr) {
          // real SQL error → rollback
          return db.rollback(() =>
            res.status(500).json({
              success: false,
              message: "Error while deactivating old reporting manager"
            })
          );
        }

        // STEP 2: Always insert new RM
        const insertSql = `
          INSERT INTO TC_EMPLOYEE_MANAGER_MAP
          (EMP_ID, MANAGER_ID, ORG_ID, START_DATE, STATUS, REASON, CREATED_BY)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            empId,
            managerId,
            orgId,
            today,
            ACTIVE,
            reason || 'Initial assignment',
            email
          ],
          (insErr) => {
            if (insErr) {
              return db.rollback(() =>
                res.status(500).json({
                  success: false,
                  message: "Failed to assign reporting manager"
                })
              );
            }

            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() =>
                  res.status(500).json({
                    success: false,
                    message: "Commit failed"
                  })
                );
              }

              return res.status(200).json({
                success: true,
                message: "Reporting Manager assigned successfully"
              });
            });
          }
        );
      }
    );
  });
};

module.exports = { allocateRM };
