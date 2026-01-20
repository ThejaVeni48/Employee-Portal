// this api is used to inactivate the role

const db = require('../../config/db');

const inactiveRole = (req, res) => {
  const { roleCode, orgId, email } = req.body;

  if (!roleCode || !orgId || !email) {
    return res.status(400).json({
      success: false,
      message: "ROLE_CODE, ORG_ID and EMAIL are required"
    });
  }

  const INACTIVE = "I";

  const updateSql = `
    UPDATE TC_ORG_ROLES
    SET ROLE_STATUS = ?,
        LAST_UPDATED_BY = ?,
        LAST_UPDATED_DATE = NOW()
    WHERE ORG_ID = ?
      AND ROLE_CODE = ?
      AND ROLE_STATUS = 'Active'
  `;

  db.query(
    updateSql,
    [INACTIVE, email, orgId, roleCode],
    (err, result) => {
      if (err) {
        console.error("Inactive role error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to inactivate role"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Role not found or already inactive"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Role has been inactivated successfully"
      });
    }
  );
};

module.exports = { inactiveRole };
