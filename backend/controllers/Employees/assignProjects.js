// this api is used for assigning the projects to the employees

const db = require("../../config/db");

const assignProject = (req, res) => {
  const {
    orgId,
    empId,
    startDate,
    status,
    role,
    approveAccess,
    projId,
    email,
  } = req.body;

  console.log("orgId", orgId);
  console.log("empId", empId);
  console.log("startDate", startDate);
  console.log("status", status);
  console.log("role", role);
  console.log("approveAccess", approveAccess);
  console.log("projId", projId);
  console.log("email", email);

  const insertSql = `INSERT INTO TC_PROJECTS_ASSIGNEES (PROJ_ID,ORG_ID, EMP_ID, START_DATE,STATUS, ROLE_CODE, TS_APPROVE_ACCESS,CREATED_BY, CREATION_DATE)
    VALUES (?,?,?,?,?,?,?,?,NOW())`;

  db.query(
    insertSql,
    [projId, orgId, empId, startDate, status, role, approveAccess, email],
    (error, result) => {
      if (error) {
        console.log("Error occured", error);
        return res.status(500).json({ data: error });
      }

      if (approveAccess) {
        const updateSql = `UPDATE TC_PROJECTS_MASTER
           SET MANAGER_ID = ? 
           WHERE PROJ_ID = ? AND 
           ORG_ID = ?`;

        db.query(
          updateSql,
          [empId, projId, orgId],
          (updateError, updateResult) => {
            if (updateError) {
              console.log("error occured", updateError);
              return res.status(500).json({ data: updateError });
            }
            console.log("result for updateResult", updateResult);
            return res.status(200).json({ data: updateResult });
          }
        );
      }
    }
  );
};

module.exports = { assignProject };
