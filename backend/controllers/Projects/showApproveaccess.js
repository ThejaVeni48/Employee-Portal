// API: Show Approve Button Based on Approver Rules

const db = require("../../config/db");

const showApproveAccess = (req, res) => {
  const { empId, companyId, currentDate } = req.query;


  console.log("empId",empId);
  console.log("empId",typeof(empId));
  

  if (!empId || !companyId || !currentDate) {
    return res.status(400).json({
      message: "Missing required parameters",
    });
  }

  // --------------------------------------------------
  // CASE 1: NON-HIERARCHY APPROVER
  // --------------------------------------------------
  const sqlNonHierarchy = `
    SELECT 1
    FROM TC_PROJECTS_ASSIGNEES PA
    JOIN TC_USERS U
      ON U.EMP_ID = PA.EMP_ID
     AND U.ORG_ID = PA.ORG_ID
    JOIN TC_PROJECTS_MASTER P
      ON P.PROJ_ID = PA.PROJ_ID
     AND P.ORG_ID = PA.ORG_ID
    WHERE
      U.STATUS = 'A'
      AND PA.EMP_ID = ?
      AND PA.ORG_ID = ?
      AND PA.TS_APPROVE_ACCESS = 1
      AND ? BETWEEN P.START_DATE AND P.END_DATE
    LIMIT 1
  `;

  db.query(
    sqlNonHierarchy,
    [empId, companyId, currentDate],
    (err, result) => {
      if (err) {
        console.error("Non-hierarchy error:", err);
        return res.status(500).json({ error: err });
      }

      console.log("non hierrachy case",result);
      

      // Non-hierarchy access found
      if (result.length > 0) {
        return res.status(200).json({
          canApprove: true,
          source: "NON_HIERARCHY",
        });
      }

      // --------------------------------------------------
      // CASE 2: HIERARCHY APPROVER
      // --------------------------------------------------
      const sqlHierarchy = `
        SELECT 1
        FROM TC_PROJECTS_ASSIGNEES PA
        JOIN TC_PROJECTS_MASTER P
          ON P.PROJ_ID = PA.PROJ_ID
         AND P.ORG_ID = PA.ORG_ID
        JOIN TC_PROJ_HIER_LIST PH
          ON PH.PROJ_ID = PA.PROJ_ID
         AND PH.ORG_ID = PA.ORG_ID
        JOIN TC_USERS U
          ON U.EMP_ID = PA.EMP_ID
         AND U.ORG_ID = PA.ORG_ID
        WHERE
          PA.EMP_ID = ?
          AND PA.ORG_ID = ?
          AND ? BETWEEN P.START_DATE AND P.END_DATE
          AND P.HIERARCHY = 'Y'
          AND PH.APPROVER_ID = ?
        LIMIT 1
      `;

      db.query(
        sqlHierarchy,
        [empId, companyId, currentDate,empId],
        (err2, result2) => {
          if (err2) {
            console.error("Hierarchy error:", err2);
            return res.status(500).json({ error: err2 });
          }

          console.log("hierarchy case",result2);
          
          // Hierarchy access found
          if (result2.length > 0) {
            return res.status(200).json({
              canApprove: true,
              source: "HIERARCHY",
            });
          }

          // No approval access
          return res.status(200).json({
            canApprove: false,
          });
        }
      );
    }
  );
};

module.exports = { showApproveAccess };
