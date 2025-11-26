// API: Show Approve Button Based on Approver Rules

const db = require("../../config/db");

const showApproveAccess = (req, res) => {
  const { empId, companyId, currentDate } = req.query;

  // -------------------------------------------
  // CASE 1: HIERARCHY = NO  (Simple approver)
  // -------------------------------------------

  const sqlNonHierarchy = `
      SELECT DISTINCT 1
      FROM TC_PROJECTS_ASSIGNEES PA
      JOIN TC_USERS U 
          ON U.EMP_ID = PA.EMP_ID AND U.ORG_ID = PA.ORG_ID
      JOIN TC_PROJECTS_MASTER P 
          ON P.PROJ_ID = PA.PROJ_ID AND P.ORG_ID = PA.ORG_ID
      WHERE 
          U.STATUS = 'A'
          AND PA.EMP_ID = ?
          AND PA.ORG_ID = ?
          AND PA.TS_APPROVE_ACCESS = 1
          AND ? BETWEEN P.START_DATE AND P.END_DATE
  `;

  db.query(sqlNonHierarchy, [empId, companyId, currentDate], (err, result) => {
    if (err) 

                    //   console.log("error coocured 31",err)

        return res.status(500).json({ error: err });

    // If normal approver found → return success
    if (result.length > 0) {
                      console.log("result coocured 31",result)
        
      return res.status(200).json({ canApprove: true, source: "NON_HIERARCHY" });
    }

    // -------------------------------------------
    // CASE 2: HIERARCHY = YES
    // -------------------------------------------

    const sqlHierarchy = `
        SELECT DISTINCT 1
        FROM TC_PROJECTS_ASSIGNEES PA
        JOIN TC_PROJECTS_MASTER P 
            ON P.PROJ_ID = PA.PROJ_ID AND P.ORG_ID = PA.ORG_ID
        JOIN TC_PROJ_HIER_LIST PH
            ON PH.PROJ_ID = PA.PROJ_ID AND PH.ORG_ID = PA.ORG_ID
        JOIN TC_USERS U
            ON U.EMP_ID = PA.EMP_ID AND U.ORG_ID = PA.ORG_ID
        WHERE 
            PA.EMP_ID = ?
            AND PA.ORG_ID = ?
            AND ? BETWEEN P.START_DATE AND P.END_DATE
            AND P.HIERARCHY = 'YES'
            AND PH.APPROVER_ID = PA.EMP_ID
            
    `;

    db.query(sqlHierarchy, [empId, companyId, currentDate], (err2, result2) => {
      if (err2)
            //   console.log("error coocured 70",err2)

        return res.status(500).json({ error: err2 });

                      console.log("result2 coocured 70",result2)

      if (result2.length > 0) {
        return res.status(200).json({ canApprove: true, source: "HIERARCHY" });
      }

      // If no access in either case
      return res.status(200).json({ canApprove: false });
    });
  });
};

module.exports = { showApproveAccess };
