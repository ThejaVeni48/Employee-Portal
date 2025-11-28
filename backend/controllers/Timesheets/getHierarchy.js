const db = require('../../config/db');

const getHierarchy = (req, res) => {
  const { companyId, projectId } = req.query;

//    Check if project has hierarchy enabled
  const checkHierarchy = `
    SELECT HIERARCHY 
    FROM TC_PROJECTS_MASTER
    WHERE ORG_ID = ? AND PROJ_ID = ?
  `;

  db.query(checkHierarchy, [companyId, projectId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Database Error", details: error });
    }

    if (!result.length) {
      return res.status(404).json({ error: "Project not found" });
    }

    const hierarchyFlag = result[0].HIERARCHY;

    // ------------------ CASE 1: HIERARCHY = YES → fetch from TC_PROJ_HIER_LIST ----------------
    if (hierarchyFlag === "YES") {
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
          levels: rows.map(r => ({
            level: r.LINE_NO,           
            approverId: r.APPROVER_ID   
          }))
        });
      });
    }

    // ---------------------CASE 2: HIERARCHY = NO → fetch direct approver from TC_PROJECTS_ASSIGNEES --------------
    else {
      const sql = `
        SELECT EMP_ID 
        FROM TC_PROJECTS_ASSIGNEES
        WHERE PROJ_ID = ?
        AND ORG_ID = ?
        AND TS_APPROVE_ACCESS = 1
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
    }
  });
};

module.exports = { getHierarchy };
