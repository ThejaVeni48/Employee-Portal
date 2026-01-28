


const db = require("../../config/db");

const getProjectApprovers = (req, res) => {
  const { orgId ,projId} = req.query;

  console.log("orgId  getProjectApprovers",orgId);
  console.log("projId getProjectApprovers",projId);
  

  const sql = `
     SELECT
      PA.LEVEL_NO,
      PA.EMP_ID,
      PA.APPROVER_ID,
      PA.STATUS,
      PA.START_DATE,
      U.DISPLAY_NAME,
      U.EMAIL
    FROM TC_PROJ_APPROVERS PA
    JOIN TC_USERS U
    ON PA.EMP_ID = U.EMP_ID
    AND PA.ORG_ID = U.ORG_ID
    WHERE PA.ORG_ID = ?
      AND PA.PROJ_ID = ?
      AND PA.STATUS = 'A'
    ORDER BY PA.LEVEL_NO;
  `;

  db.query(sql, [orgId, projId], (err, rows) => {
    if (err) {
      console.error("Error fetching approvers:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.status(200).json({
      data: rows,
      count: rows.length,
    });
  });
};

module.exports = { getProjectApprovers };
