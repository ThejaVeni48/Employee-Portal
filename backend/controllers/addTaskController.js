const db = require("../config/db");

const addTask = (req, res) => {
  const {
    taskName,
    assignedTo,
    startDate,
    dueDate,
    taskStatus,
    companyId,
    empId,
    projectId,
  } = req.body;

  const sql = `INSERT INTO TASKS (task_name,assigned_to,status,START_DATE,END_DATE,COMPANY_ID,PROJECT_NO,CREATED_BY,CREATION_DATE)
VALUES(?,?,?,?,?,?,?,?,NOW())`;

  db.query(
    sql,
    [taskName, assignedTo, taskStatus, startDate, dueDate,companyId,projectId,empId],
    (error, result) => {
      if (error) {
        console.log("error occured", error);
        return res.status(500).json({ data: error });
      }

      console.log("result", result);
      return res.status(201).json({ data: result });
    }
  );
};

module.exports = { addTask };
