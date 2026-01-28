const db = require("../../config/db");

const EditHierarchy = (req, res) => {
  const {
    projId,
    orgId,
    levelNo,
    oldEmpId,
    newEmpId,
    startDate
  } = req.body;

  console.log("req.body",req.body);
  

  if (
    !projId ||
    !orgId ||
    !levelNo ||
    !oldEmpId ||
    !newEmpId ||
    !startDate
  ) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ message: "Transaction failed" });
    }

    /* ----  Deactivate old approver ---- */

    const deactivateSql = `
      UPDATE TC_PROJ_APPROVERS
      SET STATUS = 'I',
          END_DATE = CURDATE()
      WHERE PROJ_ID = ?
        AND ORG_ID = ?
        AND LEVEL_NO = ?
        AND EMP_ID = ?
        AND STATUS = 'A'
    `;

    db.query(
      deactivateSql,
      [projId, orgId, levelNo, oldEmpId],
      (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("Deactivate error:", err);
            res.status(500).json({ message: "Failed to deactivate approver" });
          });
        }

        /* ---- Insert new approver ---- */

        const insertSql = `
          INSERT INTO TC_PROJ_APPROVERS
            (PROJ_ID, ORG_ID, LEVEL_NO, EMP_ID, STATUS, START_DATE)
          VALUES (?, ?, ?, ?, 'A', ?)
        `;

        db.query(
          insertSql,
          [projId, orgId, levelNo, newEmpId, startDate],
          (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Insert error:", err);
                res.status(500).json({ message: "Failed to insert new approver" });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Commit error:", err);
                  res.status(500).json({ message: "Commit failed" });
                });
              }

              return res.status(200).json({
                message: "Hierarchy updated successfully"
              });
            });
          }
        );
      }
    );
  });
};

module.exports = { EditHierarchy };
