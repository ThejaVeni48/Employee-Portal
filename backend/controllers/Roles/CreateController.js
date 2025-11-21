const db = require('../../config/db');

// API to create default roles by the user
const createOrgRole = (req, res) => {
  const { roleName, description, email, roleCode, newStatus, companyId } = req.body;

  console.log("Role Name:", roleName);
  console.log("Description:", description);

  const insertSql = `
    INSERT INTO TC_ORG_ROLES
    (ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, ORG_ID, CREATED_BY, CREATION_DATE)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(insertSql, [roleName, newStatus, roleCode, description, companyId, email], (error, result) => {
    if (error) {
      console.error("Error creating org role:", error);
      return res.status(500).json({ data: error });
    }

    // console.log("Role created successfully:", result);
    
    return res.status(201).json({ data: result, status: 201 });
  });
};

module.exports = { createOrgRole };
