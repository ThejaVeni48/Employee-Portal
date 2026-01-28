

const db = require("../../config/db");
const moment = require("moment");

const updateSuperUserStatus = (req, res) => {
  const {
    empId,
    branchId,
    orgId,
    status, // "A" or "I"
    updatedBy,
  } = req.body;

  if (!empId || !branchId || !orgId || !status) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }

  const today = moment().format("YYYY-MM-DD");

  db.beginTransaction((txErr) => {
    if (txErr) {
      return res.status(500).json({
        message: "Transaction start failed",
      });
    }

    // 1️⃣ Update assignment
    const updateAssignSql = `
      UPDATE TC_ORG_USER_ASSIGNMENT
      SET
        STATUS = ?,
        END_DATE = ?,
        LAST_UPDATED_BY = ?,
        LAST_UPDATED_DATE = NOW()
      WHERE EMP_ID = ?
        AND BRANCH_ID = ?
        AND ORG_ID = ?
        AND ROLE_CODE = 'SUPER_USER'
    `;

    db.query(
      updateAssignSql,
      [status, today, updatedBy, empId, branchId, orgId],
      (assignErr, assignRes) => {
        if (assignErr) {
          console.error(assignErr);
          return db.rollback(() =>
            res.status(500).json({
              message: "Failed to update assignment",
            })
          );
        }

        // 2️⃣ Optional: update user table if needed
        const updateUserSql = `
          UPDATE TC_USERS
          SET STATUS = ?
          WHERE EMP_ID = ?
        `;

        db.query(
          updateUserSql,
          [status, empId],
          (userErr) => {
            if (userErr) {
              console.error(userErr);
              return db.rollback(() =>
                res.status(500).json({
                  message: "Failed to update user",
                })
              );
            }

            // ✅ Commit
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() =>
                  res.status(500).json({
                    message: "Commit failed",
                  })
                );
              }

              return res.status(200).json({
                message:
                  status === "A"
                    ? "Super User activated"
                    : "Super User deactivated",
              });
            });
          }
        );
      }
    );
  });
};

module.exports = { updateSuperUserStatus };
