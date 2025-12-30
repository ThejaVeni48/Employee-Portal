const db = require("../config/db");
const moment = require("moment");

// Format date to YYYY-MM-DD
function formatDateToLocal(dateString) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Generate Employee ID
function generateEmpId(companyName, hireDate, companyId) {
  return new Promise((resolve, reject) => {
    const prefix = companyName.slice(0, 2).toUpperCase();
    const d = new Date(hireDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");

    const checkEmpSql = `SELECT COUNT(*) AS total FROM EMPLOYEES_LOGINS WHERE COMPANY_ID = ?`;
    db.query(checkEmpSql, [companyId], (err, result) => {
      if (err) return reject(err);
      const count = result[0].total;
      const nextNumber = (count + 1).toString().padStart(3, "0");
      const empId = `${prefix}${nextNumber}${year}${month}`;
      resolve(empId);
    });
  });
}

// Generate random password
function generatePassword(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Promise wrapper for db.query
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function generateFutureWeeks(weekEnd)
{

}



module.exports = {
  formatDateToLocal,
  generateEmpId,
  generatePassword,
  queryAsync,
  generateFutureWeeks
};
