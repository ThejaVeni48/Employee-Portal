const db = require('../../config/db');

const changePassword = (req, res) => {
  const { companyId, conPwd, email, empId, role } = req.body;

  // ================= ORG ADMIN =================
  if (role === 'Org Admin') {

    const updatePasswordSql = `
      UPDATE TC_ORG_REGISTRATIONS
      SET PASSWORD = ?,
          LAST_UPDATED_BY = ?,
          LAST_UPDATED_DATE = NOW(),
          LAST_LOGIN_BY = ?
      WHERE ORG_ID = ?
    `;

    db.query(
      updatePasswordSql,
      [conPwd, email, email, companyId],
      (err, result) => {
        if (err) {
          console.error("Org Admin password update error:", err);
          return res.status(500).json({ message: "Password update failed" });
        }

        //  CHECK PASSWORD UPDATE RESULT
        if (result.affectedRows !== 1) {
          return res.status(400).json({ message: "Password not updated" });
        }

        // INCREMENT ATTEMPTS ONLY AFTER SUCCESS
        const updateAttemptsSql = `
          UPDATE TC_ORG_REGISTRATIONS
          SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1
          WHERE ORG_ID = ?
        `;

        db.query(updateAttemptsSql, [companyId], (attErr) => {
          if (attErr) {
            console.error("Org Admin attempts update error:", attErr);
            return res.status(500).json({ message: "Attempts update failed" });
          }

          return res.status(200).json({
            code: 1,
            message: "Password updated successfully. Attempts incremented."
          });
        });
      }
    );
  }

  // ================= USER / EMPLOYEE =================
  else {

    const updatePasswordSql = `
      UPDATE TC_USERS
      SET PASSWORD = ?,
          LAST_UPDATED_BY = ?,
          LAST_UPDATED_DATE = NOW()
      WHERE ORG_ID = ? AND EMP_ID = ?
    `;

    db.query(
      updatePasswordSql,
      [conPwd, email, companyId, empId],
      (err, result) => {
        if (err) {
          console.error("User password update error:", err);
          return res.status(500).json({ message: "Password update failed" });
        }

        //  CHECK PASSWORD UPDATE RESULT
        if (result.affectedRows !== 1) {
          return res.status(400).json({ message: "Password not updated" });
        }

        //  INCREMENT ATTEMPTS ONLY AFTER SUCCESS
        const updateAttemptsSql = `
          UPDATE TC_USERS
          SET ATTEMPTS_LOGIN = ATTEMPTS_LOGIN + 1
          WHERE ORG_ID = ? AND EMP_ID = ?
        `;

        db.query(updateAttemptsSql, [companyId, empId], (attErr) => {
          if (attErr) {
            console.error("User attempts update error:", attErr);
            return res.status(500).json({ message: "Attempts update failed" });
          }

          return res.status(200).json({
            code: 1,
            message: "Password updated successfully. Attempts incremented."
          });
        });
      }
    );
  }
};

module.exports = { changePassword };
