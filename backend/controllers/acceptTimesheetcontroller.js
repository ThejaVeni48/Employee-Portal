
const db = require('../config/db');


// THIS API FOR MANAGER

// THIS API IS USED FOR ACCEPTING THE TIMESHEET

const acceptTimesheet = (req, res) => {
    const { EmpId, timesheetId, action, companyId } = req.body;
    console.log("timesheetId", timesheetId);
    console.log("EmpId", EmpId);
    console.log("companyId", companyId);

    const status = action === "Rejected" ? "Rejected" : "Approved";

    const updateStatus = `UPDATE TIMESHEETS SET STATUS = ? WHERE TIMESHEET_ID = ?`;

    // 1.Update timesheet
    db.query(updateStatus, [status, timesheetId], (err, result) => {
        if (err) {
            console.log("Error updating timesheet:", err);
            return res.status(500).json({ message: "Failed to update timesheet." });
        }

        // 2 Get WEEK_START
        const sql = `SELECT WEEK_START FROM TIMESHEETS WHERE TIMESHEET_ID = ?`;
        db.query(sql, [timesheetId], (weekError, weekResult) => {
            if (weekError) {
                console.log("Week fetch error:", weekError);
                return res.status(500).json({ message: "Failed to fetch timesheet week." });
            }

            if (!weekResult.length) {
                return res.status(404).json({ message: "Timesheet not found." });
            }

            const weekStart = weekResult[0].WEEK_START;
            const message = `Your timesheet for the week starting ${weekStart} has been ${status}.`;

            //  const tId = `T-${timesheetId}`
            // 3 Insert notification
             const insertSql = `
              INSERT INTO NOTIFICATIONS (EMPLOYEE_ID, COMPANY_ID, MESSAGE, TYPE,REFERENCE_ID)
              VALUES (?, ?, ?, ?,?)
            `;
            // db.query(insertSql, [EmpId, companyId, message, "Timesheet",timesheetId], (notiErr, notiResult) => {
            //   VALUES (?, ?, ?, ?,?)
            // `;
            db.query(insertSql, [EmpId, companyId, message, "Timesheet",timesheetId], (notiErr, notiResult) => {
                if (notiErr) {
                    console.log("Notification insert error:", notiErr);
                    // still respond 200 because timesheet update succeeded
                    return res.status(500).json({ message: "Timesheet updated but failed to insert notification." });
                }

                console.log("Notification inserted:", notiResult);
                return res.status(200).json({
                    message: `Timesheet ${status} successfully and notification sent.`
                });
            });
        });
    });
};

module.exports = {acceptTimesheet};
