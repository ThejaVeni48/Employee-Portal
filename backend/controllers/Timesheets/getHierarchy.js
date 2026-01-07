const db = require('../../config/db');

const getHierarchy = (req, res) => {
  const { companyId, projectId, empId } = req.query;


  console.log("COMPANYiD get Hierarhcy",companyId);
  console.log("projectId get Hierarhcy",projectId);
  console.log("empId get Hierarhcy",empId);
  
  console.log("empId type",typeof(empId));
  

  // 1. Check if hierarchy is enabled
  const checkHierarchy = `
    SELECT HIERARCHY 
    FROM TC_PROJECTS_MASTER
    WHERE ORG_ID = ? AND PROJ_ID = ?
  `;

  db.query(checkHierarchy, [companyId, projectId], (error, result) => {
    if (error) return res.status(500).json({ error });

    const hierarchyFlag = result[0].HIERARCHY;

    console.log("hierarchyFlag",hierarchyFlag);
    



    // CASE 1: HIERARCHY = YES
    if (hierarchyFlag === "Y") {

      const sql = `
        SELECT APPROVER_ID, LINE_NO
        FROM TC_PROJ_HIER_LIST
        WHERE PROJ_ID = ? AND ORG_ID = ? AND EMP_ID = ?
        ORDER BY LINE_NO ASC
      `;

      db.query(sql, [projectId, companyId, empId], (err, rows) => {
        if (err) return res.status(500).json({ error: err });

        console.log("ROWS",rows);
        

        if (rows.length === 0) {
          return res.status(200).json({
            hasHierarchy: true,
            isCurrentApproverInHierarchy: false,
            levels: []
          });
        }

        return res.status(200).json({
          hasHierarchy: true,
          isCurrentApproverInHierarchy: true,
          levels: rows.map(r => ({
            level: r.LINE_NO,
            approverId: r.APPROVER_ID
          }))
        });
      });

      return;
    }

    // --------------------------
    // CASE 2: HIERARCHY = NO
    // --------------------------
    const noHierSql = `
      SELECT EMP_ID 
      FROM TC_PROJECTS_ASSIGNEES
      WHERE PROJ_ID = ? AND ORG_ID = ? AND TS_APPROVE_ACCESS = 1
    `;

    db.query(noHierSql, [projectId, companyId], (err, rows) => {
      if (err) return res.status(500).json({ error: err });

      return res.status(200).json({
        hasHierarchy: false,
        levels: rows.map((r, i) => ({
          level: i + 1,
          approverId: r.EMP_ID
        }))
      });
    });
  });
};

module.exports = { getHierarchy };



// hasHierarchy
// : 
// true
// isCurrentApproverInHierarchy
// : 
// true
// levels
// : 
// Array(1)
// 0
// : 
// {level: '2', approverId: '2'}