const db = require('../../config/db');

const changePassword = (req, res) => {
  const { companyId, conPwd, email, empId, role } = req.body;

  console.log("companyId",companyId);
  console.log("empId",empId);
  
  const empIdNormalized = String(empId).trim();


  if (role === 'Org Admin') {

    //  Fetch current + last 3 passwords
    const fetchSql = `
      SELECT PASSWORD, ATTRIBUTE1, ATTRIBUTE2, ATTRIBUTE3
      FROM TC_ORG_REGISTRATIONS
      WHERE ORG_ID = ?
    `;

    db.query(fetchSql, [companyId], (err, rows = []) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (!rows.length) return res.status(404).json({ message: "Admin not found" });

      const { PASSWORD, ATTRIBUTE1, ATTRIBUTE2, ATTRIBUTE3 } = rows[0];

      // 2️⃣ Check password history
      if ([PASSWORD, ATTRIBUTE1, ATTRIBUTE2, ATTRIBUTE3].includes(conPwd)) {
        return res.status(400).json({
          message: "New password must not match last 3 passwords"
        });
      }

      // 3️⃣ Update password + shift history
      const updateSql = `
        UPDATE TC_ORG_REGISTRATIONS
        SET 
          PASSWORD = ?,
          ATTRIBUTE1 = ?,
          ATTRIBUTE2 = ?,
          ATTRIBUTE3 = ?,
          PASSWORD_FLAG = 'T',
          LAST_UPDATED_BY = ?,
          LAST_UPDATED_DATE = NOW()
        WHERE ORG_ID = ?
      `;

      db.query(
        updateSql,
        [conPwd, PASSWORD, ATTRIBUTE1, ATTRIBUTE2, email, companyId],
        (updErr, result) => {
          if (updErr) return res.status(500).json({ message: "Password update failed" });

          // 4️⃣ Increment attempts
          db.query(
            `UPDATE TC_ORG_REGISTRATIONS SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1 WHERE ORG_ID = ?`,
            [companyId]
          );

          return res.status(200).json({
            code: 1,
            message: "Password updated successfully"
          });
        }
      );
    });
  }

  // ================= EMPLOYEE =================
  else {

    // 1️⃣ Fetch current + last 3 passwords
    const fetchSql = `
      SELECT PASSWORD, ATTRIBUTE1, ATTRIBUTE2, ATTRIBUTE3
      FROM TC_USERS
      WHERE ORG_ID = ? AND EMP_ID = ?
    `;

    db.query(fetchSql, [companyId, empIdNormalized], (err, rows = []) => {
      if (err)
      return res.status(500).json({ message: "DB error" });
      console.log("ROWS",rows);
      
      if (rows.length ===0) 
        return res.status(404).json({ message: "User not found" });

      const { PASSWORD, ATTRIBUTE1, ATTRIBUTE2, ATTRIBUTE3 } = rows[0];

      // 2️⃣ Check password history
      if ([PASSWORD, ATTRIBUTE1, ATTRIBUTE2, ATTRIBUTE3].includes(conPwd)) {
        return res.status(400).json({
          message: "New password must not match last 3 passwords"
        });
      }

      // 3️⃣ Update password + shift history
      const updateSql = `
        UPDATE TC_USERS
        SET 
          PASSWORD = ?,
          ATTRIBUTE1 = ?,
          ATTRIBUTE2 = ?,
          ATTRIBUTE3 = ?,
          LAST_UPDATED_BY = ?,
          LAST_UPDATED_DATE = NOW()
        WHERE ORG_ID = ? AND EMP_ID = ?
      `;

      db.query(
        updateSql,
        [conPwd, PASSWORD, ATTRIBUTE1, ATTRIBUTE2, email, companyId, empIdNormalized],
        (updErr, result) => {
          if (updErr) return res.status(500).json({ message: "Password update failed" });

          // 4️⃣ Increment attempts
          db.query(
            `UPDATE TC_USERS SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1 WHERE ORG_ID = ? AND EMP_ID = ?`,
            [companyId, empIdNormalized]
          );

          return res.status(200).json({
            code: 1,
            message: "Password updated successfully"
          });
        }
      );
    });
  }
};

module.exports = { changePassword };
