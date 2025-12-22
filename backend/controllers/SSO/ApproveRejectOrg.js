const db = require("../../config/db");
const moment = require("moment");
const { generatePassword } = require("../../helpers/functions");

const ApproveRejectOrg = (req, res) => {
  const { companyId, status, userId } = req.body;

  const today = moment().format("YYYY-MM-DD");
  const endDate = moment(today).add(30, "days").format("YYYY-MM-DD");
  const password = generatePassword();
  const logins = 0;

  if (status === "A") {
    const updateSql = `
      UPDATE TC_ORG_REGISTRATIONS
      SET STATUS = ?, START_DATE = ?, END_DATE = ?, PASSWORD = ?,
          APPROVED_DATE = ?, AUTHORIZED_BY = ?, ATTEMPTS_LOGIN = ?
      WHERE ORG_ID = ?
    `;

    db.query(
      updateSql,
      [status, today, endDate, password, today, userId, logins, companyId],
      (approveError, approveResult) => {
        if (approveError) {
          console.log("error Aprove",approveError);
          
          return res.status(500).json({ data: approveError });
        }

        const system = "SYSTEM";

        // Insert Roles
        const insertRolesSql = `
          INSERT INTO TC_ORG_ROLES 
          (ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, CREATED_BY, CREATION_DATE, ORG_ID)
          SELECT ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, ?, ?, ?
          FROM GA_ROLES
        `;

        db.query(
          insertRolesSql,
          [system, today, companyId],
          (insertRolesError, insertRolesResult) => {
            if (insertRolesError) {
              return res.status(500).json({ data: insertRolesError });
            }

            // Insert Designations
            const insertDesgnSql = `
              INSERT INTO TC_ORG_DESIGNATIONS
              (DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS, ROLE_ID, CREATED_BY, CREATION_DATE, ORG_ID)
              SELECT DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS, ROLE_ID, ?, ?, ?
              FROM GA_Designations
            `;

            db.query(
              insertDesgnSql,
              [system, today, companyId],
              (insertDesgnError, insertDesgnResult) => {
                if (insertDesgnError) {
                  return res.status(500).json({ data: insertDesgnError });
                }

                // Insert Jobs / Access Controls
                const insertJobSql = `
                  INSERT INTO TC_ORG_ACCESS
                  (ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, CREATED_BY, CREATION_DATE, ORG_ID)
                  SELECT ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, ?, ?, ?
                  FROM GA_Access_Control
                `;

                db.query(
                  insertJobSql,
                  [system, today, companyId],
                  (insertJobError, insertJobResult) => {
                    if (insertJobError) {
                      return res.status(500).json({ data: insertJobError });
                    }

                    // Insert Leaves
                    const insertLeavesSql = `
                      INSERT INTO TC_ORG_LEAVES
                      (LEAVE_TYPE, LEAVE_CODE, LEAVE_DESC, LEAVE_STATUS, CREATED_BY, CREATION_DATE, ORG_ID)
                      SELECT LEAVE_TYPE, LEAVE_CODE, LEAVE_DESC, LEAVE_STATUS, ?, ?, ?
                      FROM GA_LEAVES
                    `;

                    db.query(
                      insertLeavesSql,
                      [system, today, companyId],
                      (insertLeaveError, insertLeaveResult) => {
                        if (insertLeaveError) {
                          return res.status(500).json({ data: insertLeaveError });
                        }

                        // Generate 10 weeks
                        const startOfWeek = moment()
                          .startOf("week")
                          .add(1, "days")
                          .subtract(2, "weeks");

                        let weekInsertSql = `
                          INSERT INTO TC_MASTER (ORG_ID, WEEK_START, WEEK_END, CREATION_DATE, CREATED_BY)
                          VALUES (?, ?, ?, ?, ?)
                        `;

                        for (let i = 0; i < 10; i++) {
                          let weekStart = moment(startOfWeek)
                            .add(i, "weeks")
                            .format("YYYY-MM-DD");
                          let weekEnd = moment(weekStart)
                            .add(6, "days")
                            .format("YYYY-MM-DD");

                          db.query(
                            weekInsertSql,
                            [companyId, weekStart, weekEnd, today, system],
                            (weekErr) => {
                              if (weekErr) console.log("Week Insert Error", weekErr);
                            }
                          );
                        }

                        return res.status(200).json({
                          message:
                            "Organization approved successfully. Roles, designations, jobs, leaves, and weeks inserted.",
                          details: {
                            approveResult,
                            insertRolesResult,
                            insertDesgnResult,
                            insertJobResult,
                            insertLeaveResult,
                          },
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  if (status === "R") {
    const updateSql = `
      UPDATE TC_ORG_REGISTRATIONS
      SET STATUS = ?, APPROVER_DATE = ?, A_R_BY = ?
      WHERE ORG_ID = ?
    `;

    db.query(
      updateSql,
      [status, today, userId, companyId],
      (RejectError, RejectResult) => {
        if (RejectError) {
          return res.status(500).json({ data: RejectError });
        }

        return res.status(200).json({
          message: "Organization rejected successfully",
          data: RejectResult,
        });
      }
    );
  }
};

module.exports = { ApproveRejectOrg };
