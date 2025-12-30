const db = require("../../config/db");

// --------------------------------------------------
// MAIN LOGIN FUNCTION
// --------------------------------------------------
const categoryLogin = (req, res) => {
  const { email, password, id } = req.body;
  const categoryId = Number(id);

  if (!email || !password || !categoryId) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  // -----------------------------
  // CATEGORY 1 — SSO
  // -----------------------------
  if (categoryId === 1) {
    const sql = `
      SELECT *
      FROM GA_MASTER_USERS
      WHERE USER_NAME = ? AND PASSWORD = ?
    `;

    return db.query(sql, [email, password], (err, rows = []) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (rows.length > 0) {
        const updateAttempts = `
          UPDATE GA_MASTER_USERS
          SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1
          WHERE USER_NAME = ?
        `;

        db.query(updateAttempts, [email]);

        return res.status(200).json({
          categoryId,
          role: "SSO",
          message: "SSO login successful",
          data: rows,
        });
      }

      return roleCheck(email, categoryId, res);
    });
  }

  // -----------------------------
  // CATEGORY 2 — ORG ADMIN
  // -----------------------------
  if (categoryId === 2) {
    const sql = `
      SELECT *
      FROM TC_ORG_REGISTRATIONS
      WHERE ORG_EMAIL = ?
        AND PASSWORD = ?
        AND STATUS = 'A'
    `;

    return db.query(sql, [email, password], (err, rows = []) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (rows.length > 0) {
        const orgId = rows[0].ORG_ID;
        const sno = rows[0].SNO;
        const passwordStatus = rows[0].PASSWORD_FLAG;
        const currentAttempts = rows[0].ATTEMPTS_LOGIN || 0;

        if (passwordStatus === "TEMP") {
          return res.status(200).json({
            categoryId,
            role: "Org Admin",
            companyId: orgId,
            forcePasswordChange: true,
            attemptsLogins: currentAttempts,
            message: "Temporary password. Please change password.",
            data: rows,
          });
        }

        const updateAttempts = `
          UPDATE TC_ORG_REGISTRATIONS
          SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1
          WHERE ORG_EMAIL = ? AND SNO = ?
        `;

        db.query(updateAttempts, [email, sno]);

        return res.status(200).json({
          categoryId,
          role: "Org Admin",
          companyId: orgId,
          forcePasswordChange: false,
          attemptsLogins: currentAttempts + 1,
          message: "Org Admin login successful",
          data: rows,
        });
      }

      return roleCheck(email, categoryId, res);
    });
  }

  // -----------------------------
  // CATEGORY 3 — EMPLOYEE
  // -----------------------------
  if (categoryId === 3) {
    const sql = `
      SELECT *
      FROM TC_USERS
      WHERE EMAIL = ?
        AND PASSWORD = ?
    `;

    return db.query(sql, [email, password], (rowErr, row = []) => {
      if (rowErr) return res.status(500).json({ message: "DB error" });

      if (row.length > 0) {

        // 🚫 INACTIVE USER CHECK (ADDED)
        if (row[0].STATUS !== 'A') {
          return res.status(403).json({
            categoryId,
            role: "Employee",
            message: "You have no access. Your account is inactive."
          });
        }

        const empId = row[0].EMP_ID;
        const orgId = row[0].ORG_ID;
        const userId = row[0].USER_ID;
        const passwordStatus = row[0].PASSWORD_FLAG;
        const currentAttempts = row[0].ATTEMPTS_LOGIN || 0;

        if (passwordStatus === "TEMP") {
          return res.status(200).json({
            categoryId,
            role: "Employee",
            empId,
            companyId: orgId,
            forcePasswordChange: true,
            attemptsLogins: currentAttempts,
            message: "Temporary password. Please change password.",
            data: row,
          });
        }

        const updateAttempts = `
          UPDATE TC_USERS
          SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1
          WHERE EMAIL = ? AND USER_ID = ?
        `;

        db.query(updateAttempts, [email, userId], (updErr) => {
          if (updErr) {
            return res.status(500).json({ message: "Failed to update login attempts" });
          }

          // FETCH ACCESS CODES
          getEmployeeAccessCodes(empId, orgId, (accessCodes) => {
            return res.status(200).json({
              categoryId,
              role: "Employee",
              empId,
              companyId: orgId,
              accessCodes,
              forcePasswordChange: false,
              attemptsLogins: currentAttempts + 1,
              message: "Employee login successful",
              data: row,
            });
          });
        });

      } else {
        return roleCheck(email, categoryId, res);
      }
    });
  }

  return res.status(400).json({ message: "Invalid category" });
};


// --------------------------------------------------
// ACCESS CODE FETCH
// --------------------------------------------------
function getEmployeeAccessCodes(empId, orgId, callback) {
  const sql = `
    SELECT DISTINCT ACCESS_CODE
    FROM TC_ACCESS_CONTROLS
    WHERE EMP_ID = ?
      AND ORG_ID = ?
      AND STATUS = 'A'
      AND (START_DATE IS NULL OR START_DATE <= CURDATE())
      AND (END_DATE IS NULL OR END_DATE >= CURDATE())
  `;

  db.query(sql, [empId, orgId], (err, rows = []) => {
    if (err) {
      console.error("Access code fetch error:", err);
      return callback([]);
    }

    const accessCodes = rows.map(r => r.ACCESS_CODE);
    callback(accessCodes);
  });
}


// --------------------------------------------------
// ROLE CHECK FUNCTION
// --------------------------------------------------
function roleCheck(email, attemptedCategory, res) {
  const queries = [
    { id: 1, sql: `SELECT 1 FROM GA_MASTER_USERS WHERE USER_NAME = ?` },
    { id: 2, sql: `SELECT 1 FROM TC_ORG_REGISTRATIONS WHERE ORG_EMAIL = ?` },
    { id: 3, sql: `SELECT 1 FROM TC_USERS WHERE EMAIL = ?` },
  ];

  let foundInOtherRole = false;
  let completed = 0;
  let responded = false;

  queries.forEach((q) => {
    if (q.id === attemptedCategory) {
      completed++;
      return;
    }

    db.query(q.sql, [email], (err, rows = []) => {
      if (responded) return;

      if (rows.length > 0) {
        foundInOtherRole = true;
      }

      completed++;

      if (completed === queries.length && !responded) {
        responded = true;

        if (foundInOtherRole) {
          return res.status(403).json({ message: "You are not eligible for this role" });
        }

        return res.status(401).json({ message: "Invalid email or password" });
      }
    });
  });
}

module.exports = { categoryLogin };
