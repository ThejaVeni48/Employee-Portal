const db = require('../../config/db');
const moment = require('moment');

const assignRes = (req, res) => {
  const {
    companyId,
    empId,
    selectedRoleCode,
    selectedDesgn,
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

  db.beginTransaction((txErr) => {
    if (txErr) {
      return res.status(500).json({
        success: false,
        message: "Transaction start failed"
      });
    }

    // make inactive old role,designation (if any)
    const deactivateSql = `
      UPDATE TC_ORG_USER_ASSIGNMENT
      SET STATUS = ?, END_DATE = ?, LAST_UPDATED_BY = ?, LAST_UPDATED_DATE = NOW()
      WHERE ORG_ID = ? AND EMP_ID = ? AND STATUS = ?
    `;

    db.query(
      deactivateSql,
      [INACTIVE, today, email, companyId, empId, ACTIVE],
      (deactErr) => {
        if (deactErr) {
          return db.rollback(() =>
            res.status(500).json({
              success: false,
              message: "Failed to deactivate old role/designation"
            })
          );
        }

        //  Insert new role,designation
        const insertSql = `
          INSERT INTO TC_ORG_USER_ASSIGNMENT
          (ORG_ID, EMP_ID, ROLE_CODE, DESGN_CODE, START_DATE, STATUS, CREATED_BY)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            companyId,
            empId,
            selectedRoleCode,
            selectedDesgn || null,
            today,
            ACTIVE,
            email
          ],
          (insErr) => {
            if (insErr) {
              return db.rollback(() =>
                res.status(500).json({
                  success: false,
                  message: "Role/Designation insert failed"
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
                message: "Role & Designation updated successfully"
              });
            });
          }
        );
      }
    );
  });
};

module.exports = { assignRes };
