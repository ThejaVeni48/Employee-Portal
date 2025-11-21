const db = require("../../config/db");

const categoryLogin = (req, res) => {
  const { email, password, id } = req.body;
  const categoryId = Number(id);

  // ================================
  // CATEGORY 1 — SSO LOGIN
  // ================================
  if (categoryId === 1) {
    const sql = `SELECT * FROM SSO_MASTERS_USERS WHERE USER_NAME = ? AND PASSWORD = ?`;
    return db.query(sql, [email, password], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      if (result.length === 0)
        return res.status(401).json({ message: "Invalid email or password" });

      return res.status(200).json({
        data: result,
        categoryId,
        message: "SSO User login successful",
      });
    });
  }

  // ================================
  // CATEGORY 2 — ORGANIZATION LOGIN
  // ================================
  if (categoryId === 2) {
    const orgSql = `SELECT * FROM TC_ORG_REGISTRATIONS WHERE EMAIL = ? AND PASSWORD = ?`;

    return db.query(orgSql, [email, password], (orgErr, orgRes) => {
      if (orgErr) return res.status(500).json({ message: "Database error", error: orgErr });

      // CASE 1: Not in ORG table → check TC_USERS + ASSIGNMENTS
      if (orgRes.length === 0) {
        const accessSql = `
          SELECT UA.ACCESS_CODE, U.ORG_ID,R.ROLE_NAME,U.*
          FROM TC_USERS U
         LEFT JOIN TC_ORG_USER_ASSIGNMENT UA 
            ON U.EMP_ID = UA.EMP_ID 
            AND U.ORG_ID = UA.ORG_ID
		LEFT JOIN TC_ORG_ROLES R
          ON R.ROLE_CODE = UA.ROLE_CODE 
            AND R.ORG_ID = UA.ORG_ID
          WHERE U.EMAIL = ?
           AND U.PASSWORD = ?;
        `;

        return db.query(accessSql, [email, password], (accErr, accRes) => {
          if (accErr) return res.status(500).json({ message: "Database error", error: accErr });

          if (accRes.length === 0)
            return res.status(402).json({ message: "Invalid email or password",status:404 });

          const roles = accRes.map(r => r.ACCESS_CODE);
          // const orgId = accRes.map(r => r.ORG_ID);
          const orgId = accRes[0].ORG_ID
          console.log("ORGiD",orgId);
          console.log("ORGiD",typeof(orgId));
          const rolename = accRes[0].ROLE_NAME;


          console.log("rolename",rolename);
          
        
          // GET ATTEMPTS
          const getAttemptsSql = `SELECT ATTEMPTS_LOGIN FROM TC_USERS WHERE ORG_ID = ?`;

          db.query(getAttemptsSql, [orgId], (attErr, attRes) => {
            if (attErr)
              // console.log("attErr",attErr);
              
               return res.status(500).json({ message: "Error fetching login attempts user", error: attErr });

            const attempts = (attRes[0]?.ATTEMPTS_LOGIN || 0) + 1;

            // UPDATE ATTEMPTS
            const updateSql = `UPDATE TC_USERS SET ATTEMPTS_LOGIN = ? WHERE ORG_ID = ?`;

            db.query(updateSql, [attempts, orgId], (upErr) => {
              if (upErr) return res.status(500).json({ message: "Error updating attempts", error: upErr });

              return res.status(200).json({
                data:accRes,
                categoryId,
                access: roles,
                attempts,
                message: "Organization login successful (ALL_ROLE user)",
                role:rolename,
                companyId:orgId
              });
            });
          });
        });
      }

      // CASE 2: ORG REGISTRATION USER FOUND
      const companyId = orgRes[0].ORG_ID;

      const getAttemptsSql = `SELECT ATTEMPTS_LOGIN FROM TC_ORG_REGISTRATIONS WHERE ORG_ID = ?`;

      db.query(getAttemptsSql, [companyId], (attErr, attRes) => {
        if (attErr) return res.status(500).json({ message: "Error fetching login attempts admin", error: attErr });

        const attempts = (attRes[0]?.ATTEMPTS_LOGIN || 0) + 1;

        const updateSql = `UPDATE TC_ORG_REGISTRATIONS SET ATTEMPTS_LOGIN = ? WHERE ORG_ID = ?`;

        db.query(updateSql, [attempts, companyId], (upErr) => {
          if (upErr) return res.status(500).json({ message: "Error updating attempts", error: upErr });

          return res.status(200).json({
            data: orgRes,
            categoryId,
            attempts,
             companyId:companyId,
            role:'Org Admin',
            message: "Company login successful",
            // access:'ALL_R'
          });
        });
      });
    });
  }

  // ================================
  // CATEGORY 3 — EMPLOYEE LOGIN
  // ================================
  if (categoryId === 3) {
    const sql = `SELECT * FROM TC_USERS WHERE EMAIL = ? AND PASSWORD = ?`;

    return db.query(sql, [email, password], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      if (result.length === 0)
        return res.status(404).json({ message: "Invalid email or password" });

      return res.status(200).json({
        data: result,
        categoryId,
        message: "Employee login successful",
      });
    });
  }

  return res.status(400).json({ message: "Invalid category ID" });
};

module.exports = { categoryLogin };
