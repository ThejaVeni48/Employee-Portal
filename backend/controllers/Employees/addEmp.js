const db = require('../../config/db');
const { generatePassword } = require("../../helpers/functions"); 

const addEmp = (req, res) => {
    const { employees, companyId, email } = req.body;

    const insertDetails = [];
    const password = generatePassword();
    const insertDate = new Date();
    const status = 'A';

    const empId = employees[0].empId;
    const attemptsLogins = 0;

    const checkEmp = `SELECT * FROM TC_USERS WHERE EMP_ID = ? AND ORG_ID = ?`;

    db.query(checkEmp, [empId, companyId], (checkError, checkResult) => {
        if (checkError) {
            console.log("Check Error", checkError);
            return res.status(500).json({ data: checkError });
        }

        // EMPLOYEE EXISTS
        if (checkResult.length > 0) {
            return res.status(409).json({ message: "Employee already exists with this employee Id." });
        }

        // ===================== CHECK MAX EMPLOYEES & SUBSCRIPTION =====================
        const getOrgSubSql = `
            SELECT MAX_EMPLOYEES, START_DATE, END_DATE, STATUS
            FROM TC_ORG_SUBSCRIPTIONS
            WHERE ORG_ID = ?
        `;

        db.query(getOrgSubSql, [companyId], (subErr, subResult) => {
            if (subErr) {
                console.log("Subscription Check Error", subErr);
                return res.status(500).json({ data: subErr });
            }

            if (subResult.length === 0) {
                return res.status(403).json({ message: "No active subscription found for this organization." });
            }

            const { MAX_EMPLOYEES, START_DATE, END_DATE, STATUS: subStatus } = subResult[0];

            const today = new Date();

            // Check subscription status
            if (subStatus !== 'A' || today < new Date(START_DATE) || today > new Date(END_DATE)) {
                return res.status(403).json({ message: "Your subscription has ended. Please renew to add employees." });
            }

            // Check max employees
            const countEmpSql = `SELECT COUNT(*) AS currentCount FROM TC_USERS WHERE ORG_ID = ?`;

            db.query(countEmpSql, [companyId], (countErr, countResult) => {
                if (countErr) {
                    console.log("Employee count error", countErr);
                    return res.status(500).json({ data: countErr });
                }

                const currentEmpCount = countResult[0].currentCount;

                if (currentEmpCount + employees.length > MAX_EMPLOYEES) {
                    return res.status(403).json({ message: "Maximum employee limit reached for your plan." });
                }

                // ===================== PREPARE INSERT =====================
                const educationDetails = [];

                employees.forEach(emp => {
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
                        attemptsLogins,
                        password,
                        insertDate,
                        email
                    ]);

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

                // ===================== INSERT USERS =====================
                const sqlUsers = `
                    INSERT INTO TC_USERS 
                    (EMP_ID, FIRST_NAME, LAST_NAME, MIDDLE_NAME, DISPLAY_NAME, GENDER, EMAIL, ORG_ID, START_DATE, STATUS,
                    MOBILE_NUMBER, ATTEMPTS_LOGIN, PASSWORD, CREATION_DATE, CREATED_BY)
                    VALUES ?
                `;

                db.query(sqlUsers, [insertDetails], (error, result) => {
                    if (error) {
                        console.log("Insert TC_USERS error:", error);
                        return res.status(500).json({ error });
                    }

                    const sqlEducation = `
                        INSERT INTO TC_USER_DETAILS 
                        (EMP_ID, DEGREE, UNIVERSITY, YOP, ORG_ID, CREATED_BY, CREATION_DATE)
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
        });

    });
};

module.exports = { addEmp };
