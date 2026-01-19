// this api is used for assigning the shifts to the employee.

const db = require('../../config/db');
const moment = require('moment');

const assignShift = (req, res) => {

  const { orgId, empId, shiftCode, email } = req.body;

  if (!orgId || !empId || !shiftCode) {
    return res.status(400).json({
      success: false,
      message: "ORG_ID, EMP_ID and SHIFT_CODE are required"
    });
  }

  const today = moment().format('YYYY-MM-DD');
  const ACTIVE = "A";
  const INACTIVE = "I";

  db.beginTransaction((txErr) => {
    if (txErr) {
      return res.status(500).json({
        success: false,
        message: "Transaction start failed"
      });
    }

    // STEP 1: Deactivate old shift (if exists)
    const deactivateSql = `
      UPDATE TC_SHIFT_ASSIGNMENT
      SET STATUS = ?, 
          END_DATE = ?, 
          LAST_UPDATED_BY = ?, 
          LAST_UPDATED_DATE = NOW()
      WHERE ORG_ID = ? 
        AND EMP_ID = ? 
        AND STATUS = ?
    `;

    db.query(
      deactivateSql,
      [INACTIVE, today, email, orgId, empId, ACTIVE],
      (deactErr) => {
        if (deactErr) {
          return db.rollback(() =>
            res.status(500).json({
              success: false,
              message: "Failed to deactivate old shift"
            })
          );
        }

        // STEP 2: Insert new shift
        const insertSql = `
          INSERT INTO TC_SHIFT_ASSIGNMENT
          (SHIFT_CODE, EMP_ID, ORG_ID, START_DATE, STATUS, CREATED_BY)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [shiftCode, empId, orgId, today, ACTIVE, email],
          (insErr) => {
            if (insErr) {
              return db.rollback(() =>
                res.status(500).json({
                  success: false,
                  message: "Shift assignment insert failed"
                })
              );
            }

            // STEP 3: Commit transaction
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
                message: "Shift assigned successfully"
              });
            });
          }
        );
      }
    );
  });
};

module.exports = { assignShift };
