const { formatDateToLocal } = require("../../helpers/functions");

const hierarchyforAll = async ({
  projId,
  orgId,
  selectedEmp,
  email,
  connection,
}) => {
  console.log("Apply-for-all hierarchy for:", selectedEmp);

  const status = "A";
  const today = formatDateToLocal(new Date());

  // ======================================================
  // STEP 0 — Existing hierarchy for employee
  // ======================================================

  const existingSql = `
    SELECT LEVEL_NO
    FROM TC_PROJ_HIER_LIST
    WHERE ORG_ID = ?
      AND PROJ_ID = ?
      AND EMP_ID = ?
  `;

  const existingRows = await new Promise((resolve, reject) => {
    connection.query(
      existingSql,
      [orgId, projId, selectedEmp],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });

  const existingLevels = new Set(
    existingRows.map((r) => Number(r.LEVEL_NO))
  );

  // ======================================================
  // STEP 1 — Fetch project approvers
  // ======================================================

  const getApproversSql = `
    SELECT EMP_ID AS emp_id, LEVEL_NO
    FROM TC_PROJ_APPROVERS
    WHERE PROJ_ID = ?
      AND ORG_ID = ?
      AND STATUS = 'A'
    ORDER BY LEVEL_NO
  `;

  const approverResult = await new Promise((resolve, reject) => {
    connection.query(getApproversSql, [projId, orgId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  if (!approverResult.length) {
    console.log(" No project approvers defined");
    return;
  }

  // ======================================================
  // STEP 2 — Is employee an approver?
  // ======================================================

  const empRow = approverResult.filter(
    (u) => String(u.emp_id) === String(selectedEmp)
  );

  // ======================================================
  // CASE 1 — Employee NOT approver → full hierarchy
  // ======================================================

  if (empRow.length === 0) {
    console.log("New employee → assigning all levels");

    const values = approverResult
      .filter((lvl) => !existingLevels.has(Number(lvl.LEVEL_NO)))
      .map((lvl) => [
        orgId,
        projId,
        selectedEmp,
        lvl.LEVEL_NO,
        lvl.emp_id,
        status,
        today,
        email,
      ]);

    if (!values.length) return;

    const insertSql = `
      INSERT INTO TC_PROJ_HIER_LIST
      (
        ORG_ID,
        PROJ_ID,
        EMP_ID,
        LEVEL_NO,
        APPROVER_ID,
        STATUS,
        START_DATE,
        CREATED_BY
      )
      VALUES ?
    `;

    await new Promise((resolve, reject) => {
      connection.query(insertSql, [values], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return;
  }

  // ======================================================
  // STEP 3 — Higher levels than employee
  // ======================================================

  const fetchLevelsSql = `
    SELECT EMP_ID AS emp_id, LEVEL_NO
    FROM TC_PROJ_APPROVERS
    WHERE ORG_ID = ?
      AND PROJ_ID = ?
      AND LEVEL_NO >
        (
          SELECT MAX(LEVEL_NO)
          FROM TC_PROJ_APPROVERS
          WHERE EMP_ID = ?
            AND PROJ_ID = ?
            AND ORG_ID = ?
        )
    ORDER BY LEVEL_NO
  `;

  const higherLevels = await new Promise((resolve, reject) => {
    connection.query(
      fetchLevelsSql,
      [orgId, projId, selectedEmp, projId, orgId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });



 // ================= CASE 2 — employee approver → rebase levels =================

if (higherLevels.length > 0) {
  console.log("Employee approver → assigning higher levels");

  const empMaxLevel = Math.max(
    ...empRow.map((r) => Number(r.LEVEL_NO))
  );

  const values = higherLevels
    .map((lvl) => [
      orgId,
      projId,
      selectedEmp,

      // 🔥 REBASE LEVEL
      lvl.LEVEL_NO - empMaxLevel,

      lvl.emp_id,
      status,
      today,
      email,
    ]);

  const insertSql = `
    INSERT INTO TC_PROJ_HIER_LIST
    (
      ORG_ID,
      PROJ_ID,
      EMP_ID,
      LEVEL_NO,
      APPROVER_ID,
      STATUS,
      START_DATE,
      CREATED_BY
    )
    VALUES ?
  `;

  await new Promise((resolve, reject) => {
    connection.query(insertSql, [values], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  return;
}


  // ====================================================== CASE 3 — Final approver → self approval ======================================================

  console.log("Final approver → self");

  const empMaxLevel = Math.max(
    ...empRow.map((r) => Number(r.LEVEL_NO))
  );

  const selfLevel = empMaxLevel + 1;

  if (!existingLevels.has(selfLevel)) {
    const selfSql = `
      INSERT INTO TC_PROJ_HIER_LIST
      (
        ORG_ID,
        PROJ_ID,
        EMP_ID,
        LEVEL_NO,
        APPROVER_ID,
        STATUS,
        START_DATE,
        CREATED_BY
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      connection.query(
        selfSql,
        [
          orgId,
          projId,
          selectedEmp,
          selfLevel - empMaxLevel,
          selectedEmp,
          status,
          today,
          email,
        ],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  console.log("Hierarchy done for", selectedEmp);
};

module.exports = { hierarchyforAll };
