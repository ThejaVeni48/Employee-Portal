// this api is used for assigning the employees into the projects



const db = require("../../config/db");

const assignProject = (req, res) => {
  const {
    orgId,
    empId,
    startDate,
    contractStart,
    contractEnd,
    status,
    role,
    approveAccess,
    projId,
    email,
  } = req.body;

  console.log("req.body", req.body);

  // Step 1: Get next PROJ_ASSIGN_NO for this project & company
  const getAssignNoSql = `
    SELECT IFNULL(MAX(PROJ_ASSIGN_NO), 0) + 1 AS nextAssignNo
    FROM TC_PROJECTS_ASSIGNEES
    WHERE ORG_ID = ? AND PROJ_ID = ?
  `;

  db.query(getAssignNoSql, [orgId, projId], (err, result) => {
    if (err) {
      console.log("Error generating PROJ_ASSIGN_NO", err);
      return res.status(500).json({ message: "Server error" });
    }

    const nextAssignNo = result[0].nextAssignNo;
    console.log("Generated PROJ_ASSIGN_NO:", nextAssignNo);

    // Step 2: Insert assignment
    const insertSql = `
      INSERT INTO TC_PROJECTS_ASSIGNEES 
      (PROJ_ID, ORG_ID, EMP_ID, START_DATE,CONTRACT_STARTDATE,CONTRACT_ENDDATE,STATUS, ROLE_CODE, TS_APPROVE_ACCESS, CREATED_BY, CREATION_DATE, PROJ_ASSIGN_NO)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?, NOW(), ?)
    `;

    db.query(
      insertSql,
      [projId, orgId, empId, startDate, contractStart,contractEnd,status, role, approveAccess, email, nextAssignNo],
      (error, resultInsert) => {
        if (error) {
          console.log("Error inserting assignment", error);
          return res.status(500).json({ data: error });
        }

        console.log("Assignment created", resultInsert);

        // Step 3: If approver access, update manager
        if (approveAccess) {
          const updateSql = `
            UPDATE TC_PROJECTS_MASTER
            SET MANAGER_ID = ?
            WHERE PROJ_ID = ? AND ORG_ID = ?
          `;

          db.query(updateSql, [empId, projId, orgId], (updateError, updateResult) => {
            if (updateError) {
              console.log("Error updating manager", updateError);
              return res.status(500).json({ data: updateError });
            }

            console.log("Manager updated", updateResult);
            return res.status(200).json({
              message: "Assignment created successfully",
              proj_assign_no: nextAssignNo,
            });
          });
        } else {
          return res.status(200).json({
            message: "Assignment created successfully",
            proj_assign_no: nextAssignNo,
          });
        }
      }
    );
  });
};

module.exports = { assignProject };
