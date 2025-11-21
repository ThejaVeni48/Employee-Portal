const db = require("../../config/db");
const moment = require("moment");
const { generatePassword } = require("../../helpers/functions");

const ApproveRejectOrg = (req, res) => {
  const { companyId, status, userId } = req.body;


  console.log("companyId",companyId);
  

  const today = moment().format("YYYY-MM-DD");
  const endDate = moment(today).add(30, "days").format("YYYY-MM-DD");

  const password = generatePassword();
  const logins = 0;

  // Approval Logic
  if (status === "A") {
    const updateSql = `
      UPDATE TC_ORG_REGISTRATIONS
      SET STATUS = ?, START_DATE = ?, END_DATE = ?, PASSWORD = ?,
          APPROVER_DATE = ?, A_R_BY = ?, ATTEMPTS_LOGIN = ?
      WHERE ORG_ID = ?
    `;

    db.query(
      updateSql,
      [status, today, endDate, password, today, userId, logins, companyId],
      (approveError, approveResult) => {
        if (approveError) {
          console.log("Approve Error", approveError);
          return res.status(500).json({ data: approveError });
        }

        console.log("Approve Result", approveResult);

        const system = "SYSTEM";

        // Insert ROLES
        const insertRolesSql = `
          INSERT INTO TC_ORG_ROLES 
          (ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, CREATED_BY, CREATION_DATE, ORG_ID)
          SELECT ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, ?, ?, ?
          FROM SSO_ROLES
        `;

        db.query(
          insertRolesSql,
          [system, today, companyId],
          (insertRolesError, insertRolesResult) => {
            if (insertRolesError) {
              console.log("Insert Roles Error", insertRolesError);
              return res.status(500).json({ data: insertRolesError });
            }

            console.log("Roles Insert Result", insertRolesResult);

            // Insert DESIGNATIONS
            const insertDesgnSql = `
              INSERT INTO TC_ORG_DESIGNATIONS
              (DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS,ROLE_ID, CREATED_BY, CREATION_DATE, ORG_ID)
              SELECT DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS,ROLE_ID, ?, ?, ?
              FROM SSO_DESIGNATIONS
            `;

            db.query(
              insertDesgnSql,
              [system, today, companyId],
              (insertDesgnError, insertDesgnResult) => {
                if (insertDesgnError) {
                  console.log("Insert Designations Error", insertDesgnError);
                  return res.status(500).json({ data: insertDesgnError });
                }

                console.log("Designations Insert Result", insertDesgnResult);

                // Insert JOBS
                const insertJobSql = `
                  INSERT INTO TC_ORG_ACCESS
                  (ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, CREATED_BY, CREATION_DATE, ORG_ID)
                  SELECT ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, ?, ?, ?
                  FROM SSO_ACCESS_CONTROL
                `;

                db.query(
                  insertJobSql,
                  [system, today, companyId],
                  (insertJobError, insertJobResult) => {
                    if (insertJobError) {
                      console.log("Insert Jobs Error", insertJobError);
                      return res.status(500).json({ data: insertJobError });
                    }

                    console.log("Jobs Insert Result", insertJobResult);

                    return res.status(200).json({
                      message:
                        "Organization approved successfully. Roles, designations, and jobs inserted.",
                      details: {
                        approveResult,
                        insertRolesResult,
                        insertDesgnResult,
                        insertJobResult,
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

  // Reject Logic
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
          console.log("Reject Error", RejectError);
          return res.status(500).json({ data: RejectError });
        }

        console.log("Reject Result", RejectResult);

        return res.status(200).json({
          message: "Organization rejected successfully",
          data: RejectResult,
        });
      }
    );
  }
};

module.exports = { ApproveRejectOrg };
