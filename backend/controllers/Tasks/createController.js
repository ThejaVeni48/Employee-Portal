// api in not use


const db = require('../../config/db');

const createTask = (req, res) => {
  const {
    taskName,
    assignee,
    status,
    startDate,
    endDate,
    companyId,
    projectId,
    empId,
  } = req.body;

  if (
    !taskName ||
    !assignee ||
    !status ||
    !startDate ||
    !endDate ||
    !companyId ||
    !projectId ||
    !empId
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO TASKS 
    (TASK_NAME, ASSIGNED_TO, STATUS, START_DATE, END_DATE, COMPANY_ID, PROJECT_ID, CREATED_BY, CREATION_DATE)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    taskName,
    assignee,
    status,
    startDate,
    endDate,
    companyId,
    projectId,
    empId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting task:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error", error: err });
    }

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      taskId: result.insertId,
    });
  });
};

module.exports = { createTask };
