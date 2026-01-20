const db = require("../../config/db");

// ------------------- MAIN LOGIN FUNCTION -------------------
const categoryLogin = (req, res) => {
  const { email, password, id } = req.body;
  const categoryId = Number(id);

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
        O.STATUS AS ORG_STATUS,
        O.PASSWORD_FLAG,
        O.ATTEMPTS_LOGIN,
        S.STATUS AS SUB_STATUS,
        S.END_DATE
      FROM TC_ORG_REGISTRATIONS O
      LEFT JOIN TC_ORG_SUBSCRIPTIONS S
        ON O.ORG_ID = S.ORG_ID
      WHERE O.ORG_EMAIL = ?
        AND O.PASSWORD = ?
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

      const org = rows[0];

      if (org.ORG_STATUS !== "A") {
        return res.status(403).json({
          message: "Organization inactive",
          reason: "ORG_INACTIVE",
          status: 403
        });
      }

      if (org.SUB_STATUS !== "A" || new Date(org.END_DATE) < new Date()) {
        return res.status(403).json({
          message: "Subscription expired",
          reason: "SUB_EXPIRED",
          status: 403
        });
      }

      return res.status(200).json({
        categoryId,
        role: "Org Admin",
        companyId: org.ORG_ID,
        forcePasswordChange: org.PASSWORD_FLAG === "TEMP",
        attemptsLogins: org.ATTEMPTS_LOGIN || 0,
        status: 200
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
        S.END_DATE
      FROM TC_USERS U
      JOIN TC_ORG_REGISTRATIONS O ON U.ORG_ID = O.ORG_ID
      JOIN TC_ORG_SUBSCRIPTIONS S ON U.ORG_ID = S.ORG_ID
      WHERE U.EMAIL = ?
        AND U.PASSWORD = ?
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

      const user = rows[0];

      if (user.USER_STATUS !== "A") {
        return res.status(403).json({
          message: "User inactive",
          reason: "USER_INACTIVE",
          status: 403
        });
      }

      if (user.ORG_STATUS !== "A") {
        return res.status(403).json({
          message: "Organization inactive",
          reason: "ORG_INACTIVE",
          status: 403
        });
      }

      if (user.SUB_STATUS !== "A" || new Date(user.END_DATE) < new Date()) {
        return res.status(403).json({
          message: "Subscription expired",
          reason: "SUB_EXPIRED",
          status: 403
        });
      }

      return res.status(200).json({
        categoryId,
        role: "Employee",
        empId: user.EMP_ID,
        displayName: user.DISPLAY_NAME,
        companyId: user.ORG_ID,
        forcePasswordChange: user.PASSWORD_FLAG === "TEMP",
        attemptsLogins: user.ATTEMPTS_LOGIN || 0,
        status: 200
      });
    });
  }

  return res.status(400).json({
    message: "Invalid category",
    status: 400
  });
};

module.exports = { categoryLogin };
