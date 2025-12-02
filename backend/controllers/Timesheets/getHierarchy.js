const db = require('../../config/db');

const getHierarchy = (req, res) => {
  const { companyId, projectId, empId } = req.query;


  console.log("companyId hierarchy",companyId);
  console.log("projectId hierarchy",projectId);
  console.log("empId hierarchy",empId);
  

  const checkHierarchy = `
    SELECT HIERARCHY 
    FROM TC_PROJECTS_MASTER
    WHERE ORG_ID = ? AND PROJ_ID = ?
  `;

  db.query(checkHierarchy, [companyId, projectId], (error, result) => {
    if (error) return res.status(500).json({ error: "Database Error", details: error });
    if (!result.length) return res.status(404).json({ error: "Project not found" });

    const hierarchyFlag = result[0].HIERARCHY;

    // CASE 1: HIERARCHY = YES  (TC_PROJ_HIER_LIST)
    
    if (hierarchyFlag === "YES") {

      const loginEmp = `
        SELECT COUNT(APPROVER_ID) AS EMPCOUNT
        FROM TC_PROJ_HIER_LIST
        WHERE PROJ_ID = ? AND ORG_ID = ? AND APPROVER_ID = ?
      `;

      db.query(loginEmp, [projectId, companyId, empId], (loginEmpError, loginEmpResult) => {
        if (loginEmpError) {
          return res.status(500).json({ error: "Database Error", details: loginEmpError });
        }

        const empPresent = loginEmpResult[0].EMPCOUNT;

        console.log("empPresent",empPresent);
        

        // ---------------- EMPLOYEE PRESENT IN HIERARCHY ----------------
if (empPresent > 0) {

  const empLineSql = `
  SELECT 
  LINE_NO
  FROM TC_PROJ_HIER_LIST
  WHERE PROJ_ID = ?
    AND ORG_ID = ?
    AND CAST(APPROVER_ID AS CHAR) = CAST(? AS CHAR)
`;

  db.query(empLineSql, [projectId, companyId, empId], (err, lineRows) => {
    if (err) return res.status(500).json({ error: "Database Error", details: err });

    const empLine = lineRows[0].LINE_NO;

    console.log("empLine",empLine);
    console.log("empLine",Number(empLine)+1);
    

    const nextLevelSql = `
      SELECT APPROVER_ID 
      FROM TC_PROJ_HIER_LIST
      WHERE PROJ_ID = ?
        AND ORG_ID = ?
        AND LINE_NO = ?
    `;

    db.query(nextLevelSql, [projectId, companyId, empLine+1], (err2, nextRows) => {
      if (err2) return res.status(500).json({ error: "Database Error", details: err2 });


      console.log("nextLevelSal",nextLevelSql);
      

      let nextApprover;
      console.log("nextRows",nextRows);
      

      if (nextRows.length > 0) {
        nextApprover = nextRows[0].APPROVER_ID;
      } 
      else {
        nextApprover = empId;
      }


      return res.status(200).json({
        hasHierarchy: true,
        isCurrentApproverInHierarchy: true,
        levels: [
          {
            level: 1,
            approverId: nextApprover
          }
        ]
      });
    });
  });

  return;
}




        // ---------------- EMPLOYEE NOT IN HIERARCHY ----------------
        else {
          const sql = `
            SELECT APPROVER_ID, LINE_NO
            FROM TC_PROJ_HIER_LIST
            WHERE PROJ_ID = ? AND ORG_ID = ?
            ORDER BY LINE_NO ASC
          `;

          db.query(sql, [projectId, companyId], (error, rows) => {
            if (error) {
              return res.status(500).json({ error: "Database Error", details: error });
            }

            return res.status(200).json({
              hasHierarchy: true,
              isCurrentApproverInHierarchy: false,
              levels: rows.map(r => ({
                level: r.LINE_NO,
                approverId: r.APPROVER_ID
              }))
            });
          });
        }
      });

      return; // IMPORTANT: prevent fallthrough
    }

    // ---------------------------------------------------------
    // CASE 2: HIERARCHY = NO (TC_PROJECTS_ASSIGNEES)
    // ---------------------------------------------------------
    const sql = `
      SELECT EMP_ID 
      FROM TC_PROJECTS_ASSIGNEES
      WHERE PROJ_ID = ? AND ORG_ID = ? AND TS_APPROVE_ACCESS = 1
    `;

    db.query(sql, [projectId, companyId], (error, rows) => {
      if (error) {
        return res.status(500).json({ error: "Database Error", details: error });
      }

      return res.status(200).json({
        hasHierarchy: false,
        levels: rows.map((r, index) => ({
          level: index + 1,
          approverId: r.EMP_ID
        }))
      });
    });
  });
};

module.exports = { getHierarchy };
