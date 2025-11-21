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

  // Validate required fields
  if (!companyId || !empId || !selectedRoleCode) {
    return res.status(400).json({
      success: false,
      message: "ORG_ID, EMP_ID, and Role are required"
    });
  }

  const today = moment().format('YYYY-MM-DD');
  const ACTIVE = 'A';
  const INACTIVE = 'I';

  // Convert selectedAccess array → comma-separated string (or null if empty)
  // const accessCodeStr = Array.isArray(selectedAccess) && selectedAccess.length > 0
  //   ? selectedAccess.join(',')
  //   : null;


 



  console.log("Assigning responsibilities:", {
    companyId,
    empId,
    selectedRoleCode,
    selectedDesgn,
    selectedAccess,
    email
  });

  const checkSql = `SELECT ASSIGNMENT_ID FROM TC_ORG_USER_ASSIGNMENT 
                    WHERE ORG_ID = ? AND EMP_ID = ? AND STATUS = ?`;

  db.query(checkSql, [companyId, empId, ACTIVE], (checkErr, activeRows) => {
    if (checkErr) {
      console.error("DB Error on check:", checkErr);
      return res.status(500).json({ success: false, message: "Database error", error: checkErr });
    }

    // If there's an active assignment → close it first
    if (activeRows.length > 0) {
      const assignmentId = activeRows[0].ASSIGNMENT_ID;

      const closeOldSql = `UPDATE TC_ORG_USER_ASSIGNMENT 
                           SET END_DATE = ?, STATUS = ?, LAST_UPDATED_BY = ?, LAST_UPDATED_DATE = NOW()
                           WHERE ASSIGNMENT_ID = ?`;

      db.query(closeOldSql, [today, INACTIVE, email, assignmentId], (closeErr) => {
        if (closeErr) {
          console.error("Error closing old assignment:", closeErr);
          return res.status(500).json({ success: false, message: "Failed to update old assignment" });
        }

        insertNewAssignment();
      });
    } else {
      insertNewAssignment();
    }

    // Helper function to insert new assignment
    function insertNewAssignment() {
      const insertSql = `
        INSERT INTO TC_ORG_USER_ASSIGNMENT 
        (ORG_ID, EMP_ID, ROLE_CODE, DESGN_CODE, ACCESS_CODE, START_DATE, STATUS, CREATED_BY, CREATION_DATE)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

 const accessList = Array.isArray(selectedAccess) && selectedAccess.length > 0 ? selectedAccess : [null];

  let insertCount = 0;

  let assignmentIds = [];


    accessList.forEach((accessCode,index)=>{
      db.query(insertSql,
        [
          companyId,
          empId,
          selectedRoleCode,
          selectedDesgn,
          accessCode,
          today,
          ACTIVE,
          email
        ],
         (err,result)=>{
          if(err)
          {
           console.error("Insert error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to assign responsibilities" });
          }
          assignmentIds.push(result.insertId);
          insertCount++;

          if(insertCount === accessList.length)
          {
            return res.status(201).json({
            success: true,
            message: "Responsibilities assigned successfully",
            data: {
              insertedRows: insertCount,
              assignmentIds,
              startDate: today
            }
          });
          }
         }
      )
    })

      // db.query(
      //   insertSql,
      //   [companyId, empId, selectedRoleCode, selectedDesgn || null, accessCodeStr, today, ACTIVE, email],
      //   (insertErr, insertResult) => {
      //     if (insertErr) {
      //       console.error("Error inserting new assignment:", insertErr);
      //       return res.status(500).json({ success: false, message: "Failed to assign responsibilities", error: insertErr });
      //     }

      //     return res.status(201).json({
      //       success: true,
      //       message: "Responsibilities assigned successfully",
      //       data: {
      //         assignmentId: insertResult.insertId,
      //         startDate: today
      //       }
      //     });
      //   }
      // );
    }
  });
};

module.exports = { assignRes };