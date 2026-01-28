const db = require("../../../config/db");

const ProjectDetails = (req, res) => {
  const { projId, orgId } = req.query;

  console.log("PROJiD",projId);
  

  if (!projId || !orgId) {
    return res.status(400).json({
      success: false,
      message: "projId and orgId are required"
    });
  }

  const sql = `
    SELECT 
        P.PROJ_ID,
        P.PROJ_NAME,
        P.PROJ_CODE,
        P.PROJ_DESC,
        P.START_DATE,
        P.END_DATE,
        P.SUPPORT_IDENTIFIER,
        P.STATUS,
        P.NOTES,
        P.BILLABLE,
        P.HIERARCHY,
        P.TYPE,
        P.CLIENT_NAME,

        U.DISPLAY_NAME AS MANAGER_NAME,

        IFNULL(EMP.EMP_COUNT, 0) AS EMP_COUNT,

        IFNULL(SCH.TOTAL_HOURS, 0) AS TOTAL_SCHEDULED_HOURS,

        IFNULL(AP.APPROVAL_LIST, '') AS APPROVAL_LIST

    FROM TC_PROJECTS_MASTER P

    LEFT JOIN TC_USERS U
           ON P.MANAGER_ID = U.EMP_ID
          AND P.ORG_ID = U.ORG_ID

    /* ---------- EMPLOYEE COUNT ---------- */
    LEFT JOIN (
        SELECT 
            PROJ_ID,
            ORG_ID,
            COUNT(*) AS EMP_COUNT
        FROM TC_PROJECTS_ASSIGNEES
        WHERE STATUS = 'A'
        GROUP BY PROJ_ID, ORG_ID
    ) EMP
       ON P.PROJ_ID = EMP.PROJ_ID
      AND P.ORG_ID = EMP.ORG_ID

    /* ---------- TOTAL HOURS ---------- */
    LEFT JOIN (
        SELECT 
            PROJ_ID,
            ORG_ID,
            SUM(total_hours) AS TOTAL_HOURS
        FROM PROJ_SCHEDULE
        GROUP BY PROJ_ID, ORG_ID
    ) SCH
       ON P.PROJ_ID = SCH.PROJ_ID
      AND P.ORG_ID = SCH.ORG_ID

    /* ---------- APPROVAL LIST ONLY IF HIERARCHY = Y ---------- */
    LEFT JOIN (
        SELECT
            PROJ_ID,
            ORG_ID,
            GROUP_CONCAT(APPROVER_ID ORDER BY LEVEL_NO) AS APPROVAL_LIST
        FROM TC_PROJ_APPROVERS
        GROUP BY PROJ_ID, ORG_ID
    ) AP
       ON P.PROJ_ID = AP.PROJ_ID
      AND P.ORG_ID = AP.ORG_ID
      AND P.HIERARCHY = 'Y'

    WHERE P.PROJ_ID = ?
      AND P.ORG_ID = ?;
  `;

  db.query(sql, [projId, orgId], (err, results) => {
    if (err) {
      console.error("ProjectDetails error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err
      });
    }

    return res.status(200).json({
      success: true,
      data: results
    });
  });
};

module.exports = { ProjectDetails };
