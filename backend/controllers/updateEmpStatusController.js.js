const db = require('../config/db');

const updateStatus = (req, res) => {
  const { empId, status, companyId, createdBy } = req.body;


  console.log("empId",empId);
  console.log("status",status);
  console.log("companyId",companyId);
  console.log("createdBy",createdBy);
  
  const sql = `
    UPDATE EMPLOYEES_DETAILS 
    SET STATUS = ?, 
        LAST_UPDATED_DATE = NOW(), 
        LAST_UPDATED_BY = ?
    WHERE EMP_ID = ? 
      AND COMPANY_ID = ?;
  `;

  db.query(sql, [status, createdBy, empId, companyId], (error, result) => {
    if (error) {
      console.log("Error occurred while updating status:", error);
      return res.status(500).json({ message: "Failed to update employee status", error });
    }

    console.log("Status updated successfully:", result);
    return res.status(200).json({ message: "Employee status updated successfully", data: result,status:200 });
  });
};

module.exports = { updateStatus };
