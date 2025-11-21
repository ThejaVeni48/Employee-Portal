const express = require("express");
const router = express.Router();
const moment = require("moment");

// const {
//   formatDateToLocal,
//   generateEmpId,
//   generatePassword,
//   queryAsync,
// } = require("../helpers/functions"); 

// Bulk upload employees
const createEmp = async (req, res) => {
  try {
    const { employees, companyId, createdBy } = req.body;

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

    const insertLogins = [];
    const insertDetails = [];
    const insertLeaves = [];
    const insertDate = moment().format("YYYY-MM-DD HH:mm:ss");

    for (const emp of employees) {
      const hireDate = formatDateToLocal(emp.hireDate);
      const empId = await generateEmpId(companyName, hireDate, companyId);
      const tempPassword = generatePassword();
      const empName = `${emp.firstName} ${emp.lastName}`;
      const status = "Bench";
      const empStatus = "Active";

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
        status,
        insertDate,
        createdBy,
      ]);

      // Allocate leaves
      const hireMonth = new Date(hireDate).getMonth() + 1;
      const totalLeaves = 12 - hireMonth + 1; // 1 leave per remaining month
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

    // Bulk inserts
    if (insertLogins.length) {
      await queryAsync(
        `INSERT INTO EMPLOYEES_LOGINS
         (EMPNAME, EMP_ID, EMAIL, ROLE_ID, PASSWORD, COMPANY_ID, CREATION_DATE, CREATED_BY)
         VALUES ?`,
        [insertLogins]
      );
    }

    if (insertDetails.length) {
      await queryAsync(
        `INSERT INTO EMPLOYEES_DETAILS
         (EMP_ID, FIRST_NAME, LAST_NAME, GENDER, DEPT_ID, EMAIL, COMPANY_ID, HIRE_DATE,
          MIDDLE_NAME, MOBILE_NUMBER, DISPLAY_NAME, ROLE_ID, STATUS, STATUS_REASON, CREATION_DATE, CREATED_BY)
         VALUES ?`,
        [insertDetails]
      );
    }

    if (insertLeaves.length) {
      await queryAsync(
        `INSERT INTO EMPLOYEE_ALLOCATION
         (EMP_ID, COMPANY_ID, TOTAL_LEAVES, USED_LEAVES, AVAILABLE_LEAVES, LEAVE_ID, CREATION_DATE, CREATED_BY)
         VALUES ?`,
        [insertLeaves]
      );
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

module.exports = {createEmp};
