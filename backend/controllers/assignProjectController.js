const db = require("../config/db");
const moment = require("moment");

const assignProject = (req, res) => {
  const { companyId, selectedEmp, projectId, createdBy } = req.body;

  console.log("selectedEmp", selectedEmp);

  const assignedDate = moment().format("YYYY-MM-DD");
  const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");

  // Prepatre values for insert
  const values = selectedEmp.map((emp) => [
    companyId,
    emp.EMP_ID,
    projectId,
    emp.DEPT_ID || emp.DEPARTMENT,
    assignedDate,
    insertDate,
    createdBy,
  ]);

  const insertSQL = `
    INSERT INTO PROJECTS_EMPLOYEE 
    (COMPANY_ID, EMP_ID, PROJECT_NO, DEPARTMENT, ASSIGNED_DATE, CREATION_DATE, CREATED_BY)
    VALUES ?
  `;

  db.query(insertSQL, [values], (error, result) => {
    if (error) {
      console.log("Insert error:", error);
      return res.status(500).json({ data: error });
    }

    console.log("Project assignment result:", result);
    const affectedRows = result.affectedRows;

    if (affectedRows > 0) {
      const updatedStatus = "Project";
      const empIds = selectedEmp.map((emp) => emp.EMP_ID);
      const placeholders = empIds.map(() => "?").join(",");

      const updateSQL = `
        UPDATE EMPLOYEES_DETAILS
        SET STATUS = ?,
            PROJECT_ID = ?,
            LAST_UPDATED_DATE = ?,
            LAST_UPDATED_BY = ?
        WHERE COMPANY_ID = ? AND EMP_ID IN (${placeholders})
      `;

      db.query(
        updateSQL,
        [updatedStatus, projectId, insertDate, createdBy, companyId, ...empIds],
        (updateError, updateResult) => {
          if (updateError) {
            console.log("Update error:", updateError);
            return res.status(500).json({ data: updateError });
          }

          console.log("Employee status updated:", updateResult);
          return res.status(200).json({
            message: "Project assigned successfully",
            data: updateResult,
            status: 201,
          });
        }
      );
    } else {
      res.status(400).json({ message: "No employees were updated" });
    }
  });
};

module.exports = { assignProject };
