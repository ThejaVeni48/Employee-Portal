const db = require("../../config/db");

// ------------------- MAIN LOGIN FUNCTION -------------------
const categoryLogin = (req, res) => {
  const { email, password, id } = req.body;
  const categoryId = Number(id);


  console.log("email",email);
  console.log("password",password);
  console.log("categoryId",categoryId);
  
  

  if (!email || !password || !categoryId) {
    return res.status(400).json({
      message: "Missing credentials",
      status: 400
    });
  }

  // ================= CATEGORY 1 — SSO =================
  if (categoryId === 1) {
    const sql = `
      SELECT *
      FROM GA_MASTER_USERS
      WHERE USER_NAME = ?
        AND PASSWORD = ?
    `;

    return db.query(sql, [email, password], (err, rows = []) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (rows.length === 0) {
        return res.status(403).json({
          message: "You are not valid for this login",
          reason: "INVALID_CATEGORY",
          status: 403
        });
      }

      return res.status(200).json({
        categoryId,
        role: "SSO",
        data: rows,
        status: 200
      });
    });
  }

  // ================= CATEGORY 2 — ORG ADMIN =================
if (categoryId === 2) {
  const sql = `
    SELECT 
      O.ORG_ID,
      O.ORG_EMAIL,
      O.PASSWORD,
      O.STATUS AS ORG_STATUS,
      O.PASSWORD_FLAG,
      O.ATTEMPTS_LOGIN,
      S.STATUS AS SUB_STATUS,
      S.END_DATE
    FROM TC_ORG_REGISTRATIONS O
    LEFT JOIN TC_ORG_SUBSCRIPTIONS S
      ON O.ORG_ID = S.ORG_ID
    WHERE O.ORG_EMAIL = ?
  `;

  return db.query(sql, [email], (err, rows = []) => {
    if (err) {
      return res.status(500).json({
        message: "DB error",
      });
    }

    // ❌ Email not found → not org admin
    if (rows.length === 0) {
      return res.status(403).json({
        message: "You are not valid for Org Admin login",
        reason: "NOT_ORG_ADMIN",
        status: 403,
      });
    }

    const org = rows[0];

    // ❌ Wrong password
    if (org.PASSWORD !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
        reason: "WRONG_PASSWORD",
        status: 401,
      });
    }

    // ❌ Org inactive
    if (org.ORG_STATUS !== "A") {
      return res.status(403).json({
        message: "Access denied. Organization inactive",
        reason: "ORG_INACTIVE",
        status: 403,
      });
    }

    // ❌ Subscription expired
    if (
      org.SUB_STATUS !== "A" ||
      (org.END_DATE &&
        new Date(org.END_DATE) < new Date())
    ) {
      return res.status(403).json({
        message: "Subscription expired",
        reason: "SUB_EXPIRED",
        status: 403,
      });
    }

    // ✅ SUCCESS
    return res.status(200).json({
      categoryId,
      role: "Org Admin",
      companyId: org.ORG_ID,
      forcePasswordChange:
        org.PASSWORD_FLAG === "TEMP",
      attemptsLogins:
        org.ATTEMPTS_LOGIN || 0,
      status: 200,
    });
  });
}


  // ================= CATEGORY 3 — EMPLOYEE =================
if (categoryId === 3) {
  const sql = `
    SELECT 
      U.USER_ID,
      U.EMP_ID,
      U.ORG_ID,
      U.DISPLAY_NAME,
      U.STATUS AS USER_STATUS,
      U.PASSWORD_FLAG,
      U.ATTEMPTS_LOGIN,

      O.STATUS AS ORG_STATUS,

      S.STATUS AS SUB_STATUS,
      S.END_DATE,

      A.ROLE_CODE

    FROM TC_USERS U
    JOIN TC_ORG_REGISTRATIONS O 
      ON U.ORG_ID = O.ORG_ID

    JOIN TC_ORG_SUBSCRIPTIONS S 
      ON U.ORG_ID = S.ORG_ID

    LEFT JOIN TC_ORG_USER_ASSIGNMENT A
      ON U.EMP_ID = A.EMP_ID
     AND U.ORG_ID = A.ORG_ID
     AND A.STATUS = 'A'

    WHERE U.EMAIL = ?
      AND U.PASSWORD = ?
  `;

  return db.query(sql, [email, password], (err, rows = []) => {
    if (err)
      return res.status(500).json({ message: "DB error" });

    if (!rows.length) {
      return res.status(403).json({
        message: "Invalid credentials",
        reason: "INVALID_LOGIN",
        status: 403,
      });
    }

    const user = rows[0];

    // 🔴 status checks
    if (user.USER_STATUS !== "A") {
      return res.status(403).json({
        message: "User inactive",
        reason: "USER_INACTIVE",
      });
    }

    if (user.ORG_STATUS !== "A") {
      return res.status(403).json({
        message: "Organization inactive",
        reason: "ORG_INACTIVE",
      });
    }

    if (
      user.SUB_STATUS !== "A" ||
      (user.END_DATE &&
        new Date(user.END_DATE) < new Date())
    ) {
      return res.status(403).json({
        message: "Subscription expired",
        reason: "SUB_EXPIRED",
      });
    }

    // 🧠 Decide role
    const role =
      user.ROLE_CODE === "SUPER_USER"
        ? "SUPER_USER"
        : "EMPLOYEE";

    return res.status(200).json({
      categoryId,
      role,
      empId: user.EMP_ID,
      displayName: user.DISPLAY_NAME,
      companyId: user.ORG_ID,
      forcePasswordChange:
        user.PASSWORD_FLAG === "TEMP",
      attemptsLogins:
        user.ATTEMPTS_LOGIN || 0,
      status: 200,
    });
  });
}


  return res.status(400).json({
    message: "Invalid category",
    status: 400
  });
};

module.exports = { categoryLogin };
