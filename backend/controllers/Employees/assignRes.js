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
      return res.status(500).json({
        success: false,
        message: "Transaction start failed"
      });
    }

    // 1️⃣ Deactivate old role/designation
    const deactivateAssignSql = `
      UPDATE TC_ORG_USER_ASSIGNMENT
      SET STATUS = ?, END_DATE = ?, LAST_UPDATED_BY = ?, LAST_UPDATED_DATE = NOW()
      WHERE ORG_ID = ? AND EMP_ID = ? AND STATUS = ?
    `;

    db.query(
      deactivateAssignSql,
      [INACTIVE, today, email, companyId, empId, ACTIVE],
      (deactErr) => {
        if (deactErr) {
          return db.rollback(() =>
            res.status(500).json({ success: false, message: "Failed to deactivate assignment" })
          );
        }

        // 2️⃣ Deactivate old access
        const deactivateAccessSql = `
          UPDATE TC_ACCESS_CONTROLS
          SET STATUS = ?, END_DATE = ?
          WHERE ORG_ID = ? AND EMP_ID = ? AND STATUS = ?
        `;

        db.query(
          deactivateAccessSql,
          [INACTIVE, today, companyId, empId, ACTIVE],
          (accErr) => {
            if (accErr) {
              return db.rollback(() =>
                res.status(500).json({ success: false, message: "Failed to deactivate access" })
              );
            }

            // 3️⃣ Insert new assignment
            const insertAssignSql = `
              INSERT INTO TC_ORG_USER_ASSIGNMENT
              (ORG_ID, EMP_ID, ROLE_CODE, DESGN_CODE, START_DATE, STATUS, CREATED_BY)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

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
                  return db.rollback(() =>
                    res.status(500).json({ success: false, message: "Assignment insert failed" })
                  );
                }

                // 4️⃣ Insert access controls (loop)
                if (accessList.length === 0) {
                  return commitTxn([]);
                }

                const insertAccessSql = `
                  INSERT INTO TC_ACCESS_CONTROLS
                  (ACCESS_CODE, EMP_ID, ORG_ID, START_DATE, END_DATE, STATUS, CREATED_BY)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                let idx = 0;
                const insertedIds = [];

                const insertNextAccess = () => {
                  if (idx >= accessList.length) {
                    return commitTxn(insertedIds);
                  }

                  const acc = accessList[idx];

                  db.query(
                    insertAccessSql,
                    [acc, empId, companyId, today, null, ACTIVE, email],
                    (accErr, accRes) => {
                      if (accErr) {
                        return db.rollback(() =>
                          res.status(500).json({ success: false, message: "Access insert failed" })
                        );
                      }

                      insertedIds.push(accRes.insertId);
                      idx++;
                      insertNextAccess();
                    }
                  );
                };

                insertNextAccess();
              }
            );

            // 5️⃣ Commit helper
            const commitTxn = (accessIds) => {
              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() =>
                    res.status(500).json({ success: false, message: "Commit failed" })
                  );
                }

                res.status(200).json({
                  success: true,
                  message: "Responsibilities updated successfully",
                  accessInserted: accessIds.length
                });
              });
            };
          }
        );
      }
    );
  });
};

module.exports = { assignRes };
