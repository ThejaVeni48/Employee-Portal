const db = require('../../config/db');
const { generatePassword } = require("../../helpers/functions"); 

const addEmp = (req, res) => {

    const { employees, companyId, email } = req.body;

    const insertDetails = [];
    const password = generatePassword();
    const insertDate = new Date();
    const status = 'A';

    const empId = employees[0].empId;  

    const checkEmp = `SELECT * FROM TC_USERS WHERE EMP_ID = ?`;

    db.query(checkEmp, [empId], (checkError, checkResult) => {
        if (checkError) {
            console.log("Check Error", checkError);
            return res.status(500).json({ data: checkError });
        }

        // EMPLOYEE EXISTS
        if (checkResult.length > 0) {
            return res.status(409).json({ message: "Employee already exists." });
        }

        // EMPLOYEE NOT FOUND 
        const educationDetails = [];

        employees.forEach(emp => {

            // Employee master insert
            insertDetails.push([
                emp.empId,
                emp.firstName,
                emp.lastName,
                emp.middleName,
                emp.displayName,
                emp.gender,
                emp.emailID,
                companyId,
                emp.hireDate,
                status,
                emp.phnNumber,
                password,
                insertDate,
                email
            ]);

            // Education insert
            emp.education.forEach(ed => {
                educationDetails.push([
                    emp.empId,
                    ed.degree,
                    ed.university,
                    ed.year,
                    companyId,
                    email,
                    insertDate

                ]);
            });

        });

        const sqlUsers = `
            INSERT INTO TC_USERS 
            (EMP_ID, FIRST_NAME, LAST_NAME, MIDDLE_NAME, DISPLAY_NAME, GENDER, EMAIL, ORG_ID, START_DATE, STATUS,
            MOBILE_NUMBER, PASSWORD, CREATION_DATE, CREATED_BY)
            VALUES ?
        `;

        db.query(sqlUsers, [insertDetails], (error, result) => {
            if (error) {
                console.log("Insert TC_USERS error:", error);
                return res.status(500).json({ error });
            }

            const sqlEducation = `
                INSERT INTO TC_USER_DETAILS 
                (EMP_ID, DEGREE, UNIVERSITY, YOP,ORG_ID,CREATED_BY,CREATION_DATE)
                VALUES ?
            `;

            db.query(sqlEducation, [educationDetails], (eduErr, eduResult) => {
                if (eduErr) {
                    console.log("Insert Education Error:", eduErr);
                    return res.status(500).json({ error: eduErr });
                }

                return res.status(201).json({
                    message: "Employee and education details inserted successfully.",
                    usersInserted: result.affectedRows,
                    educationInserted: eduResult.affectedRows
                });
            });
        });
    });
};

module.exports = { addEmp };
