
// this api is used for defining the hierarchy of the project if hierarchy is enabled



const db = require('../../config/db');

const approvalHierarchy = (req, res) => {
  const { projectId, orgId, empId, levels, createdBy } = req.body;

  console.log("projectId", projectId);
  console.log("orgId", orgId);
  console.log("empId", empId);
  console.log("levels", levels);
  console.log("createdBy", createdBy);

  if (!projectId || !orgId || !empId || !levels || levels.length === 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const creationDate = new Date();

  // Step 1: Generate next PROJ_HIER_NO per project per company
  const hierNoSql = `
    SELECT IFNULL(MAX(PROJ_HIER_NO), 0) + 1 AS nextHierNo
    FROM TC_PROJ_HIER_LIST
    WHERE ORG_ID = ? AND PROJ_ID = ?
  `;

  db.query(hierNoSql, [orgId, projectId], (errHier, hierResult) => {
    if (errHier) {
      console.error("Error generating PROJ_HIER_NO:", errHier);
      return res.status(500).json({ message: "Server error" });
    }

    const nextHierNo = hierResult[0].nextHierNo;
    console.log("Generated PROJ_HIER_NO:", nextHierNo);

    // Step 2: Prepare values for bulk insert
    let values = [];
    levels.forEach((level, index) => {
      level.name.forEach((approver) => {
        values.push([
          projectId,
          orgId,
          empId,
          approver,
          index + 1,    // LINE_NO
          "A",          // STATUS
          creationDate,
          createdBy,
          nextHierNo    // PROJ_HIER_NO
        ]);
      });
    });

    const insertQuery = `
      INSERT INTO TC_PROJ_HIER_LIST (
        PROJ_ID, ORG_ID, EMP_ID, APPROVER_ID, LINE_NO, STATUS, 
        CREATION_DATE, CREATED_BY, PROJ_HIER_NO
      )
      VALUES ?
    `;

    db.query(insertQuery, [values], (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ message: "Failed to save hierarchy" });
      }
      res.status(200).json({
        message: "Hierarchy saved successfully",
        insertedRows: result.affectedRows,
        proj_hier_no: nextHierNo
      });
    });
  });
};

module.exports = { approvalHierarchy };
