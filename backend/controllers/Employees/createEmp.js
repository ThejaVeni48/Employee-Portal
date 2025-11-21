
// not working api



const express = require("express");
const router = express.Router();
const moment = require("moment");

const {
  formatDateToLocal,
  generateEmpId,
  generatePassword,
  queryAsync,
} = require("../../helpers/functions"); 

// Bulk upload employees
const createEmployee = async (req, res) => {
  try {
    const { employees, companyId, createdBy } = req.body;

    console.log("EMPLOYEES",employees);
    

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: "No employee data provided" });
    }

    // Get company name
    const companyResult = await queryAsync(
      `SELECT COMPANY_NAME FROM COMPANIES_REGISTRATIONS WHERE COMPANY_ID = ?`,
      [companyId]
    );

    if (!companyResult.length) {
      return res.status(400).json({ message: "Company not found" });
    }

    const companyName = companyResult[0].COMPANY_NAME;
    const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");

    const insertLogins = [];
    const insertDetails = [];
    const insertLeaves = [];

    for (const emp of employees) {
      const hireDate = formatDateToLocal(emp.hireDate);
      const empId = await generateEmpId(companyName, hireDate, companyId);
      const tempPassword = generatePassword();
      const empName = `${emp.firstName} ${emp.lastName}`;
      const empStatus = "Active";
      // const status = "Bench";

      // Prepare EMPLOYEES_LOGINS
      insertLogins.push([
        empName,
        empId,
        emp.email,
        emp.selectedRole,
        tempPassword,
        companyId,
        insertDate,
        createdBy,
      ]);

      // Prepare EMPLOYEES_DETAILS
      insertDetails.push([
        empId,
        emp.firstName,
        emp.lastName,
        emp.gender,
        emp.dept,
        emp.email,
        companyId,
        hireDate,
        emp.middleName || null,
        emp.phnNumber || null,
        emp.displayName || empName,
        emp.selectedRole,
        empStatus,
        insertDate,
        createdBy,
      ]);

      // Prepare EMPLOYEE_ALLOCATION (leaves)
      const hireMonth = new Date(hireDate).getMonth() + 1;
      const totalLeaves = 12 - hireMonth + 1; // 1 per remaining month
      const usedLeaves = 0;
      const availableLeaves = totalLeaves;

      const leaveTypeRows = await queryAsync(
        `SELECT LEAVE_ID FROM LEAVES WHERE COMPANY_ID = ?`,
        [companyId]
      );

      leaveTypeRows.forEach((lt) => {
        insertLeaves.push([
          empId,
          companyId,
          totalLeaves,
          usedLeaves,
          availableLeaves,
          lt.LEAVE_ID,
          insertDate,
          createdBy,
        ]);
      });
    }

    // Insert EMPLOYEES_LOGINS
    try {
      if (insertLogins.length) {
        await queryAsync(
          `INSERT INTO EMPLOYEES_LOGINS
           (EMPNAME, EMP_ID, EMAIL, ROLE_ID, PASSWORD, COMPANY_ID, CREATION_DATE, CREATED_BY)
           VALUES ?`,
          [insertLogins]
        );
        console.log(`Inserted ${insertLogins.length} logins`);
      }
    } catch (err) {
      console.error("Failed to insert EMPLOYEES_LOGINS:", err);
      return res.status(500).json({ error: "Failed to insert EMPLOYEES_LOGINS", details: err.message });
    }

    // Insert EMPLOYEES_DETAILS
    try {
      if (insertDetails.length) {
        await queryAsync(
          `INSERT INTO EMPLOYEES_DETAILS
           (EMP_ID, FIRST_NAME, LAST_NAME, GENDER, DEPT_ID, EMAIL, COMPANY_ID, HIRE_DATE,
            MIDDLE_NAME, MOBILE_NUMBER, DISPLAY_NAME, ROLE_ID, STATUS, CREATION_DATE, CREATED_BY)
           VALUES ?`,
          [insertDetails]
        );
        console.log(`Inserted ${insertDetails.length} details`);
      }
    } catch (err) {
      console.error("Failed to insert EMPLOYEES_DETAILS:", err);
      return res.status(500).json({ error: "Failed to insert EMPLOYEES_DETAILS", details: err.message });
    }

    // Insert EMPLOYEE_ALLOCATION
    try {
      if (insertLeaves.length) {
        await queryAsync(
          `INSERT INTO EMPLOYEE_ALLOCATION
           (EMP_ID, COMPANY_ID, TOTAL_LEAVES, USED_LEAVES, AVAILABLE_LEAVES, LEAVE_ID, CREATION_DATE, CREATED_BY)
           VALUES ?`,
          [insertLeaves]
        );
        console.log(`Inserted ${insertLeaves.length} leave allocations`);
      }
    } catch (err) {
      console.error("Failed to insert EMPLOYEE_ALLOCATION:", err);
      return res.status(500).json({ error: "Failed to insert EMPLOYEE_ALLOCATION", details: err.message });
    }

    res.status(201).json({
      message: `Successfully uploaded ${employees.length} employees.`,
      totalEmployees: employees.length,
    });
  } catch (error) {
    console.error("Bulk employee upload failed:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createEmployee};
