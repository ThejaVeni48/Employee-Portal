const approvalHierarchy = async ({
  projId,
  orgId,
  empId,
  approvalLevels,
  createdBy,
  connection,
}) => {
  
  
  console.log("CUSTOM HIERARCHY INPUT =>", {
    projId,
    orgId,
    empId,
    approvalLevels,
  });

  if (
    !projId ||
    !orgId ||
    !empId ||
    !Array.isArray(approvalLevels) ||
    approvalLevels.length === 0
  ) {
    throw new Error("Missing required hierarchy data");
  }

  const creationDate = new Date();

  // ============================
  // 1️⃣ Generate PROJ_HIER_NO
  // ============================

  const hierNoSql = `
    SELECT IFNULL(MAX(PROJ_HIER_NO),0) + 1 AS nextHierNo
    FROM TC_PROJ_HIER_LIST
    WHERE ORG_ID = ? AND PROJ_ID = ?
  `;

  const hierRes = await new Promise((resolve, reject) => {
    connection.query(hierNoSql, [orgId, projId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  console.log("approveLvels",approvalLevels);
  

  const nextHierNo = hierRes[0].nextHierNo;

  // ============================
  // 2️⃣ Prepare Insert Rows
  // ============================

  const values = approvalLevels.map((lvl) => [
    projId,
    orgId,
    empId,
    lvl.empId,
    lvl.levelNo,
    "A",
    creationDate,
    createdBy,
    nextHierNo,
  ]);

  const insertSql = `
    INSERT INTO TC_PROJ_HIER_LIST
    (
      PROJ_ID,
      ORG_ID,
      EMP_ID,
      APPROVER_ID,
      LEVEL_NO,
      STATUS,
      CREATION_DATE,
      CREATED_BY,
      PROJ_HIER_NO
    )
    VALUES ?
  `;

  await new Promise((resolve, reject) => {
    connection.query(insertSql, [values], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  console.log("✅ Custom hierarchy inserted:", nextHierNo);

  return {
    projHierNo: nextHierNo,
    inserted: values.length,
  };
};

module.exports = { approvalHierarchy };
