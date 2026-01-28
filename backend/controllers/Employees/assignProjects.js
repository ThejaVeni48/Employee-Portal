const db = require("../../config/db");
const { approvalHierarchy } = require("../Projects/addApprovalHierarchy");
const { hierarchyforAll } = require("../Projects/HierarchyForAll");

const assignProject = (req, res) => {
  const {
    orgId,
    selectedEmp,
    startDate,
    contractStart,
    contractEnd,
    isActive,
    selectedRole,
    selectedDesgn,
    approveAccess,
    projId,
    email,
    hierarchyCustom,
    Hierachy,
    approvalLevels
  } = req.body;

  console.log("ASSIGN REQ BODY =>", req.body);

  const checkDupSql = `
    SELECT 1
    FROM TC_PROJECTS_ASSIGNEES
    WHERE ORG_ID = ?
      AND PROJ_ID = ?
      AND EMP_ID = ?
      AND STATUS = 'A'
  `;

  db.query(checkDupSql, [orgId, projId, selectedEmp], (dupErr, dupRows) => {
    if (dupErr) {
      return res.status(500).json({ message: "Server error" });
    }

    if (dupRows.length) {
      return res.status(400).json({
        message: "Employee already assigned",
        status:400
      });
    }

    // ================= TRANSACTION =================
    db.beginTransaction((trxErr) => {
      if (trxErr) {
        return res.status(500).json({ message: "Server error" });
      }

      const getAssignNoSql = `
        SELECT IFNULL(MAX(PROJ_ASSIGN_NO),0)+1 AS nextAssignNo
        FROM TC_PROJECTS_ASSIGNEES
        WHERE ORG_ID=? AND PROJ_ID=?
      `;

      db.query(getAssignNoSql, [orgId, projId], (noErr, noRes) => {
        if (noErr) {
          return db.rollback(() =>
            res.status(500).json({ message: "Server error" })
          );
        }

        const nextAssignNo = noRes[0].nextAssignNo;

        // ================= INSERT ASSIGNEE =================

        const insertSql = `
          INSERT INTO TC_PROJECTS_ASSIGNEES
          (
            PROJ_ID,
            ORG_ID,
            EMP_ID,
            START_DATE,
            CONTRACT_STARTDATE,
            CONTRACT_ENDDATE,
            STATUS,
            ROLE_CODE,
            DESGN_CODE,
            TS_APPROVE_ACCESS,
            CREATED_BY,
            PROJ_ASSIGN_NO
          )
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        db.query(
          insertSql,
          [
            projId,
            orgId,
            selectedEmp,
            startDate,
            contractStart,
            contractEnd,
            isActive ? "A" : "I",
            selectedRole,
            selectedDesgn,
            approveAccess ? "Y" : "N",
            email,
            nextAssignNo,
          ],
          async (insErr) => {
            if (insErr) {
              return db.rollback(() =>
                res.status(500).json({ message: "Assignment insert failed" })
              );
            }

            try {
              // ================= MANAGER UPDATE =================
              if (approveAccess && Hierachy === "N") {
                await new Promise((resolve, reject) => {
                  db.query(
                    `
                    UPDATE TC_PROJECTS_MASTER
                    SET MANAGER_ID=?
                    WHERE PROJ_ID=? AND ORG_ID=?
                  `,
                    [selectedEmp, projId, orgId],
                    (e) => (e ? reject(e) : resolve())
                  );
                });
              }

              // ================= HIERARCHY =================
              if (hierarchyCustom === "Y") {
                await approvalHierarchy({
                  projId,
                  orgId,
                  empId: selectedEmp,
                  email,
                  connection: db,
                  approvalLevels
                });
                // console.log("sdfghj");
                
              }

              if (hierarchyCustom === "N") {
                await hierarchyforAll({
                  projId,
                  orgId,
                  selectedEmp,
                  email,
                  connection: db,
                });
              }

              // ================= COMMIT =================
              db.commit(() => {
                return res.status(200).json({
                  message: "Assignment created successfully",
                  proj_assign_no: nextAssignNo,
                });
              });
            } catch (err) {
              console.error("Hierarchy/Manager error:", err);
              return db.rollback(() =>
                res.status(500).json({ message: "Hierarchy failed" })
              );
            }
          }
        );
      });
    });
  });
};

module.exports = { assignProject };
