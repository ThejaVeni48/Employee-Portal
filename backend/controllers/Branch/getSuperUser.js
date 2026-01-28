

const db = require("../../config/db");

const getSuperUsersByBranch = (req, res) => {
  const { branchId,orgId } = req.query;


  console.log("branchID",branchId);
  console.log("orgId",orgId);
  
  if (!branchId) {
    return res.status(400).json({
      message: "Branch ID is required",
    });
  }

  const sql = `
    SELECT
      u.USER_ID,
      u.FIRST_NAME,
      u.LAST_NAME,
      u.MIDDLE_NAME,
      u.DISPLAY_NAME,
      u.EMP_ID,
      u.EMAIL,
      u.MOBILE_NUMBER,
      u.STATUS AS USER_STATUS,
      u.START_DATE,

      a.ROLE_CODE,
      a.STATUS AS ASSIGNMENT_STATUS

    FROM TC_USERS u
    JOIN TC_ORG_USER_ASSIGNMENT a
      ON u.EMP_ID = a.EMP_ID
    WHERE a.BRANCH_ID = ?
    AND a.ORG_ID = ?
      AND a.ROLE_CODE = 'SUPER_USER'
      AND a.STATUS = 'A'
    ORDER BY u.CREATION_DATE DESC
  `;

  db.query(sql, [branchId,orgId], (err, rows) => {
    if (err) {
      console.error("Get super users error:", err);
      return res.status(500).json({
        message: "Failed to fetch super users",
      });
    }

    console.log("rows",rows);
    

    return res.status(200).json({
      data: rows,
    });
  });
};

module.exports = { getSuperUsersByBranch };
