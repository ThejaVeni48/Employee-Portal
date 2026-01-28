const db = require("../../config/db");
const { generatePassword } = require("../../helpers/functions");

const addSuperUser = (req, res) => {
  const {
    firstName,
    lastName,
    middleName,
    empId,
    email,
    contactno,
    startDate,
    branchId,
    orgId,
    createdBy,
    status = "A",
  } = req.body;

  const password = generatePassword();

  console.log("REQ BODY:", req.body);

  if (!firstName || !empId || !email || !branchId || !orgId) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }

  // 🔍 Check duplicates first (outside transaction is fine)
  db.query(
    `
  SELECT USER_ID
  FROM TC_USERS
  WHERE (EMAIL = ? OR EMP_ID = ?)
    AND ORG_ID = ?
  `,
    [email, empId,orgId],
    (dupErr, existing) => {
      if (dupErr) {
        console.error(dupErr);
        return res.status(500).json({
          message: "Duplicate check failed",
        });
      }

      if (existing.length > 0) {
        return res.status(409).json({
          message: "User with email or employee ID already exists",
        });
      }

      // ✅ Start transaction
      db.beginTransaction((txErr) => {
        if (txErr) {
          console.error(txErr);
          return res.status(500).json({
            message: "Transaction start failed",
          });
        }

        // 1️⃣ Insert into TC_USERS
        const insertUserSql = `
          INSERT INTO TC_USERS
          (
            FIRST_NAME,
            LAST_NAME,
            MIDDLE_NAME,
            DISPLAY_NAME,
            ORG_ID,
            PASSWORD,
            BRANCH_ID,
            EMP_ID,
            EMAIL,
            MOBILE_NUMBER,
            STATUS,
            ATTEMPTS_LOGIN,
            START_DATE,
            CREATED_BY
          )
          VALUES (?, ?, ?,?, ?, ?, ?,?, ?, ?, ?, 0, ?, ?)
        `;

        const displayName = `${firstName} ${lastName || ""}`.trim();

        db.query(
          insertUserSql,
          [
            firstName,
            lastName,
            middleName,
            displayName,
            orgId,
            password,
            branchId,
            empId,
            email,
            contactno,
            status,
            startDate,
            createdBy,
          ],
          (userErr, userRes) => {
            if (userErr) {
              console.error(userErr);
              return db.rollback(() =>
                res.status(500).json({
                  message: "Failed to insert user",
                })
              );
            }

            // const userId = userRes.insertId; // if needed later

            // 2️⃣ Insert into TC_ORG_USER_ASSIGNMENT
            const insertAssignSql = `
              INSERT INTO TC_ORG_USER_ASSIGNMENT
              (
                EMP_ID,
                ORG_ID,
                BRANCH_ID,
                ROLE_CODE,
                DESGN_CODE,
                STATUS,
                START_DATE,
                CREATED_BY
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
              insertAssignSql,
              [
                empId,
                orgId,
                branchId,
                "SUPER_USER",
                "SUPER USER",
                status,
                startDate,
                createdBy,
              ],
              (assignErr) => {
                if (assignErr) {
                  console.error(assignErr);
                  return db.rollback(() =>
                    res.status(500).json({
                      message: "Failed to assign role",
                    })
                  );
                }

                // ✅ Commit only if both succeed
                db.commit((commitErr) => {
                  if (commitErr) {
                    console.error(commitErr);
                    return db.rollback(() =>
                      res.status(500).json({
                        message: "Commit failed",
                      })
                    );
                  }

                  return res.status(201).json({
                    message: "Super User created successfully",
                  });
                });
              }
            );
          }
        );
      });
    }
  );
};

module.exports = { addSuperUser };
