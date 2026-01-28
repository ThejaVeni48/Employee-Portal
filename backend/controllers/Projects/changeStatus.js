
// this api is ed for exit / extend the project fo the employee.


const db = require('../../config/db');

const changeStatus = (req, res) => {
  const {
    empId,
    orgId,
    email,
    checkedValue,
    projId,
    role,
    contractStart,
    contractEnd
  } = req.body;


  console.log("req body",req.body);
  

  const today = new Date().toISOString().split('T')[0];

  const fetchSql = `
    SELECT TC_PROJ_ASSIGN_ID
    FROM TC_PROJECTS_ASSIGNEES
    WHERE ORG_ID = ? AND EMP_ID = ? AND PROJ_ID = ? AND STATUS = 'A'
  `;

  db.query(fetchSql, [orgId, empId, projId], (fetchErr, fetchResult) => {
    if (fetchErr) {
      console.error(fetchErr);
      return res.status(500).json({ message: "DB error" });
    }
    console.log("FETCHrESUKT",fetchResult);
    

    if (!fetchResult.length) {
      return res.status(404).json({ message: "Active assignment not found" });
    }

    const projAssignId = fetchResult[0].TC_PROJ_ASSIGN_ID;

    /* ================= EXIT / INACTIVE ================= */
    if (checkedValue === 'I') {
      const updateSql = `
        UPDATE TC_PROJECTS_ASSIGNEES
        SET 
          END_DATE = ?,
          CONTRACT_ENDDATE = ?,
          STATUS = 'I',
          LAST_UPDATED_BY = ?
        WHERE TC_PROJ_ASSIGN_ID = ?
      `;

      return db.query(
        updateSql,
        [today, today, email, projAssignId],
        (updErr) => {
          if (updErr) {
            console.error(updErr);
            return res.status(500).json({ message: "Update failed" });
          }

          return res.status(200).json({
            message: "Employee exited successfully",
            status:200
          });
        }
      );
    }

    /* ================= EXTEND ================= */
    else if (checkedValue === 'E') {
      const closeOldSql = `
        UPDATE TC_PROJECTS_ASSIGNEES
        SET 
          END_DATE = ?,
          CONTRACT_ENDDATE = ?,
          STATUS = 'I',
          LAST_UPDATED_BY = ?
        WHERE TC_PROJ_ASSIGN_ID = ?
      `;

      return db.query(
        closeOldSql,
        [today, today, email, projAssignId],
        (closeErr) => {
          if (closeErr) {
            console.error(closeErr);
            return res.status(500).json({ message: "Failed to close old assignment" });
          }

          const insertSql = `
            INSERT INTO TC_PROJECTS_ASSIGNEES
            (
              ORG_ID,
              PROJ_ID,
              EMP_ID,
              CONTRACT_STARTDATE,
              CONTRACT_ENDDATE,
              STATUS,
              ROLE_CODE,
              CREATED_BY
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          return db.query(
            insertSql,
            [
              orgId,
              projId,
              empId,
              contractStart,
              contractEnd,
              'A',
              role,
              email
            ],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({ message: "Insert failed" });
              }

              return res.status(200).json({
                message: "Contract extended successfully",
                newAssignId: insertResult.insertId,
                status:200
              });
            }
          );
        }
      );
    }

    /* ================= INVALID ================= */
    else {
      return res.status(400).json({ message: "Invalid action type" });
    }
  });
};

module.exports = { changeStatus };
