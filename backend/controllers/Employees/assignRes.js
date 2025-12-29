// API to assign Role, Designation and Access

const db = require('../../config/db');
const moment = require('moment');

const assignRes = (req, res) => {
  const {
    companyId,
    empId,
    selectedRoleCode,
    selectedDesgn,
    selectedAccess,
    email
  } = req.body;

  if (!companyId || !empId || !selectedRoleCode) {
    return res.status(400).json({
      success: false,
      message: "ORG_ID, EMP_ID and ROLE are required"
    });
  }

  const today = moment().format('YYYY-MM-DD');
  const ACTIVE = "A";
  const INACTIVE = "I";

  const accessList = Array.isArray(selectedAccess) ? selectedAccess : [];

  db.beginTransaction((txErr) => {
    if (txErr) {
      console.error("Transaction start error:", txErr);
      return res.status(500).json({
        success: false,
        message: "Transaction start failed"
      });
    }

      //===========================  STEP 1:  DEACTIVATE OLD ROLE / DESIGNATION ======================================================

    const deactivateAssignSql = `
      UPDATE TC_ORG_USER_ASSIGNMENT
      SET STATUS = ?, END_DATE = ?, LAST_UPDATED_BY = ?, LAST_UPDATED_DATE = NOW()
      WHERE ORG_ID = ? AND EMP_ID = ? AND STATUS = ? `;

    db.query(
      deactivateAssignSql,
      [INACTIVE, today, email, companyId, empId, ACTIVE],
      (deactErr) => {
        if (deactErr) {
          return db.rollback(() => {
            console.error("Deactivate assignment error:", deactErr);
            return res.status(500).json({
              success: false,
              message: "Failed to deactivate old assignments"
            });
          });
        }

        const deactivateAccessSql = `
          UPDATE TC_ACCESS_CONTROLS
          SET STATUS = ?, END_DATE = ?
          WHERE ORG_ID = ? AND EMP_ID = ? AND STATUS = ?
        `;

        db.query(
          deactivateAccessSql,
          [INACTIVE, today, companyId, empId, ACTIVE],
          (accDeactErr) => {
            if (accDeactErr) {
              return db.rollback(() => {
                console.error("Deactivate access error:", accDeactErr);
                return res.status(500).json({
                  success: false,
                  message: "Failed to deactivate old access"
                });
              });
            }

   // =======================  2. INSERT NEW ASSIGNMENTS & ACCESS ========================================

            const insertAssignSql = `
              INSERT INTO TC_ORG_USER_ASSIGNMENT
              (ORG_ID, EMP_ID, ROLE_CODE, DESGN_CODE, START_DATE, STATUS, CREATED_BY)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const insertAccessSql = `
              INSERT INTO TC_ACCESS_CONTROLS
              (ACCESS_CODE, EMP_ID, ORG_ID, START_DATE, END_DATE, STATUS, CREATED_BY)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const finalAccess = accessList.length > 0 ? accessList : [null];
            let idx = 0;
            const insertedIds = [];

            const insertNext = () => {
              if (idx >= finalAccess.length) {
                return db.commit((commitErr) => {
                  if (commitErr) {
                    return db.rollback(() => {
                      console.error("Commit error:", commitErr);
                      return res.status(500).json({
                        success: false,
                        message: "Commit failed"
                      });
                    });
                  }

                  return res.status(200).json({
                    success: true,
                    message: "Responsibilities updated successfully",
                    insertedRows: insertedIds.length,
                    insertedIds
                  });
                });
              }

              const acc = finalAccess[idx];

              // INSERT INTO ORG USER ASSIGNMENT
              db.query(
                insertAssignSql,
                [
                  companyId,
                  empId,
                  selectedRoleCode,
                  selectedDesgn || null,
                  today,
                  ACTIVE,
                  email
                ],
                (insErr, insRes) => {
                  if (insErr) {
                    return db.rollback(() => {
                      console.error("Assignment insert error:", insErr);
                      return res.status(500).json({
                        success: false,
                        message: "Assignment insert failed"
                      });
                    });
                  }

                  // INSERT INTO ACCESS CONTROLS
                  db.query(
                    insertAccessSql,
                    [
                      acc,
                      empId,
                      companyId,
                      today,
                      null,
                      ACTIVE,
                      email
                    ],
                    (accErr, accRes) => {
                      if (accErr) {
                        return db.rollback(() => {
                          console.error("Access insert error:", accErr);
                          return res.status(500).json({
                            success: false,
                            message: "Access control insert failed"
                          });
                        });
                      }

                      insertedIds.push({
                        assignmentId: insRes.insertId,
                        accessControlId: accRes.insertId
                      });

                      idx++;
                      insertNext();
                    }
                  );
                }
              );
            };

            insertNext();
          }
        );
      }
    );
  });
};

module.exports = { assignRes };
