const db = require('../../config/db');
const moment = require('moment');

const assignAccess = (req, res) => {
  const { companyId, empId, selectedAccess, email } = req.body;

  if (!companyId || !empId) {
    return res.status(400).json({
      success: false,
      message: "ORG_ID and EMP_ID are required"
    });
  }

  const accessList = Array.isArray(selectedAccess) ? selectedAccess : [];
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

    // 1️⃣ Deactivate old access
    const deactivateSql = `
      UPDATE TC_ACCESS_CONTROLS
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
              message: "Failed to deactivate old access"
            })
          );
        }

        // 2️⃣ If no access selected, just commit
        if (accessList.length === 0) {
          return commitTxn([]);
        }

        // 3️⃣ Insert new access rows
        const insertSql = `
          INSERT INTO TC_ACCESS_CONTROLS
          (ACCESS_CODE, EMP_ID, ORG_ID, START_DATE, END_DATE, STATUS, CREATED_BY)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        let idx = 0;
        const insertedIds = [];

        const insertNext = () => {
          if (idx >= accessList.length) {
            return commitTxn(insertedIds);
          }

          db.query(
            insertSql,
            [accessList[idx], empId, companyId, today, null, ACTIVE, email],
            (insErr, insRes) => {
              if (insErr) {
                return db.rollback(() =>
                  res.status(500).json({
                    success: false,
                    message: "Access insert failed"
                  })
                );
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

    const commitTxn = (ids) => {
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
          message: "Access updated successfully",
          accessInserted: ids.length
        });
      });
    };
  });
};

module.exports = { assignAccess };
