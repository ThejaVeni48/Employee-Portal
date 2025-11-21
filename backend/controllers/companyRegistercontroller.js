const db = require("../config/db");


// Generate unique Company ID
function generateCompanyId(companyName) {
  return new Promise((resolve, reject) => {
    const prefix = companyName.slice(0, 2).toUpperCase();
    const checkSql = `SELECT COUNT(*) AS total FROM TC_ORG_REGISTRATIONS`;

    db.query(checkSql, (err, result) => {
      if (err) return reject(err);

      const count = result[0].total;
      const nextNumber = (count + 1).toString().padStart(3, "0");
      const companyId = `${prefix}-${nextNumber}`;

      resolve(companyId);
    });
  });
}




// Generate Timesheet Code
function generateTimesheetCode(companyName) {
  const name = companyName.slice(0, 3).toUpperCase();
  const num = Math.floor(10 + Math.random() * 90);
  console.log("name for timesheet:", name);
  console.log("num for timesheet:", num);
  return `${name}-${num}`;
}

// Company Registration Controller
const companyRegister = async (req, res) => {
  const { firstName, lastName, companyName, email, role, address,domain,branch } = req.body;

   const adminName = firstName+lastName;
  // const tempPassword = generatePassword();
  const companyId = await generateCompanyId(companyName);
  const timesheetCode = generateTimesheetCode(companyName);

  console.log("Received Registration Data:", {
    firstName,
    lastName,
    companyName,
    email,
    role,
    address,
    companyId,
    timesheetCode,
  });

  

  // Check if company already exists
  const checkCompanyExists = `
    SELECT * FROM TC_ORG_REGISTRATIONS 
    WHERE ORG_NAME = ?`;

  db.query(checkCompanyExists, [companyName], (err, results) => {
    if (err) {
      console.error("Error checking existing company:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message: "Company with this name or email already exists",
        status: 400,
      });
    }
    const status = 'P';

    // Insert new company record
    const insertSql = `
      INSERT INTO TC_ORG_REGISTRATIONS 
      (ORG_ID,STATUS,ADMIN_NAME,ORG_NAME, ADDRESS, EMAIL,BRANCH,CREATION_DATE)
      VALUES (?, ?,?, ?, ?, ?,?,NOW())
    `;

    db.query(
      insertSql,
      [
        companyId,
        status,
        adminName,
        companyName,
        address,
        email,
        branch
      ],
      (error, result) => {
        if (error) {
          console.error("Error inserting company:", error);
          return res.status(500).json({ message: "Insertion error", error });
        }

        console.log("Company registration successful:", result);

        return res.status(201).json({
          data: result,
          companyId,
          timesheetCode,
          message: "Your company is registered successfully",
          status: 201,
        });
      }
    );
  });
};

module.exports = { companyRegister };
