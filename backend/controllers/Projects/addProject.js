const db = require("../../config/db");
const { formatDateToLocal } = require("../../helpers/functions");

const addProject = (req, res) => {
  const {
    projectName,
    startDate,
    endDate,
    projectCode,
    projDesc,
    supportId,
    status,
    clientName,
    billable,
    hierarchyRequired,
    companyId,
    projectManager,
    email,
    hierarchyCustom,
    approvalLevels = [],
  } = req.body;

  console.log("REQ BODY =>", req.body);

  const billableValue = billable || "N";

  const hierarchyValue =
    hierarchyRequired === "yes" ||
    hierarchyRequired === "Y"
      ? "Y"
      : "N";

  const hierarchyCustomValue =
    hierarchyCustom === "Y" ? "Y" : "N";

  //  Get MAX LEVEL approver → Project Manager
  const maxLevelObj = approvalLevels.reduce(
    (max, cur) =>
      cur.levelNo > (max?.levelNo || 0) ? cur : max,
    null
  );

  const pm = maxLevelObj?.approverId || projectManager;

  const now = formatDateToLocal(new Date());

  // ================= DUPLICATE CHECK =================
  const checkSql = `
    SELECT PROJ_ID
    FROM TC_PROJECTS_MASTER
    WHERE ORG_ID = ?
      AND PROJ_CODE = ?
  `;

  db.query(checkSql, [companyId, projectCode], (err, rows) => {
    if (err) {
      console.error("Duplicate check error", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Project code already exists" });
    }

    // ================= NEXT PROJ NO =================
    const projNoSql = `
      SELECT IFNULL(MAX(PROJ_NO), 0) + 1 AS nextProjNo
      FROM TC_PROJECTS_MASTER
      WHERE ORG_ID = ?
    `;

    db.query(projNoSql, [companyId], (err2, result2) => {
      if (err2) {
        console.error("Error fetching proj_no", err2);
        return res.status(500).json({ message: "Server error" });
      }

      const nextProjNo = result2[0].nextProjNo;

      // ================= TRANSACTION =================
      db.beginTransaction((trxErr) => {
        if (trxErr) {
          console.error("Transaction start error", trxErr);
          return res.status(500).json({ message: "Server error" });
        }

        // ================= INSERT PROJECT =================
        const insertProjectSql = `
          INSERT INTO TC_PROJECTS_MASTER
          (
            ORG_ID,
            PROJ_NO,
            PROJ_NAME,
            PROJ_CODE,
            PROJ_DESC,
            START_DATE,
            END_DATE,
            SUPPORT_IDENTIFIER,
            STATUS,
            \`TYPE\`,
            CLIENT_NAME,
            BILLABLE,
            HIERARCHY,
            CREATED_BY,
            NOTES,
            MANAGER_ID
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertProjectSql,
          [
            companyId,
            nextProjNo,
            projectName,
            projectCode,
            projDesc || null,
            startDate,
            endDate,
            supportId || null,
            status,
            hierarchyCustomValue,
            clientName,
            billableValue,
            hierarchyValue,
            email,
          billableValue,
            pm,
          ],
          (projErr, projResult) => {
            if (projErr) {
              return db.rollback(() => {
                console.error(" Project insert error", projErr);
                res
                  .status(500)
                  .json({ message: "Project insert failed" });
              });
            }

            const projectId = projResult.insertId;

            // ================= INSERT APPROVAL LEVELS =================
            if (approvalLevels.length > 0) {
              const insertApprovalSql = `
                INSERT INTO TC_PROJ_APPROVERS
                (
                  ORG_ID,
                  PROJ_ID,
                  LEVEL_NO,
                  EMP_ID,
                  STATUS,
                  START_DATE,
                  CREATED_BY
                )
                VALUES ?
              `;

              const approvalValues = approvalLevels.map(
                (lvl) => [
                  companyId,
                  projectId,
                  lvl.levelNo,
                  lvl.approverId,
                  "A",
                  now,
                  email,
                ]
              );

              db.query(
                insertApprovalSql,
                [approvalValues],
                (appErr) => {
                  if (appErr) {
                    return db.rollback(() => {
                      console.error(
                        "❌ Approval insert error",
                        appErr
                      );
                      res.status(500).json({
                        message:
                          "Approval levels insert failed",
                      });
                    });
                  }

                  return db.commit(() =>
                    res.status(201).json({
                      message:
                        "Project + approval hierarchy created",
                      proj_no: nextProjNo,
                      project_id: projectId,
                      status: 200,
                    })
                  );
                }
              );
            } else {
              return db.commit(() =>
                res.status(201).json({
                  message: "Project created successfully",
                  proj_no: nextProjNo,
                  project_id: projectId,
                  status: 200,
                })
              );
            }
          }
        );
      });
    });
  });
};

module.exports = { addProject };
