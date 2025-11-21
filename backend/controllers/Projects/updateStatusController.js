const db = require("../../config/db.js");

// PUT: update project status
const updatePStatus = (req, res) => {
  const { status, projectId, companyId, projectCode } = req.body;

  console.log("status:", status);
  console.log("projectId:", projectId);
  console.log("companyId:", companyId);
  console.log("projectCode:", projectCode);

  const updateSql = `
    UPDATE PROJECTS
    SET STATUS = ?
    WHERE PROJECT_ID = ? AND COMPANY_ID = ? AND PROJECT_CODE = ?
  `;

  db.query(updateSql, [status, projectId, companyId, projectCode], (error, result) => {
    if (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ error: "Database error", details: error });
    }

    console.log("Status updated:", result);
    return res.status(200).json({ message: "Project status updated successfully", result });
  });
};

module.exports = { updatePStatus };
