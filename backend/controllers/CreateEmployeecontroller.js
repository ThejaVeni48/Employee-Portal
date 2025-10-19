
const db = require('../config/db');
// const bcrypt = require('bcrypt');

// Function to format date to YYYY-MM-DD
function formatDateToLocal(dateString) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to generate Employee ID
function generateEmpId(companyName, hireDate, companyId) {
  return new Promise((resolve, reject) => {
    const prefix = companyName.slice(0, 2).toUpperCase();
    const d = new Date(hireDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');

    const checkEmpSql = `SELECT COUNT(*) AS total FROM EMPLOYEES_LOGINS WHERE COMPANY_ID = ?`;
    db.query(checkEmpSql, [companyId], (err, result) => {
      if (err) return reject(err);

      const count = result[0].total;
      const nextNumber = (count + 1).toString().padStart(3, '0');
      const empId = `${prefix}${nextNumber}${year}${month}`;
      resolve(empId);
    });
  });
}

// Function to generate random password
function generatePassword() {
  const length = 8;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// Route to add new employee
const createEmp= async (req, res) => {
  try {
    const { firstName, lastName, gender, empStatus, email, dept, hireDate, companyId, role,middleName,phnNumber,displayName } = req.body;

    //  Get company name
    const companyResult = await queryAsync(
      `SELECT COMPANY_NAME FROM COMPANIES_REGISTRATIONS WHERE COMPANY_ID = ?`,
      [companyId]
    );

    if (!companyResult.length) return res.status(400).json({ message: 'Company not found' });
    const companyName = companyResult[0].COMPANY_NAME;

        const formattedHireDate = formatDateToLocal(hireDate);

    //  Generate Employee ID
    const empId = await generateEmpId(companyName, hireDate, companyId);

    //  Generate and hash password
    const tempPassword = generatePassword();

    //Prepare employee name
    const empName = firstName + lastName;

    const status = 'Bench'

    //  Insert into EMPLOYEES_LOGINS
    const insertSql = `INSERT INTO EMPLOYEES_LOGINS (EMPNAME, EMP_ID, EMAIL, ROLE, PASSWORD, COMPANY_ID) VALUES (?, ?, ?, ?, ?, ?)`;
    await queryAsync(insertSql, [empName, empId, email, role, tempPassword, companyId]);

   
    const insertDetailsSql  = `
 INSERT INTO EMPLOYEES_DETAILS
        (EMP_ID, FIRST_NAME, LAST_NAME, GENDER, DEPARTMENT, EMPLOYEE_STATUS, EMAIL, COMPANY_ID, HIRE_DATE,MIDDLE_NAME,MOBILE_NUMBER,DISPLAY_NAME,ROLE,STATUS)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)`;

    await queryAsync(insertDetailsSql,[empId,firstName,lastName,gender,dept,empStatus,email,companyId,formattedHireDate,middleName,phnNumber,displayName,role,status]);



    
        



    // // inserting details into employee details also
    //  Send success response
    res.status(200).json({
      message: 'Employee created successfully',
      empId,

    });

  } 
  
  
  
  
  
  
  
  
  
  catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error });
  }
};

module.exports = {createEmp};
