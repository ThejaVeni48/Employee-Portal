const db = require("../../config/db");

// -------------------MAIN LOGIN FUNCTION ----------------------------------------------------
const categoryLogin = (req, res) => {
  const { email, password, id } = req.body;
  const categoryId = Number(id);

  if (!email || !password || !categoryId) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  //   ================================================== CATEGORY 1 — SSO  ==================================================
  
  if (categoryId === 1) {
    const sql = `
      SELECT *
      FROM GA_MASTER_USERS
      WHERE USER_NAME = ?
        AND PASSWORD = ?
    `;

    return db.query(sql, [email, password], (err, rows = []) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (rows.length > 0) {
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

  // ==================================================  CATEGORY 2 — ORG ADMIN ==================================================
  
  
  if (categoryId === 2) {
    const sql = `
      SELECT 
        O.ORG_ID,
        O.ORG_NAME,
        O.ORG_EMAIL,
        O.STATUS AS ORG_STATUS,
        O.PASSWORD_FLAG,
        O.ATTEMPTS_LOGIN,
        S.ORG_SUBSCRIPTION_ID,
        S.PLAN_ID,
        S.STATUS AS SUB_STATUS,
        S.START_DATE,
        S.END_DATE
      FROM TC_ORG_REGISTRATIONS O
      JOIN TC_ORG_SUBSCRIPTIONS S
        ON O.ORG_ID = S.ORG_ID
      WHERE O.ORG_EMAIL = ?
        AND O.PASSWORD = ?
        AND O.STATUS = 'A'
        AND S.STATUS = 'A'
        AND CURDATE() BETWEEN S.START_DATE AND S.END_DATE
    `;

    return db.query(sql, [email, password], (err, rows = []) => {
      if (err) return res.status(500).json({ message: "DB error" });

     if (rows.length === 0) {

  const checkSql = `
    SELECT 
      O.STATUS AS ORG_STATUS,
      S.STATUS AS SUB_STATUS,
      S.END_DATE
    FROM TC_ORG_REGISTRATIONS O
    LEFT JOIN TC_ORG_SUBSCRIPTIONS S
      ON O.ORG_ID = S.ORG_ID
    WHERE O.ORG_EMAIL = ?
  `;

  return db.query(checkSql, [email], (err, checkRows = []) => {
    if (checkRows.length === 0) {
      return res.status(403).json({
        message: "Invalid credentials",
        reason: "INVALID"
      });
    }

    const r = checkRows[0];

    if (r.ORG_STATUS !== 'A') {
      return res.status(403).json({
        message: "Organization inactive",
        reason: "ORG_INACTIVE"
      });
    }

    if (r.SUB_STATUS !== 'A' || new Date(r.END_DATE) < new Date()) {
      return res.status(403).json({
        message: "Subscription expired",
        reason: "SUB_EXPIRED"
      });
    }

    return res.status(403).json({
      message: "Access denied",
      reason: "UNKNOWN"
    });
  });
}


      const org = rows[0];

      if (org.PASSWORD_FLAG === "TEMP") {
        return res.status(200).json({
          categoryId,
          role: "Org Admin",
          companyId: org.ORG_ID,
          forcePasswordChange: true,
          attemptsLogins: org.ATTEMPTS_LOGIN || 0,
          message: "Temporary password. Please change password.",
        });
      }

      const updateAttempts = `
        UPDATE TC_ORG_REGISTRATIONS
        SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1
        WHERE ORG_EMAIL = ?
      `;

      db.query(updateAttempts, [email]);

      return res.status(200).json({
        categoryId,
        role: "Org Admin",
        companyId: org.ORG_ID,
        forcePasswordChange: false,
        attemptsLogins: (org.ATTEMPTS_LOGIN || 0) + 1,
        message: "Org Admin login successful",
        data: rows,
      });
    });
  }

  // ==================================================   CATEGORY 3 — EMPLOYEE ==================================================
 
  if (categoryId === 3) {
    const sql = `
      SELECT 
        U.USER_ID,
        U.EMP_ID,
        U.ORG_ID,
        U.STATUS AS USER_STATUS,
        U.PASSWORD_FLAG,
        U.ATTEMPTS_LOGIN,
        O.STATUS AS ORG_STATUS,
        S.STATUS AS SUB_STATUS,
        S.START_DATE,
        S.END_DATE
      FROM TC_USERS U
      JOIN TC_ORG_REGISTRATIONS O
        ON U.ORG_ID = O.ORG_ID
      JOIN TC_ORG_SUBSCRIPTIONS S
        ON U.ORG_ID = S.ORG_ID
      WHERE U.EMAIL = ?
        AND U.PASSWORD = ?
        AND U.STATUS = 'A'
        AND O.STATUS = 'A'
        AND S.STATUS = 'A'
        AND CURDATE() BETWEEN S.START_DATE AND S.END_DATE
    `;

    return db.query(sql, [email, password], (err, rows = []) => {
      if (err) return res.status(500).json({ message: "DB error" });

     if (rows.length === 0) {

  const checkSql = `
    SELECT 
      U.STATUS AS USER_STATUS,
      O.STATUS AS ORG_STATUS,
      S.STATUS AS SUB_STATUS,
      S.END_DATE
    FROM TC_USERS U
    JOIN TC_ORG_REGISTRATIONS O ON U.ORG_ID = O.ORG_ID
    JOIN TC_ORG_SUBSCRIPTIONS S ON O.ORG_ID = S.ORG_ID
    WHERE U.EMAIL = ?
  `;

  return db.query(checkSql, [email], (err, checkRows = []) => {
    if (checkRows.length === 0) {
      return res.status(403).json({
        message: "Invalid credentials",
        reason: "INVALID"
      });
    }

    const r = checkRows[0];

    if (r.USER_STATUS !== 'A') {
      return res.status(403).json({
        message: "User inactive",
        reason: "USER_INACTIVE"
      });
    }

    if (r.ORG_STATUS !== 'A') {
      return res.status(403).json({
        message: "Organization inactive",
        reason: "ORG_INACTIVE"
      });
    }

    if (r.SUB_STATUS !== 'A' || new Date(r.END_DATE) < new Date()) {
      return res.status(403).json({
        message: "Subscription expired",
        reason: "SUB_EXPIRED"
      });
    }

    return res.status(403).json({
      message: "Access denied",
      reason: "UNKNOWN"
    });
  });
}


      const user = rows[0];

      if (user.PASSWORD_FLAG === "TEMP") {
        return res.status(200).json({
          categoryId,
          role: "Employee",
          empId: user.EMP_ID,
          companyId: user.ORG_ID,
          forcePasswordChange: true,
          attemptsLogins: user.ATTEMPTS_LOGIN || 0,
          message: "Temporary password. Please change password.",
        });
      }

      const updateAttempts = `
        UPDATE TC_USERS
        SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1
        WHERE USER_ID = ?
      `;

      db.query(updateAttempts, [user.USER_ID]);

      getEmployeeAccessCodes(user.EMP_ID, user.ORG_ID, (accessCodes) => {
        return res.status(200).json({
          categoryId,
          role: "Employee",
          empId: user.EMP_ID,
          companyId: user.ORG_ID,
          accessCodes,
          forcePasswordChange: false,
          attemptsLogins: (user.ATTEMPTS_LOGIN || 0) + 1,
          message: "Employee login successful",
        });
      });
    });
  }

  return res.status(400).json({ message: "Invalid category" });
};

// --------------------------------------------------  ACCESS CODE FETCH --------------------------------------------------
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
    callback(rows.map(r => r.ACCESS_CODE));
  });
}

// -------------------------------------------------- ROLE CHECK FUNCTION --------------------------------------------------
function roleCheck(email, attemptedCategory, res) {
  const queries = [
    { id: 1, sql: `SELECT 1 FROM GA_MASTER_USERS WHERE USER_NAME = ?` },
    { id: 2, sql: `SELECT 1 FROM TC_ORG_REGISTRATIONS WHERE ORG_EMAIL = ?` },
    { id: 3, sql: `SELECT 1 FROM TC_USERS WHERE EMAIL = ?` },
  ];

  let foundInOtherRole = false;
  let completed = 0;

  queries.forEach((q) => {
    if (q.id === attemptedCategory) {
      completed++;
      return;
    }

    db.query(q.sql, [email], (err, rows = []) => {
      if (rows.length > 0) foundInOtherRole = true;

      completed++;
      if (completed === queries.length) {
        if (foundInOtherRole) {
          return res.status(403).json({ message: "You are not eligible for this role" });
        }
        return res.status(401).json({ message: "Invalid email or password" });
      }
    });
  });
}

module.exports = { categoryLogin };
