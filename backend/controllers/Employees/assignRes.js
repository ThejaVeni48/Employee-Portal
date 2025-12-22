// this is api is used for assigning role, desgn,access

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

  // START transaction
  db.beginTransaction((txErr) => {
    if (txErr) {
      console.error("Transaction error:", txErr);
      return res.status(500).json({ success: false, message: "Transaction start failed" });
    }

    //  Deactivate previous assignments
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
          return db.rollback(() => {
            console.error("Deactivate error:", deactErr);
            return res.status(500).json({ success: false, message: "Failed to deactivate old assignments" });
          });
        }

        // //Insert New Assignments
        const insertSql = `
          INSERT INTO TC_ORG_USER_ASSIGNMENT
          (ORG_ID, EMP_ID, ROLE_CODE, DESGN_CODE, ACCESS_CODE, START_DATE, STATUS, CREATED_BY, CREATION_DATE)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
                  return res.status(500).json({ success: false, message: "Commit failed" });
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

          db.query(
            insertSql,
            [companyId, empId, selectedRoleCode, selectedDesgn || null, acc, today, ACTIVE, email],
            (insErr, insRes) => {
              if (insErr) {
                return db.rollback(() => {
                  console.error("Insert error:", insErr);
                  return res.status(500).json({ success: false, message: "Insert failed" });
                });
              }

              insertedIds.push(insRes.insertId);
              idx++;
              insertNext();
            }
          );
        };

        insertNext();
      }
    );
  });
};

module.exports = { assignRes };
