// this api is used to inactivate the role

const db = require('../../config/db');

const inactiveDesignation = (req, res) => {
  const { companyId, designationCode, email } = req.body;

  const sql = `
    UPDATE TC_ORG_DESIGNATIONS
    SET DESGN_STATUS = 'I',
        LAST_UPDATED_BY = ?,
        LAST_UPDATED_DATE = NOW()
    WHERE ORG_ID = ?
      AND DESGN_CODE = ?
      AND DESGN_STATUS = 'Active'
  `;

  db.query(sql, [email, companyId, designationCode], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Designation already inactive or not found",
      });
    }

    res.json({ success: true });
  });
};

module.exports = { inactiveDesignation };
