const db = require('../../config/db');

// API to create default jobs by the user
const createOrgAccess = (req, res) => {
  const { roleName, description, email, roleCode, newStatus, companyId } = req.body;

  console.log("Role Name:", roleName);
  console.log("Description:", description);

  const insertSql = `
    INSERT INTO TC_ORG_ACCESS
    (ACCESS_NAME, STATUS, ACCESS_CODE, ACCESS_DESC, ORG_ID, CREATED_BY, CREATION_DATE)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(insertSql, [roleName, newStatus, roleCode, description, companyId, email], (error, result) => {
    if (error) {
      // console.error("Error creating org access:", error);
      return res.status(500).json({ data: error });
    }

    // console.log("Org access created successfully:", result);
    return res.status(201).json({ data: result, status: 201 });
  });
};

module.exports = { createOrgAccess };
